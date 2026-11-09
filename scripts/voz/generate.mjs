#!/usr/bin/env node
/**
 * Genera el pack de voz de Mati con ElevenLabs.
 *
 * Uso:
 *   npm run voz -- --listar
 *   npm run voz -- --muestra
 *   npm run voz
 *   npm run voz -- --solo saludo,num-3 --forzar
 *   npm run voz -- --dry-run
 *
 * La clave y el identificador de voz se leen de .env.local (o .env).
 * Nunca se escriben en el juego ni en el repositorio.
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const CATALOG_PATH = join(ROOT, 'src', 'audio', 'voice', 'clips.json');
const OUTPUT_DIR = join(ROOT, 'public', 'voz', 'clips');
const MANIFEST_PATH = join(ROOT, 'public', 'voz', 'manifest.json');
const SAMPLE_DIR = join(ROOT, 'scripts', 'voz', 'muestras');
const PRONUNCIATION_PATH = join(ROOT, 'scripts', 'voz', 'pronunciation.json');
const STS_PATH = join(ROOT, 'scripts', 'voz', 'sts.json');

const DEFAULT_MODEL = 'eleven_v4';
const DEFAULT_LANGUAGE_CODE = 'es';
const DEFAULT_OUTPUT_FORMAT = 'mp3_44100_64';
const DEFAULT_DELAY_MS = 300;
const API = 'https://api.elevenlabs.io/v1';
const TONES = new Set(['happy', 'soft', 'neutral', 'question', 'excited']);
// Multilingual v2 detecta el idioma por su cuenta y no admite language_code.
const MODELS_WITHOUT_LANGUAGE_CODE = new Set(['eleven_multilingual_v2']);

// Más style y menos stability hacen la voz más expresiva y entusiasta.
// `excited` se reserva para números, colores y adjetivos de color.
const TONE_SETTINGS = {
  excited: { stability: 0.2, similarity_boost: 0.8, style: 0.85, use_speaker_boost: true },
  happy: { stability: 0.3, similarity_boost: 0.8, style: 0.7, use_speaker_boost: true },
  soft: { stability: 0.5, similarity_boost: 0.8, style: 0.4, use_speaker_boost: true },
  neutral: { stability: 0.4, similarity_boost: 0.8, style: 0.45, use_speaker_boost: true },
  question: { stability: 0.38, similarity_boost: 0.8, style: 0.58, use_speaker_boost: true },
};

const SAMPLE_IDS = [
  'saludo',
  'praise-bien',
  'enc-casi',
  'num-3',
  'color-yellow',
  'adj-amarillas',
  'q-cuantas-star',
  'func-encuentra',
  'plural-star',
  'es-flower',
];

// Ajustes solo para la generación. El texto del catálogo sigue siendo el correcto
// para el respaldo del navegador y las pruebas.
// El 2, el 3 y el 11 se corrigen con el diccionario de pronunciación (pronunciation.json).
const TTS_OVERRIDES = {
  'num-4': { text: '/ˈkwa.tɾo/' },
};

function printHelp() {
  console.log(`
Generador del pack de voz de Mati (ElevenLabs)

  npm run voz -- --listar          Lista las voces de tu cuenta
  npm run voz -- --muestra         Genera una muestra para escuchar la voz
  npm run voz                      Genera todos los clips y el manifiesto
  npm run voz -- --solo id1,id2    Genera solo esos clips
  npm run voz -- --forzar          Vuelve a generar aunque existan
  npm run voz -- --dry-run         Muestra el plan sin llamar a la API
  npm run voz -- --voz <voice_id>  Usa otra voz solo en esta ejecución
  npm run voz -- --idioma es       Fuerza el idioma de la voz (por defecto es)
  npm run voz -- --texto "..."     Texto libre para la muestra

Diccionario de pronunciación:
  Se lee de scripts/voz/pronunciation.json (id y versión). Si no existe, se genera sin diccionario.

Clips con voz nativa:
  Se configuran en scripts/voz/sts.json (voz de origen e IDs). Esos clips se generan con la voz
  de origen y se convierten después a la voz final.

Variables en .env.local:
  ELEVENLABS_API_KEY       (obligatoria)
  ELEVENLABS_VOICE_ID      (obligatoria, se ve con --listar)
  ELEVENLABS_MODEL         (opcional, por defecto ${DEFAULT_MODEL})
  ELEVENLABS_LANGUAGE_CODE (opcional, por defecto ${DEFAULT_LANGUAGE_CODE})
  ELEVENLABS_OUTPUT_FORMAT (opcional, por defecto ${DEFAULT_OUTPUT_FORMAT})
  ELEVENLABS_DELAY_MS      (opcional, pausa entre peticiones, por defecto ${DEFAULT_DELAY_MS})
`);
}

function parseArgs(argv) {
  const options = {
    listar: false,
    muestra: false,
    forzar: false,
    dryRun: false,
    ayuda: false,
    solo: null,
    voz: null,
    texto: null,
    modelo: null,
    idioma: null,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--listar') options.listar = true;
    else if (arg === '--muestra') options.muestra = true;
    else if (arg === '--forzar') options.forzar = true;
    else if (arg === '--dry-run') options.dryRun = true;
    else if (arg === '--ayuda' || arg === '--help' || arg === '-h') options.ayuda = true;
    else if (arg === '--solo' || arg === '--voz' || arg === '--texto' || arg === '--modelo' || arg === '--idioma') {
      const value = argv[++i];
      if (!value || value.startsWith('--')) throw new Error(`Falta el valor de ${arg}`);
      if (arg === '--solo') options.solo = value;
      if (arg === '--voz') options.voz = value;
      if (arg === '--texto') options.texto = value;
      if (arg === '--modelo') options.modelo = value;
      if (arg === '--idioma') options.idioma = value;
    } else {
      throw new Error(`Opción desconocida: ${arg}`);
    }
  }

  if (options.texto) options.muestra = true;
  return options;
}

function parseEnvFile(path) {
  if (!existsSync(path)) return {};
  const values = {};
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match) continue;
    let value = match[2];
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    values[match[1]] = value.replace(/\\n/g, '\n');
  }
  return values;
}

function loadEnv() {
  const merged = {
    ...parseEnvFile(join(ROOT, '.env')),
    ...parseEnvFile(join(ROOT, '.env.local')),
  };
  for (const key of [
    'ELEVENLABS_API_KEY',
    'ELEVENLABS_VOICE_ID',
    'ELEVENLABS_MODEL',
    'ELEVENLABS_LANGUAGE_CODE',
    'ELEVENLABS_OUTPUT_FORMAT',
    'ELEVENLABS_DELAY_MS',
  ]) {
    if (process.env[key]) merged[key] = process.env[key];
  }
  return merged;
}

function readCatalog() {
  const catalog = JSON.parse(readFileSync(CATALOG_PATH, 'utf8'));
  if (!catalog || typeof catalog !== 'object' || Array.isArray(catalog)) {
    throw new Error('clips.json no contiene un objeto de clips.');
  }
  for (const [id, clip] of Object.entries(catalog)) {
    if (!clip || typeof clip.text !== 'string' || !clip.text.trim()) {
      throw new Error(`El clip ${id} no tiene texto.`);
    }
    if (!TONES.has(clip.tone)) throw new Error(`El clip ${id} tiene un tono desconocido: ${clip.tone}`);
  }
  return catalog;
}

function readPronunciationDictionary() {
  if (!existsSync(PRONUNCIATION_PATH)) return null;
  try {
    const data = JSON.parse(readFileSync(PRONUNCIATION_PATH, 'utf8'));
    if (!data || typeof data.id !== 'string' || typeof data.versionId !== 'string') return null;
    return { id: data.id, versionId: data.versionId };
  } catch {
    console.warn('Aviso: no se pudo leer scripts/voz/pronunciation.json; se genera sin diccionario.');
    return null;
  }
}

function readStsConfig() {
  if (!existsSync(STS_PATH)) return null;
  try {
    const data = JSON.parse(readFileSync(STS_PATH, 'utf8'));
    if (!data || typeof data.sourceVoiceId !== 'string' || !Array.isArray(data.ids)) return null;
    return { sourceVoiceId: data.sourceVoiceId, ids: new Set(data.ids) };
  } catch {
    console.warn('Aviso: no se pudo leer scripts/voz/sts.json; se genera todo con texto a voz.');
    return null;
  }
}

function selectIds(catalog, solo) {
  if (!solo) return Object.keys(catalog);
  const ids = solo
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
  const unknown = ids.filter((id) => !catalog[id]);
  if (unknown.length > 0) throw new Error(`No existen en el catálogo: ${unknown.join(', ')}`);
  return [...new Set(ids)];
}

function sleep(ms) {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, ms));
}

function retryDelay(response, attempt) {
  const header = response?.headers.get('retry-after');
  const seconds = Number(header);
  if (Number.isFinite(seconds) && seconds > 0) return Math.min(seconds * 1000, 20000);
  return Math.min(1000 * 2 ** (attempt - 1), 16000);
}

async function requestClip({ apiKey, voiceId, model, languageCode, outputFormat, text, tone, label, pronunciation }) {
  const url = `${API}/text-to-speech/${encodeURIComponent(voiceId)}?output_format=${encodeURIComponent(outputFormat)}`;
  const settings = TONE_SETTINGS[tone] ?? TONE_SETTINGS.neutral;
  const body = {
    text,
    model_id: model,
    voice_settings: settings,
  };
  if (languageCode && !MODELS_WITHOUT_LANGUAGE_CODE.has(model)) {
    body.language_code = languageCode;
  }
  if (pronunciation) {
    body.pronunciation_dictionary_locators = [
      {
        pronunciation_dictionary_id: pronunciation.id,
        version_id: pronunciation.versionId,
      },
    ];
  }

  for (let attempt = 1; attempt <= 4; attempt++) {
    let response = null;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(90000),
      });
    } catch (error) {
      if (attempt === 4) throw new Error(`Error de red al generar ${label}: ${error.message}`);
      const wait = retryDelay(null, attempt);
      console.warn(`  Reintento ${attempt}/3 para ${label} (red, espera ${Math.round(wait / 1000)} s)`);
      await sleep(wait);
      continue;
    }

    if (!response.ok) {
      const detail = (await response.text().catch(() => '')).replace(/\s+/g, ' ').slice(0, 400);
      if (response.status === 401 || response.status === 403) {
        throw new Error(
          `ElevenLabs rechazó la clave (${response.status}). Revisa ELEVENLABS_API_KEY en .env.local. ${detail}`,
        );
      }
      if (response.status === 404) {
        throw new Error(`No se encontró la voz ${voiceId}. Revisa ELEVENLABS_VOICE_ID. ${detail}`);
      }
      if ((response.status === 429 || response.status >= 500) && attempt < 4) {
        const wait = retryDelay(response, attempt);
        console.warn(
          `  Reintento ${attempt}/3 para ${label} (${response.status}, espera ${Math.round(wait / 1000)} s)`,
        );
        await sleep(wait);
        continue;
      }
      throw new Error(`ElevenLabs respondió ${response.status} al generar ${label}. ${detail}`);
    }

    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length < 256) throw new Error(`La respuesta para ${label} está vacía o es demasiado corta.`);
    return bytes;
  }

  throw new Error(`No se pudo generar ${label}.`);
}

async function requestVoiceConversion({ apiKey, voiceId, outputFormat, input, tone, label }) {
  const form = new FormData();
  form.append('audio', new Blob([input], { type: 'audio/mpeg' }), `${label}.mp3`);
  form.append('model_id', 'eleven_multilingual_sts_v2');
  form.append('voice_settings', JSON.stringify(TONE_SETTINGS[tone] ?? TONE_SETTINGS.neutral));

  let response = null;
  try {
    response = await fetch(
      `${API}/speech-to-speech/${encodeURIComponent(voiceId)}?output_format=${encodeURIComponent(outputFormat)}`,
      {
        method: 'POST',
        headers: { 'xi-api-key': apiKey, Accept: 'audio/mpeg' },
        body: form,
        signal: AbortSignal.timeout(120000),
      },
    );
  } catch (error) {
    throw new Error(`Error de red al convertir ${label} a la voz final: ${error.message}`);
  }

  if (!response.ok) {
    const detail = (await response.text().catch(() => '')).replace(/\s+/g, ' ').slice(0, 400);
    throw new Error(`ElevenLabs respondió ${response.status} al convertir ${label}. ${detail}`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 256) throw new Error(`La conversión de ${label} está vacía o es demasiado corta.`);
  return bytes;
}

function writeClip(directory, id, bytes) {
  mkdirSync(directory, { recursive: true });
  const finalPath = join(directory, `${id}.mp3`);
  const temporaryPath = `${finalPath}.tmp`;
  writeFileSync(temporaryPath, bytes);
  renameSync(temporaryPath, finalPath);
  return finalPath;
}

async function generateItems({ items, directory, options, config }) {
  let generated = 0;
  let skipped = 0;

  for (let index = 0; index < items.length; index++) {
    const item = items[index];
    const target = join(directory, `${item.id}.mp3`);
    const ttsText = item.ttsText ?? item.text;
    if (!options.forzar && existsSync(target) && statSync(target).size > 256) {
      skipped += 1;
      console.log(`[${index + 1}/${items.length}] ${item.id}: ya existe, se omite.`);
      continue;
    }

    const isSts = config.sts?.ids.has(item.id) ?? false;
    console.log(
      `[${index + 1}/${items.length}] ${item.id}: ${ttsText}${ttsText !== item.text ? ` (${item.text})` : ''}${isSts ? ' · voz nativa → Jessica' : ''}`,
    );
    let bytes;
    if (isSts) {
      const source = await requestClip({
        ...config,
        voiceId: config.sts.sourceVoiceId,
        text: ttsText,
        tone: item.tone,
        label: `${item.id}-fuente`,
      });
      bytes = await requestVoiceConversion({
        apiKey: config.apiKey,
        voiceId: config.voiceId,
        outputFormat: config.outputFormat,
        input: source,
        tone: item.tone,
        label: item.id,
      });
    } else {
      bytes = await requestClip({
        ...config,
        text: ttsText,
        tone: item.tone,
        label: item.id,
      });
    }
    writeClip(directory, item.id, bytes);
    generated += 1;
    if (index < items.length - 1) await sleep(config.delayMs);
  }

  return { generated, skipped };
}

async function listVoices(apiKey) {
  if (!apiKey) throw new Error('Falta ELEVENLABS_API_KEY en .env.local.');
  const response = await fetch(`${API}/voices`, { headers: { 'xi-api-key': apiKey } });
  if (!response.ok) {
    const detail = (await response.text().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300);
    throw new Error(`No se pudieron listar las voces (${response.status}). ${detail}`);
  }
  const data = await response.json();
  const voices = Array.isArray(data.voices) ? data.voices : [];
  if (voices.length === 0) {
    console.log('La cuenta no tiene voces disponibles.');
    return;
  }

  console.log('\nVoces disponibles en tu cuenta:\n');
  for (const voice of voices) {
    const labels = voice.labels && typeof voice.labels === 'object' ? Object.values(voice.labels).join(', ') : '';
    console.log(`  ${voice.voice_id}  ${voice.name}${labels ? `  (${labels})` : ''}`);
  }
  console.log('\nCopia el identificador que quieras en ELEVENLABS_VOICE_ID dentro de .env.local.\n');
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function writeSamplePage(items) {
  const version = Date.now();
  const rows = items
    .map(
      (item) => `      <figure>
        <figcaption><strong>${escapeHtml(item.id)}</strong><span>${escapeHtml(item.text)}</span></figcaption>
        <audio controls preload="metadata" src="./${encodeURIComponent(item.id)}.mp3?v=${version}"></audio>
      </figure>`,
    )
    .join('\n');
  const html = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Muestras de voz de Mati</title>
    <style>
      body { max-width: 760px; margin: 0 auto; padding: 24px; font-family: system-ui, sans-serif; color: #3b2a5a; background: #fff8ef; }
      h1 { margin-top: 0; }
      figure { margin: 0 0 18px; padding: 14px; border-radius: 16px; background: #fff; box-shadow: 0 4px 0 #eadfd2; }
      figcaption { display: grid; gap: 3px; margin-bottom: 10px; }
      figcaption span { color: #6e5d92; }
      audio { width: 100%; }
    </style>
  </head>
  <body>
    <h1>Muestras de voz de Mati</h1>
    <p>Escucha estas frases antes de generar el pack completo. Si la voz no convence, cambia <code>ELEVENLABS_VOICE_ID</code> y vuelve a ejecutar <code>npm run voz -- --muestra --forzar</code>.</p>
${rows}
  </body>
</html>
`;
  writeFileSync(join(SAMPLE_DIR, 'index.html'), html);
}

function readManifestClips(catalog) {
  if (!existsSync(OUTPUT_DIR)) return {};
  const files = new Set(readdirSync(OUTPUT_DIR).filter((file) => file.endsWith('.mp3')));
  return Object.fromEntries(
    Object.keys(catalog)
      .filter((id) => files.has(`${id}.mp3`))
      .sort()
      .map((id) => [id, `clips/${id}.mp3`]),
  );
}

function warnAboutPackChange({ voiceId, model, languageCode, forzar }) {
  if (!existsSync(MANIFEST_PATH) || forzar) return;
  try {
    const previous = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
    if (previous.voiceId && previous.voiceId !== voiceId) {
      throw new Error(
        'El manifiesto actual se generó con otra voz. Para no mezclar voces, vuelve a generar con --forzar.',
      );
    }
    if (previous.modelId && previous.modelId !== model) {
      throw new Error(
        'El manifiesto actual se generó con otro modelo. Para no mezclar modelos, vuelve a generar con --forzar.',
      );
    }
    if (previous.languageCode && previous.languageCode !== languageCode) {
      throw new Error(
        'El manifiesto actual se generó con otro idioma. Para no mezclar idiomas, vuelve a generar con --forzar.',
      );
    }
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('El manifiesto actual')) throw error;
    /* un manifiesto ilegible se sobrescribirá al terminar */
  }
}

