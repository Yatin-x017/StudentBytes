import type { CanvasCourse, CanvasAssignment, CanvasAnnouncement } from './types';

const PROXY = 'https://api.allorigins.win/get?url=';

function canvasUrl(domain: string, path: string): string {
  const base = domain.startsWith('http') ? domain : `https://${domain}`;
  const cleaned = base.replace(/\/$/, '');
  return `${PROXY}${encodeURIComponent(`${cleaned}/api/v1${path}`)}`;
}

async function canvasFetch<T>(
  domain: string,
  token: string,
  path: string
): Promise<T> {
  // allorigins proxies don't support custom headers,
  // so append access_token as query param (Canvas supports this)
  const separator = path.includes('?') ? '&' : '?';
  const url = canvasUrl(domain, `${path}${separator}access_token=${token}&per_page=50`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Canvas API error: ${res.status}`);
  const json = await res.json();
  // allorigins wraps response in { contents: "..." }
  return JSON.parse(json.contents) as T;
}

export async function fetchCourses(domain: string, token: string) {
  return canvasFetch<CanvasCourse[]>(
    domain, token,
    '/courses?enrollment_state=active&state[]=available'
  );
}

export async function fetchAssignments(domain: string, token: string, courseId: number) {
  return canvasFetch<CanvasAssignment[]>(
    domain, token,
    `/courses/${courseId}/assignments?order_by=due_at&bucket=future`
  );
}

export async function fetchAnnouncements(domain: string, token: string, courseId: number) {
  return canvasFetch<CanvasAnnouncement[]>(
    domain, token,
    `/courses/${courseId}/discussion_topics?only_announcements=true&per_page=5`
  );
}

export function formatDueDate(due_at: string | null): string {
  if (!due_at) return 'No due date';
  const d = new Date(due_at);
  const now = new Date();
  const diff = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return 'Overdue';
  if (diff === 0) return 'Due today';
  if (diff === 1) return 'Due tomorrow';
  return `Due in ${diff} days`;
}

export function dueDateColor(due_at: string | null): string {
  if (!due_at) return 'text-text-muted';
  const diff = Math.ceil((new Date(due_at).getTime() - Date.now()) / 86400000);
  if (diff < 0) return 'text-error';
  if (diff <= 2) return 'text-amber-400';
  return 'text-success';
}
