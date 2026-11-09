import type { ClipId } from './voiceCatalog';

export const PRAISE_CLIPS = [
  'praise-bien',
  'praise-genial',
  'praise-conseguido',
  'praise-campeon',
  'praise-que-bien',
  'praise-fantastico',
  'praise-estrella',
] as const satisfies readonly ClipId[];

export const ENCOURAGE_CLIPS = [
  'enc-casi',
  'enc-otra-vez',
  'enc-tu-puedes',
  'enc-vamos-otra',
  'enc-lo-consigues',
] as const satisfies readonly ClipId[];

export const CHATTER_CLIPS = [
  'chat-hola-amigo',
  'chat-jeje',
  'chat-que-divertido',
  'chat-me-encanta',
  'chat-vamos-jugar',
] as const satisfies readonly ClipId[];
