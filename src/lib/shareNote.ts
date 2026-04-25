import type { Note } from './types';

export function encodeNote(note: Note): string {
  const data = JSON.stringify({
    title: note.title,
    content: note.content,
    topic: note.topic,
    createdAt: note.createdAt,
  });
  // Use btoa for base64 encoding, handling non-ASCII characters with unescape/encodeURIComponent
  return btoa(unescape(encodeURIComponent(data)));
}

export function decodeNote(encoded: string): Partial<Note> | null {
  try {
    const data = decodeURIComponent(escape(atob(encoded)));
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function generateShareUrl(note: Note): string {
  const encoded = encodeNote(note);
  return `${window.location.origin}/shared?note=${encoded}`;
}
