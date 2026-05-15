import type { Profile } from './types';

/**
 * Curriculum mapping for different colleges and courses
 * This can be expanded with more colleges and their specific curricula
 */
export const CURRICULUM_MAP: Record<string, Record<string, string[]>> = {
  'Rishihood University': {
    'B.Tech CS & AI': [
      'Data Structures and Algorithms',
      'Machine Learning',
      'Artificial Intelligence',
      'Web Development',
      'Database Management',
      'Computer Networks',
      'Operating Systems',
      'Software Engineering',
    ],
    'B.Tech Computer Science': [
      'Data Structures and Algorithms',
      'Web Development',
      'Database Management',
      'Computer Networks',
      'Operating Systems',
      'Software Engineering',
      'Compiler Design',
      'System Design',
    ],
    'B.Tech Electronics': [
      'Digital Electronics',
      'Analog Electronics',
      'Microprocessors',
      'Signal Processing',
      'Circuit Design',
      'Embedded Systems',
      'Control Systems',
    ],
  },
  'IIT Delhi': {
    'B.Tech Computer Science': [
      'Data Structures and Algorithms',
      'Discrete Mathematics',
      'Database Management',
      'Computer Networks',
      'Operating Systems',
      'Compiler Design',
      'Artificial Intelligence',
      'Machine Learning',
    ],
    'B.Tech Electronics': [
      'Digital Electronics',
      'Microelectronics',
      'Signal Processing',
      'Control Systems',
      'Embedded Systems',
      'VLSI Design',
    ],
  },
  'BITS Pilani': {
    'B.Tech Computer Science': [
      'Data Structures and Algorithms',
      'Web Development',
      'Database Management',
      'Computer Networks',
      'Operating Systems',
      'Software Engineering',
      'Machine Learning',
    ],
  },
};

/**
 * Get personalized system prompt based on user profile
 */
export function getPersonalizedSystemPrompt(profile: Profile | null): string {
  if (!profile || !profile.college || !profile.branch) {
    return getDefaultSystemPrompt();
  }

  const collegeCurriculum = CURRICULUM_MAP[profile.college]?.[profile.branch];
  const subjects = collegeCurriculum?.join(', ') || '';

  const yearContext = getYearContext(profile.year);

  return `You are an expert AI tutor helping a student from ${profile.college} pursuing ${profile.branch}.

Student Profile:
- College: ${profile.college}
- Course: ${profile.branch}
- Year: ${yearContext}
- Age: ${profile.age || 'Not specified'}
- Preferred Language: ${profile.preferred_language || 'Python'}

Relevant Subjects: ${subjects}

Your role is to:
1. Provide explanations tailored to the student's curriculum and year level
2. Use examples relevant to their field of study
3. Adapt complexity based on their year (${yearContext})
4. Help with assignments, projects, and exam preparation specific to their course
5. Suggest resources and learning paths aligned with their academic goals
6. Provide code examples in ${profile.preferred_language || 'Python'} when relevant

Always maintain an encouraging and supportive tone. Break down complex concepts into digestible parts. When providing code, ensure it follows best practices and is well-commented.`;
}

/**
 * Get year-specific context for curriculum level
 */
function getYearContext(year: number | null | undefined): string {
  switch (year) {
    case 1:
      return 'First Year (Foundation concepts, basics)';
    case 2:
      return 'Second Year (Intermediate concepts, core subjects)';
    case 3:
      return 'Third Year (Advanced topics, specializations)';
    case 4:
      return 'Fourth Year (Capstone projects, research)';
    default:
      return 'General level';
  }
}

/**
 * Get default system prompt when no profile data is available
 */
export function getDefaultSystemPrompt(): string {
  return `You are an expert AI tutor helping students learn and master various subjects.

Your role is to:
1. Provide clear, comprehensive explanations
2. Break down complex concepts into digestible parts
3. Provide relevant examples and use cases
4. Help with problem-solving and critical thinking
5. Suggest resources for further learning
6. Maintain an encouraging and supportive tone

When providing code examples, use best practices and include helpful comments.`;
}

/**
 * Get AI provider configuration based on user preferences
 */
export function getAIProviderConfig(profile: Profile | null) {
  const provider = profile?.preferred_language ? 'anthropic' : 'gemini';
  return {
    provider,
    model: provider === 'anthropic' ? 'claude-sonnet-4-5' : 'gemini-2.0-flash-lite',
  };
}

/**
 * Get subject-specific prompt enhancement
 */
export function getSubjectEnhancement(subject: string, profile: Profile | null): string {
  if (!profile) return '';

  const collegeCurriculum = CURRICULUM_MAP[profile.college]?.[profile.branch];
  const isRelevantSubject = collegeCurriculum?.some(s => s.toLowerCase().includes(subject.toLowerCase()));

  if (isRelevantSubject) {
    return `This is a core subject in the ${profile.branch} curriculum at ${profile.college}. Provide in-depth explanations and practical applications relevant to this course.`;
  }

  return '';
}

/**
 * Get recommended study topics based on year
 */
export function getRecommendedTopics(profile: Profile | null): string[] {
  if (!profile || !profile.college || !profile.branch) {
    return [];
  }

  const collegeCurriculum = CURRICULUM_MAP[profile.college]?.[profile.branch] || [];

  // Filter topics based on year
  switch (profile.year) {
    case 1:
      return collegeCurriculum.slice(0, 3); // First 3 topics for year 1
    case 2:
      return collegeCurriculum.slice(2, 5); // Topics 3-5 for year 2
    case 3:
      return collegeCurriculum.slice(4, 7); // Topics 5-7 for year 3
    case 4:
      return collegeCurriculum.slice(6); // Remaining topics for year 4
    default:
      return collegeCurriculum;
  }
}
