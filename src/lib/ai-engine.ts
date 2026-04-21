export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface StructuredResponse {
  explanation: string;
  keyPoints: string[];
  example: string;
  practiceQuestions: string[];
  quiz: {
    question: string;
    options: QuizOption[];
  };
  topicId: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  confidence?: number;
}

const PERSONALITY_PHRASES = [
  "Let's break this down.",
  "Good question!",
  "This is a common interview topic.",
  "Great choice! Let's dive in.",
  "I've got a clear explanation for this.",
  "This concept is fundamental for competitive programming."
];

const RESPONSES: Record<string, StructuredResponse> = {
  'arrays': {
    topicId: 'arrays',
    explanation: "Arrays are contiguous blocks of memory that store elements of the same type. They allow O(1) access by index, making them incredibly efficient for retrieval.",
    keyPoints: [
      "Contiguous memory allocation",
      "Fast index-based access (O(1))",
      "Fixed size (usually, unless dynamic)",
      "O(n) insertion/deletion at arbitrary positions"
    ],
    example: "Imagine a row of lockers. Each locker has a number (index) and holds one item. If you know the locker number, you can open it instantly.",
    practiceQuestions: [
      "Find the maximum element in an array.",
      "Two Sum: Find two numbers that add up to a target.",
      "Reverse an array in-place."
    ],
    quiz: {
      question: "What is the time complexity of accessing an element in an array by its index?",
      options: [
        { id: '1', text: 'O(1)', isCorrect: true },
        { id: '2', text: 'O(n)', isCorrect: false },
        { id: '3', text: 'O(log n)', isCorrect: false }
      ]
    },
    difficulty: 'Beginner',
    confidence: 0.98
  },
  'two-sum': {
    topicId: 'arrays',
    explanation: "The Two Sum problem asks you to find two numbers in an array that add up to a specific target. The most efficient way is using a Hash Map to store seen numbers and their indices.",
    keyPoints: [
      "Brute force: O(n^2) using nested loops",
      "Optimized: O(n) using a Hash Map",
      "Trade-off: O(n) space complexity for the Hash Map",
      "Essential pattern for many array problems"
    ],
    example: "Array: [2, 7, 11, 15], Target: 9. Since 9 - 2 = 7, and 7 exists, the answer is [0, 1].",
    practiceQuestions: [
      "Implement Two Sum using a Hash Map.",
      "Solve Two Sum II (Sorted Array) using Two Pointers.",
      "Find all unique triplets that sum to zero (3Sum)."
    ],
    quiz: {
      question: "What is the space complexity of the optimized Two Sum solution?",
      options: [
        { id: '1', text: 'O(1)', isCorrect: false },
        { id: '2', text: 'O(n)', isCorrect: true },
        { id: '3', text: 'O(n^2)', isCorrect: false }
      ]
    },
    difficulty: 'Intermediate',
    confidence: 0.95
  },
  'linked-lists': {
    topicId: 'linked-lists',
    explanation: "Linked Lists consist of nodes where each node contains data and a reference to the next node. Unlike arrays, nodes are not stored contiguously in memory.",
    keyPoints: [
      "Dynamic size allocation",
      "Efficient insertion/deletion at known nodes (O(1))",
      "No random access (O(n) to find the i-th element)",
      "Useful for implementing Stacks and Queues"
    ],
    example: "Think of a scavenger hunt. Each clue tells you where to find the next one, but you can't skip ahead to the finish line.",
    practiceQuestions: [
      "Reverse a singly linked list.",
      "Detect a cycle in a linked list (Floyd's Cycle-Finding Algorithm).",
      "Merge two sorted linked lists."
    ],
    quiz: {
      question: "Which of the following is a disadvantage of Linked Lists compared to Arrays?",
      options: [
        { id: '1', text: 'Fixed size', isCorrect: false },
        { id: '2', text: 'Poor random access speed', isCorrect: true },
        { id: '3', text: 'Harder to insert at the front', isCorrect: false }
      ]
    },
    difficulty: 'Beginner',
    confidence: 0.99
  },
  'dp': {
    topicId: 'dp',
    explanation: "Dynamic Programming (DP) is a technique for solving complex problems by breaking them down into simpler subproblems and storing their results to avoid redundant calculations.",
    keyPoints: [
      "Optimal Substructure: Solution to subproblems build the main solution",
      "Overlapping Subproblems: Same subproblems are solved multiple times",
      "Memoization (Top-down) or Tabulation (Bottom-up)",
      "Time-Space tradeoff: Usually faster but uses more memory"
    ],
    example: "Calculating Fibonacci: Instead of calculating fib(3) twice for fib(5), we store the result of fib(3) once we calculate it.",
    practiceQuestions: [
      "Implement Fibonacci using Memoization.",
      "Solve the Climbing Stairs problem.",
      "Longest Common Subsequence."
    ],
    quiz: {
      question: "What are the two main characteristics of a problem that can be solved with DP?",
      options: [
        { id: '1', text: 'Greedy choice and recursion', isCorrect: false },
        { id: '2', text: 'Contiguous memory and fast access', isCorrect: false },
        { id: '3', text: 'Optimal substructure and overlapping subproblems', isCorrect: true }
      ]
    },
    difficulty: 'Advanced',
    confidence: 0.92
  }
};

const DEFAULT_RESPONSE: StructuredResponse = {
  topicId: 'general',
  explanation: "That's a great question! I'm still learning about that specific detail, but generally in Computer Science, we focus on efficiency, clarity, and scalability.",
  keyPoints: ["Identify the core problem", "Choose the right data structure", "Analyze Time & Space complexity"],
  example: "A simple example is searching for a book in a library by its ID versus looking through every shelf.",
  practiceQuestions: ["How would you explain this to a 5-year old?", "Can you write a pseudocode solution?"],
  quiz: {
    question: "Why do we care about Big O complexity?",
    options: [
      { id: '1', text: 'To predict performance at scale', isCorrect: true },
      { id: '2', text: 'To make the code run faster on my local machine', isCorrect: false },
      { id: '3', text: 'Because it sounds professional', isCorrect: false }
    ]
  },
  difficulty: 'Intermediate',
  confidence: 0.85
};

export const queryAI = async (query: string): Promise<StructuredResponse> => {
  const normalized = query.toLowerCase();
  let baseResponse: StructuredResponse;

  if (normalized.includes('array') || normalized.includes('index')) baseResponse = RESPONSES['arrays'];
  else if (normalized.includes('two sum') || normalized.includes('target')) baseResponse = RESPONSES['two-sum'];
  else if (normalized.includes('linked list') || normalized.includes('node')) baseResponse = RESPONSES['linked-lists'];
  else if (normalized.includes('dp') || normalized.includes('dynamic programming') || normalized.includes('fibonacci')) baseResponse = RESPONSES['dp'];
  else baseResponse = DEFAULT_RESPONSE;

  // Add personality and variation
  const phrase = PERSONALITY_PHRASES[Math.floor(Math.random() * PERSONALITY_PHRASES.length)];
  return {
    ...baseResponse,
    explanation: `${phrase} ${baseResponse.explanation}`
  };
};

export const simulateStreaming = async (text: string, onToken: (token: string) => void) => {
  const words = text.split(' ');
  for (let i = 0; i < words.length; i++) {
    onToken(words.slice(0, i + 1).join(' '));
    // Variable delay for more realistic feel
    const delay = 30 + Math.random() * 40;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
};
