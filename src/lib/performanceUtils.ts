import type { PerformanceScore } from './types';

export function calculateSGPA(scores: PerformanceScore[]): number {
  if (scores.length === 0) return 0;
  const avg = scores.reduce((s, q) => s + (q.score / q.max_score) * 10, 0)
    / scores.length;
  return Math.round(avg * 100) / 100;
}

export function projectCGPA(
  semesterScores: { semester: number; sgpa: number }[]
): { semester: number; projected: number }[] {
  if (semesterScores.length === 0) return [];
  const cgpaData: { semester: number; projected: number }[] = [];
  let total = 0;
  for (const s of semesterScores) {
    total += s.sgpa;
    cgpaData.push({
      semester: s.semester,
      projected: Math.round((total / s.semester) * 100) / 100,
    });
  }
  return cgpaData;
}

export function getScoreTrend(scores: PerformanceScore[]): 'improving' | 'declining' | 'stable' {
  if (scores.length < 2) return 'stable';
  const recentSlice = scores.slice(-3);
  const olderSlice = scores.slice(0, 3);
  const recent = recentSlice.reduce((s, q) => s + q.score, 0) / recentSlice.length;
  const older = olderSlice.reduce((s, q) => s + q.score, 0) / olderSlice.length;
  if (recent > older + 5) return 'improving';
  if (recent < older - 5) return 'declining';
  return 'stable';
}
