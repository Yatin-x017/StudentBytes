import type {
  CanvasCourse,
  CanvasAssignment,
  CanvasAnnouncement,
} from './types';

async function canvasFetch<T>(
  domain: string,
  token: string,
  path: string
): Promise<T> {
  const params = new URLSearchParams({
    domain: domain.replace(/^https?:\/\//, '').replace(/\/$/, ''),
    token,
    path,
  });

  const res = await fetch(`/api/canvas?${params.toString()}`);

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export async function fetchCourses(
  domain: string,
  token: string
): Promise<CanvasCourse[]> {
  return canvasFetch<CanvasCourse[]>(
    domain,
    token,
    '/courses?enrollment_state=active&state[]=available'
  );
}

export async function fetchAssignments(
  domain: string,
  token: string,
  courseId: number
): Promise<CanvasAssignment[]> {
  return canvasFetch<CanvasAssignment[]>(
    domain,
    token,
    `/courses/${courseId}/assignments?order_by=due_at&bucket=future`
  );
}

export async function fetchAnnouncements(
  domain: string,
  token: string,
  courseId: number
): Promise<CanvasAnnouncement[]> {
  return canvasFetch<CanvasAnnouncement[]>(
    domain,
    token,
    `/courses/${courseId}/discussion_topics?only_announcements=true&per_page=5`
  );
}

export async function fetchAllUpcomingAssignments(
  domain: string,
  token: string,
  courses: CanvasCourse[]
): Promise<(CanvasAssignment & { courseName: string })[]> {
  const results = await Promise.allSettled(
    courses.map(async (course) => {
      const assignments = await fetchAssignments(domain, token, course.id);
      return assignments.map((a) => ({ ...a, courseName: course.name }));
    })
  );

  return results
    .filter(
      (
        r
      ): r is PromiseFulfilledResult<
        (CanvasAssignment & { courseName: string })[]
      > => r.status === 'fulfilled'
    )
    .flatMap((r) => r.value)
    .sort((a, b) => {
      if (!a.due_at) return 1;
      if (!b.due_at) return -1;
      return new Date(a.due_at).getTime() - new Date(b.due_at).getTime();
    });
}

export function formatDueDate(due_at: string | null): string {
  if (!due_at) return 'No due date';
  const diff = Math.ceil(
    (new Date(due_at).getTime() - Date.now()) / 86400000
  );
  if (diff < 0) return 'Overdue';
  if (diff === 0) return 'Due today';
  if (diff === 1) return 'Due tomorrow';
  if (diff <= 7) return `In ${diff} days`;
  return new Date(due_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
}

export function dueDateColor(due_at: string | null): string {
  if (!due_at) return 'text-text-muted';
  const diff = Math.ceil(
    (new Date(due_at).getTime() - Date.now()) / 86400000
  );
  if (diff < 0) return 'text-error font-bold';
  if (diff <= 2) return 'text-amber-400 font-bold';
  if (diff <= 7) return 'text-primary';
  return 'text-success';
}
