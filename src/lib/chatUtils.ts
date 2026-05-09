/**
 * Deterministic anonymous name generation from user ID
 */
export function generateAnonName(userId: string): string {
  if (!userId) return 'Anon-????';
  // Use first 4 chars of the UUID to make it unique but consistent
  const hash = userId.split('-').pop()?.slice(-4) || 'anon';
  return `Anon-${hash}`;
}

/**
 * Deterministic avatar color generation from user ID
 */
export function generateAnonColor(userId: string): string {
  const colors = [
    '#7c6af7', // Primary
    '#f97066', // Accent
    '#10b981', // Success
    '#f59e0b', // Warning
    '#6366f1', // Indigo
    '#ec4899', // Pink
    '#8b5cf6', // Violet
    '#3b82f6', // Blue
  ];

  if (!userId) return colors[0];

  // Simple hash of the string
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

/**
 * Client-side profanity filter
 */
const BLOCKLIST = [
  'fuck', 'shit', 'asshole', 'bitch', 'cunt', 'dick', 'pussy', 'nigger', 'faggot',
  'bastard', 'slut', 'whore', 'rape', 'retard', 'autism', 'dumbass', 'idiot',
  'spam', 'scam', 'crypto', 'nft', 'money', 'free', 'buy', 'sell'
];

export function containsProfanity(text: string): boolean {
  const normalized = text.toLowerCase();
  return BLOCKLIST.some(word => normalized.includes(word));
}

/**
 * Format relative time
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 5) return 'just now';
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}
