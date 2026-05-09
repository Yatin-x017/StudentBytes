// ─── Chat Utilities ──────────────────────────────────────────────────────────

/**
 * Simple hash function for deterministic output from a string.
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Generate a deterministic anonymous display name from a user ID.
 * e.g., "Anon-7f3a"
 */
export function generateAnonName(userId: string): string {
  const hash = simpleHash(userId);
  const hex = hash.toString(16).slice(0, 4).padStart(4, '0');
  return `Anon-${hex}`;
}

/**
 * A curated palette of avatar background colors — vibrant but readable.
 */
const AVATAR_COLORS = [
  '#7c6af7', // violet
  '#f97066', // coral
  '#10b981', // emerald
  '#f59e0b', // amber
  '#3b82f6', // blue
  '#ec4899', // pink
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#ef4444', // red
  '#14b8a6', // teal
  '#f472b6', // rose
  '#6366f1', // indigo
];

/**
 * Generate a deterministic avatar color from a user ID.
 */
export function generateAnonColor(userId: string): string {
  const hash = simpleHash(userId);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

/**
 * Basic profanity filter — blocks common offensive terms.
 * Uses word-boundary matching to avoid false positives.
 */
const BLOCKED_WORDS = [
  'fuck', 'shit', 'ass', 'bitch', 'damn', 'dick', 'cock', 'pussy',
  'bastard', 'cunt', 'whore', 'slut', 'fag', 'retard', 'nigger',
  'nigga', 'chutiya', 'madarchod', 'bhenchod', 'gaand', 'lund',
  'randi', 'harami', 'bhosdike', 'chut', 'gandu',
  'kill yourself', 'kys',
];

const BLOCKED_REGEX = new RegExp(
  `\\b(${BLOCKED_WORDS.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
  'i'
);

export function containsProfanity(text: string): boolean {
  return BLOCKED_REGEX.test(text);
}

/**
 * Censor profanity in a string by replacing matched words with asterisks.
 */
export function censorProfanity(text: string): string {
  return text.replace(BLOCKED_REGEX, (match) => '*'.repeat(match.length));
}

/**
 * Format a timestamp as relative time: "just now", "2m ago", "1h ago", etc.
 */
export function formatRelativeTime(date: Date | string): string {
  const now = Date.now();
  const then = typeof date === 'string' ? new Date(date).getTime() : date.getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 10) return 'just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;

  return new Date(then).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Validate a chat message before sending.
 * Returns an error string, or null if valid.
 */
export function validateMessage(content: string): string | null {
  const trimmed = content.trim();
  if (!trimmed) return 'Message cannot be empty';
  if (trimmed.length > 500) return 'Message too long (max 500 characters)';
  if (containsProfanity(trimmed)) return 'Message contains inappropriate language';
  // Detect spam patterns (excessive repetition)
  if (/(.)\1{9,}/.test(trimmed)) return 'Message looks like spam';
  return null;
}

export const MAX_MESSAGE_LENGTH = 500;
export const RATE_LIMIT_MS = 3000; // 3 seconds between messages