function writeManifest({ voiceId, model, languageCode, pronunciation, sts, clips }) {
  const manifest = {
    version: 1,
    voiceId,
    modelId: model,
    languageCode,
    generatedAt: new Date().toISOString(),
    clips,
  };
  if (pronunciation) {
    manifest.pronunciationDictionary = {
      id: pronunciation.id,
      versionId: pronunciation.versionId,
    };
  }
  if (sts) {
    manifest.stsSourceVoiceId = sts.sourceVoiceId;
  }
  mkdirSync(dirname(MANIFEST_PATH), { recursive: true });
  writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
  return Object.keys(clips).length;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.ayuda) {
    printHelp();
    return;
  }

  const catalog = readCatalog();
  const env = loadEnv();
  const pronunciation = readPronunciationDictionary();
  const sts = readStsConfig();
  const apiKey = (env.ELEVENLABS_API_KEY ?? '').trim();
  const voiceId = (options.voz ?? env.ELEVENLABS_VOICE_ID ?? '').trim();
  const model = (options.modelo || env.ELEVENLABS_MODEL || DEFAULT_MODEL).trim();
  const languageCode = (options.idioma || env.ELEVENLABS_LANGUAGE_CODE || DEFAULT_LANGUAGE_CODE).trim();
  const outputFormat = (env.ELEVENLABS_OUTPUT_FORMAT || DEFAULT_OUTPUT_FORMAT).trim();
  const delayMs = Math.max(0, Number(env.ELEVENLABS_DELAY_MS || DEFAULT_DELAY_MS) || 0);

  if (options.listar) {
    if (options.dryRun) {
      console.log('--listar consulta la API de ElevenLabs; no se ejecuta con --dry-run.');
      return;
    }
    await listVoices(apiKey);
    return;
  }

  const ids = selectIds(catalog, options.solo);
  const toItem = (id) => ({
    id,
    text: catalog[id].text,
    ttsText: TTS_OVERRIDES[id]?.text ?? catalog[id].text,
    tone: TTS_OVERRIDES[id]?.tone ?? catalog[id].tone,
  });
  const items = options.muestra
    ? options.texto
      ? [{ id: 'texto-libre', text: options.texto, ttsText: options.texto, tone: 'happy' }]
      : SAMPLE_IDS.map(toItem)
    : ids.map(toItem);
  const directory = options.muestra ? SAMPLE_DIR : OUTPUT_DIR;

  if (options.dryRun) {
    console.log(`Catálogo: ${Object.keys(catalog).length} clips.`);
    console.log(`Se generarían ${items.length} clips en ${directory}.`);
    if (!apiKey) console.log('Aviso: falta ELEVENLABS_API_KEY en .env.local.');
    if (!voiceId) console.log('Aviso: falta ELEVENLABS_VOICE_ID en .env.local.');
    console.log('Modelo:', model, '· Idioma:', languageCode, '· Formato:', outputFormat, '· Pausa:', `${delayMs} ms`);
    console.log(
      'Diccionario de pronunciación:',
      pronunciation ? `${pronunciation.id} (versión ${pronunciation.versionId})` : 'ninguno',
    );
    if (sts) {
      console.log(
        'Clips con voz nativa convertida a la voz final:',
        `${[...sts.ids].join(', ')} (fuente ${sts.sourceVoiceId})`,
      );
    }
    for (const item of items) {
      const ttsText = item.ttsText ?? item.text;
      const suffix = sts?.ids.has(item.id) ? ' · voz nativa → Jessica' : '';
      console.log(`  - ${item.id}: ${ttsText}${ttsText !== item.text ? ` (respaldo: ${item.text})` : ''}${suffix}`);
    }
    return;
  }

  if (!apiKey) {
    throw new Error(
      'Falta ELEVENLABS_API_KEY. Crea .env.local a partir de .env.example y pega ahí tu clave; no la escribas en el chat.',
    );
  }
  if (!voiceId) {
    throw new Error(
      'Falta ELEVENLABS_VOICE_ID. Ejecuta "npm run voz -- --listar", elige una voz y copia su identificador en .env.local.',
    );
  }

  if (!options.muestra) {
    warnAboutPackChange({ voiceId, model, languageCode, forzar: options.forzar });
  }

  console.log(`Voz: ${voiceId} · Modelo: ${model} · Idioma: ${languageCode} · Formato: ${outputFormat}`);
  if (pronunciation) {
    console.log(`Diccionario de pronunciación: ${pronunciation.id} · versión ${pronunciation.versionId}`);
  }
  if (sts) {
    console.log(`Voz nativa para los clips corregidos: ${sts.sourceVoiceId} (${[...sts.ids].join(', ')})`);
  }
  const result = await generateItems({
    items,
    directory,
    options,
    config: { apiKey, voiceId, model, languageCode, outputFormat, delayMs, pronunciation, sts },
  });

  if (options.muestra) {
    writeSamplePage(items);
    console.log(`\nMuestras listas en ${SAMPLE_DIR} (${result.generated} nuevas, ${result.skipped} omitidas).`);
    console.log('Abre index.html para escucharlas. Si te gusta la voz, ejecuta "npm run voz".');
    return;
  }

  const clips = readManifestClips(catalog);
  const total = writeManifest({ voiceId, model, languageCode, pronunciation, sts, clips });
  console.log(`\nClips nuevos: ${result.generated}. Omitidos: ${result.skipped}. En el manifiesto: ${total}.`);
  console.log(`Manifiesto: ${MANIFEST_PATH}`);
  console.log('Ejecuta "npm run build" para incluir el pack en la versión de producción.');
}

main().catch((error) => {
  console.error(`\nError: ${error.message}`);
  process.exitCode = 1;
});
