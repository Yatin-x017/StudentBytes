// SM-2 algorithm implementation
export interface SRCard {
  id: string;
  topic: string;
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  nextReviewDate: string; // ISO date string YYYY-MM-DD
  lastScore: number;
}

// score: 0-1 (fraction correct, e.g. 3/5 = 0.6)
export function calculateNextReview(card: SRCard, score: number): SRCard {
  const q = Math.round(score * 5); // convert to 0-5 scale

  let { easeFactor, intervalDays, repetitions } = card;

  if (q >= 3) {
    // Correct response
    if (repetitions === 0) intervalDays = 1;
    else if (repetitions === 1) intervalDays = 6;
    else intervalDays = Math.round(intervalDays * easeFactor);

    repetitions += 1;
  } else {
    // Wrong — reset
    repetitions = 0;
    intervalDays = 1;
  }

  // Update ease factor
  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  );

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + intervalDays);

  return {
    ...card,
    easeFactor,
    intervalDays,
    repetitions,
    lastScore: score,
    nextReviewDate: nextDate.toISOString().split('T')[0],
  };
}

export function isDueToday(card: SRCard): boolean {
  const today = new Date().toISOString().split('T')[0];
  return card.nextReviewDate <= today;
}

export function getDueCards(cards: SRCard[]): SRCard[] {
  return cards.filter(isDueToday)
    .sort((a, b) => a.nextReviewDate.localeCompare(b.nextReviewDate));
}
