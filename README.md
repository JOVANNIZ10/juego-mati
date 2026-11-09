# El mundo mágico de Mati 🌈

Juego educativo infantil para aprender los números del 1 al 20 y los colores.
Pensado para tablets, con botones grandes, voz en español de España y sonidos sintetizados.

## Requisitos

- Node.js 20 o superior.

## Ejecutar en local

```bash
npm install
npm run dev
```

Con `--host` el servidor de desarrollo también es accesible desde la tablet en la misma red Wi-Fi.

## Compilar y desplegar

```bash
npm run build
```

La carpeta `dist/` es un sitio estático. Puede subirse a cualquier hosting estático
(GitHub Pages, Netlify, Vercel, un servidor Nginx...). Las rutas usan `#` y la configuración
`base: './'` permite publicarlo en cualquier subcarpeta.

## Pruebas

```bash
npm test
```

## Estructura

```
src/
  app/          Enrutado por hash y secciones
  audio/        Pack de voz, respaldo con Web Speech API, efectos y ajuste de sonido
  components/   Mati, marco de juego, cuadrícula adaptable, botones y fondo
  core/         Utilidades puras (aleatoriedad, colores, cuadrícula, temporizadores)
  data/         Números, colores y objetos del juego
  effects/      Confeti y destellos
  feedback/     Reacciones de acierto y de ánimo
  games/        Minijuegos: numbers/, colors/, combined/ (y sus generadores de rondas)
  illustrations/ Ilustraciones SVG de objetos y tarjetas
  lang/         Gramática en español (números, plurales, concordancia de colores)
  screens/      Pantalla de inicio y menús
```

## Voz de ElevenLabs

El juego incluye un pack de voz generado una sola vez con ElevenLabs. Los MP3 se guardan en
`public/voz/clips/` y se reproducen sin conexión; el script de generación nunca forma parte del
juego ni del paquete que se sube a la tablet.

### Preparar la clave

1. Copia `.env.example` como `.env.local`.
2. Rellena `ELEVENLABS_API_KEY` con tu clave. No la pegues en el chat ni la subas al repositorio.
3. Ejecuta `npm run voz -- --listar` y copia el identificador de la voz elegida en
   `ELEVENLABS_VOICE_ID` dentro de `.env.local`.

### Escuchar antes de generar todo

```bash
npm run voz -- --muestra
```

Genera unas frases de prueba en `scripts/voz/muestras/` y crea un `index.html` para escucharlas.
Si la voz no convence, cambia `ELEVENLABS_VOICE_ID` y repite con `--forzar`.

El generador usa por defecto el modelo `eleven_v4` con `language_code: es`, de modo que fuerza el
español aunque la voz sea de otra lengua. Puedes cambiarlo con `--modelo` y `--idioma`.

Las palabras que la voz pronuncia mal se corrigen con un diccionario de pronunciación de ElevenLabs.
Sus datos están en `scripts/voz/pronunciation.json` y el generador los envía en cada petición. Sirve
para fijar la pronunciación castellana de «dos», «tres» y «once» sin cambiar el texto del catálogo
(que sigue siendo el respaldo correcto para la voz del sistema).

Cuando ni siquiera el diccionario consigue una pronunciación natural, `scripts/voz/sts.json` permite
marcar clips concretos para generarlos con una voz española nativa y convertir después ese audio a la
voz final. Ahora mismo se usa para el 2, el 11 y las variantes de «negro» (`color-black`, `adj-negra`,
`adj-negros`, `adj-negras`, `find-color-black` y `es-cat`), con Cristina como voz de origen. El texto
del catálogo no cambia.

### Generar el pack completo

```bash
npm run voz
npm run build
```

Se crean 172 clips cortos y el manifiesto `public/voz/manifest.json`. Las frases largas se montan
en el juego uniendo clips, con una pausa breve entre ellos. Si más adelante cambias de voz, vuelve
a generar con `--forzar`; si no, se reutilizan los audios existentes.

Opciones útiles:

```bash
npm run voz -- --solo saludo,num-3      # regenerar solo algunos clips
npm run voz -- --forzar                 # regenerar aunque ya existan
npm run voz -- --idioma es              # forzar el idioma (por defecto es)
npm run voz -- --dry-run                # ver el plan sin llamar a la API
npm run voz -- --ayuda                  # ayuda completa
```

El manifiesto vacío que se incluye por defecto desactiva el pack y hace que el juego use la voz del
sistema. Esa misma voz actúa como respaldo si falta un clip o el navegador no puede reproducirlo:
el juego nunca se queda mudo.

## Notas

- La voz principal es el pack de ElevenLabs. La voz del sistema se usa solo como respaldo y prefiere
  una voz `es-ES` si está instalada.
- El audio se desbloquea con el primer toque, como exigen los navegadores.
- El botón de sonido 🔊 silencia voz y efectos, y la preferencia se guarda en el dispositivo.
- No hay música de fondo: los sonidos aparecen solo al interactuar y tienen un límite de frecuencia.
- No se usan servicios externos durante el juego: la fuente Fredoka y los audios van incluidos en el
  paquete.
