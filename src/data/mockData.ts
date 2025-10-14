export interface Course {
  id: string;
  name: string;
  language: string;
  flag: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  progress: number;
  xp: number;
  totalLessons: number;
  completedLessons: number;
  description: string;
  color: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  type: "mcq" | "translation" | "listening";
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  questions: Question[];
  xpReward: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  badges: Badge[];
  avatar: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
}

// ------------------- COURSES -------------------

export const mockCourses: Course[] = [
  {
    id: "1",
    name: "Spanish",
    language: "Español",
    flag: "🇪🇸",
    level: "Beginner",
    progress: 0,
    xp: 0,
    totalLessons: 20,
    completedLessons: 0,
    description: "Learn Spanish from scratch with interactive lessons",
    color: "from-orange-400 to-red-500",
  },
  {
    id: "2",
    name: "French",
    language: "Français",
    flag: "🇫🇷",
    level: "Intermediate",
    progress: 0,
    xp: 0,
    totalLessons: 25,
    completedLessons: 0,
    description: "Master French grammar and conversation",
    color: "from-blue-400 to-indigo-500",
  },
  {
    id: "3",
    name: "Hindi",
    language: "हिंदी",
    flag: "🇮🇳",
    level: "Beginner",
    progress: 0,
    xp: 0,
    totalLessons: 20,
    completedLessons: 0,
    description: "Learn Hindi from scratch with interactive lessons",
    color: "from-green-400 to-yellow-500",
  },
  {
    id: "4",
    name: "German",
    language: "Deutsch",
    flag: "🇩🇪",
    level: "Advanced",
    progress: 0,
    xp: 0,
    totalLessons: 18,
    completedLessons: 0,
    description: "Perfect your German with advanced concepts",
    color: "from-yellow-400 to-orange-500",
  },
];

// ------------------- QUESTIONS -------------------

export const mockQuestions: Record<string, Question[]> = {
  spanish: [
    {
      id: "es-1",
      question: 'How do you say "Hello" in Spanish?',
      options: ["Adiós", "Hola", "Gracias", "Por favor"],
      correctAnswer: 1,
      explanation: '"Hola" is the most common way to say hello in Spanish.',
      type: "mcq",
    },
    {
      id: "es-2",
      question: 'What does "Gracias" mean?',
      options: ["Please", "Sorry", "Thank you", "Excuse me"],
      correctAnswer: 2,
      explanation: '"Gracias" means "Thank you" in English.',
      type: "mcq",
    },
    {
      id: "es-3",
      question: 'Choose the correct translation of "Good morning"',
      options: ["Buenas noches", "Buenos días", "Buenas tardes", "Hasta luego"],
      correctAnswer: 1,
      explanation: '"Buenos días" is used to say "Good morning" in Spanish.',
      type: "mcq",
    },
    {
      id: "es-4",
      question: 'What does "Por favor" mean?',
      options: ["Thank you", "Excuse me", "Please", "Goodbye"],
      correctAnswer: 2,
      explanation: '"Por favor" means please.',
      type: "mcq",
    },
    {
      id: "es-5",
      question: "Translate 'Goodbye'",
      options: ["Hola", "Adiós", "Gracias", "Lo siento"],
      correctAnswer: 1,
      explanation: '"Adiós" means goodbye.',
      type: "mcq",
    },
    {
      id: "es-6",
      question: "Which of these means 'Good night'?",
      options: ["Buenos días", "Buenas noches", "Buenas tardes", "Hola"],
      correctAnswer: 1,
      explanation: '"Buenas noches" means good night.',
      type: "mcq",
    },
    {
      id: "es-7",
      question: "Translate 'How are you?'",
      options: ["¿Qué tal?", "Adiós", "Por favor", "Gracias"],
      correctAnswer: 0,
      explanation: '"¿Qué tal?" is commonly used to ask "How are you?"',
      type: "mcq",
    },
    {
      id: "es-8",
      question: 'Which of these is a way to say "See you later"?',
      options: ["Hasta luego", "Buenas noches", "Por favor", "Gracias"],
      correctAnswer: 0,
      explanation: '"Hasta luego" means see you later.',
      type: "mcq",
    },
    {
      id: "es-9",
      question: "Translate 'Yes'",
      options: ["Sí", "No", "Hola", "Por favor"],
      correctAnswer: 0,
      explanation: '"Sí" means yes.',
      type: "mcq",
    },
    {
      id: "es-10",
      question: "Translate 'No'",
      options: ["Hola", "No", "Sí", "Gracias"],
      correctAnswer: 1,
      explanation: '"No" means no (same as English).',
      type: "mcq",
    },
    {
      id: "es-11",
      question: 'What does "Lo siento" mean?',
      options: ["I’m sorry", "Goodbye", "Please", "Excuse me"],
      correctAnswer: 0,
      explanation: '"Lo siento" means I’m sorry.',
      type: "mcq",
    },
    {
      id: "es-12",
      question: "Which of these means 'Excuse me'?",
      options: ["Disculpe", "Por favor", "Hola", "Gracias"],
      correctAnswer: 0,
      explanation: '"Disculpe" or "Perdón" can be used for excuse me.',
      type: "mcq",
    },
  ],

  french: [
    {
      id: "fr-1",
      question: 'How do you say "Hello" in French?',
      options: ["Bonjour", "Salut", "Bonsoir", "Allô"],
      correctAnswer: 0,
      explanation: '"Bonjour" is the standard daytime greeting.',
      type: "mcq",
    },
    {
      id: "fr-2",
      question: 'What does "Merci" mean?',
      options: ["Sorry", "Please", "Thank you", "Goodbye"],
      correctAnswer: 2,
      explanation: '"Merci" means thank you.',
      type: "mcq",
    },
    {
      id: "fr-3",
      question: "Translate 'Good night'",
      options: ["Bonne nuit", "Bonsoir", "Bon matin", "Bonne journée"],
      correctAnswer: 0,
      explanation: '"Bonne nuit" is used before sleeping.',
      type: "mcq",
    },
    {
      id: "fr-4",
      question: "Translate 'Good morning'",
      options: ["Bonjour", "Bonne nuit", "Bonsoir", "Salut"],
      correctAnswer: 0,
      explanation: '"Bonjour" is also used as good morning.',
      type: "mcq",
    },
    {
      id: "fr-5",
      question: "Translate 'Yes'",
      options: ["Oui", "Non", "Merci", "Salut"],
      correctAnswer: 0,
      explanation: '"Oui" means yes.',
      type: "mcq",
    },
    {
      id: "fr-6",
      question: "Translate 'No'",
      options: ["Oui", "Non", "Merci", "Pardon"],
      correctAnswer: 1,
      explanation: '"Non" means no.',
      type: "mcq",
    },
    {
      id: "fr-7",
      question: "Translate 'Excuse me'",
      options: ["Merci", "Excusez-moi", "Bonjour", "Salut"],
      correctAnswer: 1,
      explanation: '"Excusez-moi" is the formal excuse me.',
      type: "mcq",
    },
    {
      id: "fr-8",
      question: "Translate 'Please'",
      options: ["S’il vous plaît", "Excusez-moi", "Bonjour", "Merci"],
      correctAnswer: 0,
      explanation: '"S’il vous plaît" means please.',
      type: "mcq",
    },
    {
      id: "fr-9",
      question: "Translate 'Goodbye'",
      options: ["Salut", "Au revoir", "Merci", "Pardon"],
      correctAnswer: 1,
      explanation: '"Au revoir" is the standard goodbye.',
      type: "mcq",
    },
    {
      id: "fr-10",
      question: "What does 'Pardon' mean?",
      options: ["Excuse me", "Sorry", "Yes", "Good night"],
      correctAnswer: 0,
      explanation: '"Pardon" is another way to say excuse me.',
      type: "mcq",
    },
    {
      id: "fr-11",
      question: "Choose the informal way to say hi",
      options: ["Bonjour", "Salut", "Bonne nuit", "Merci"],
      correctAnswer: 1,
      explanation: '"Salut" is casual hello/hi.',
      type: "mcq",
    },
    {
      id: "fr-12",
      question: "Translate 'See you soon'",
      options: ["À bientôt", "Au revoir", "Bonne journée", "Salut"],
      correctAnswer: 0,
      explanation: '"À bientôt" means see you soon.',
      type: "mcq",
    },
  ],

  german: [
    {
      id: "de-1",
      question: 'How do you say "Hello" in German?',
      options: ["Hallo", "Tschüss", "Danke", "Bitte"],
      correctAnswer: 0,
      explanation: '"Hallo" is the direct translation of hello.',
      type: "mcq",
    },
    {
      id: "de-2",
      question: 'What does "Danke" mean?',
      options: ["Hello", "Please", "Thank you", "Excuse me"],
      correctAnswer: 2,
      explanation: '"Danke" means thank you.',
      type: "mcq",
    },
    {
      id: "de-3",
      question: "Translate 'Good morning'",
      options: ["Guten Morgen", "Gute Nacht", "Guten Abend", "Guten Tag"],
      correctAnswer: 0,
      explanation: '"Guten Morgen" means good morning.',
      type: "mcq",
    },
    {
      id: "de-4",
      question: "Translate 'Good night'",
      options: ["Guten Abend", "Gute Nacht", "Guten Morgen", "Hallo"],
      correctAnswer: 1,
      explanation: '"Gute Nacht" means good night.',
      type: "mcq",
    },
    {
      id: "de-5",
      question: "Translate 'Good evening'",
      options: ["Guten Morgen", "Guten Abend", "Hallo", "Auf Wiedersehen"],
      correctAnswer: 1,
      explanation: '"Guten Abend" means good evening.',
      type: "mcq",
    },
    {
      id: "de-6",
      question: "Translate 'Goodbye'",
      options: ["Hallo", "Auf Wiedersehen", "Bitte", "Danke"],
      correctAnswer: 1,
      explanation: '"Auf Wiedersehen" means goodbye.',
      type: "mcq",
    },
    {
      id: "de-7",
      question: "Translate 'Yes'",
      options: ["Nein", "Ja", "Bitte", "Danke"],
      correctAnswer: 1,
      explanation: '"Ja" means yes.',
      type: "mcq",
    },
    {
      id: "de-8",
      question: "Translate 'No'",
      options: ["Nein", "Ja", "Bitte", "Hallo"],
      correctAnswer: 0,
      explanation: '"Nein" means no.',
      type: "mcq",
    },
    {
      id: "de-9",
      question: "Translate 'Please'",
      options: ["Danke", "Bitte", "Hallo", "Guten Tag"],
      correctAnswer: 1,
      explanation: '"Bitte" means please (and also you’re welcome).',
      type: "mcq",
    },
    {
      id: "de-10",
      question: "Translate 'How are you?'",
      options: ["Wie geht’s?", "Gute Nacht", "Danke", "Bitte"],
      correctAnswer: 0,
      explanation: '"Wie geht’s?" means how are you?',
      type: "mcq",
    },
    {
      id: "de-11",
      question: "Translate 'See you soon'",
      options: ["Bis bald", "Guten Morgen", "Auf Wiedersehen", "Hallo"],
      correctAnswer: 0,
      explanation: '"Bis bald" means see you soon.',
      type: "mcq",
    },
    {
      id: "de-12",
      question: "Translate 'Excuse me'",
      options: ["Entschuldigung", "Danke", "Bitte", "Hallo"],
      correctAnswer: 0,
      explanation: '"Entschuldigung" is used for excuse me.',
      type: "mcq",
    },
  ],

  hindi: [
    {
      id: "hi-1",
      question: 'How do you say "Hello" in Hindi?',
      options: ["नमस्ते", "शुभ रात्रि", "धन्यवाद", "अलविदा"],
      correctAnswer: 0,
      explanation: '"नमस्ते" is the common way to greet in Hindi.',
      type: "mcq",
    },
    {
      id: "hi-2",
      question: 'What does "धन्यवाद" mean?',
      options: ["Please", "Sorry", "Thank you", "Goodbye"],
      correctAnswer: 2,
      explanation: '"धन्यवाद" means thank you.',
      type: "mcq",
    },
    {
      id: "hi-3",
      question: "Translate 'Good night'",
      options: ["शुभ रात्रि", "नमस्ते", "सुप्रभात", "अलविदा"],
      correctAnswer: 0,
      explanation: '"शुभ रात्रि" means good night.',
      type: "mcq",
    },
    {
      id: "hi-4",
      question: "Translate 'Good morning'",
      options: ["शुभ प्रभात", "नमस्ते", "धन्यवाद", "अलविदा"],
      correctAnswer: 0,
      explanation: '"शुभ प्रभात" means good morning.',
      type: "mcq",
    },
    {
      id: "hi-5",
      question: "Translate 'Goodbye'",
      options: ["नमस्ते", "अलविदा", "धन्यवाद", "शुभ रात्रि"],
      correctAnswer: 1,
      explanation: '"अलविदा" means goodbye.',
      type: "mcq",
    },
    {
      id: "hi-6",
      question: "Translate 'Please'",
      options: ["कृपया", "नमस्ते", "शुभ रात्रि", "अलविदा"],
      correctAnswer: 0,
      explanation: '"कृपया" means please.',
      type: "mcq",
    },
    {
      id: "hi-7",
      question: "Translate 'Yes'",
      options: ["हाँ", "नहीं", "कृपया", "धन्यवाद"],
      correctAnswer: 0,
      explanation: '"हाँ" means yes.',
      type: "mcq",
    },
    {
      id: "hi-8",
      question: "Translate 'No'",
      options: ["हाँ", "नहीं", "नमस्ते", "शुभ प्रभात"],
      correctAnswer: 1,
      explanation: '"नहीं" means no.',
      type: "mcq",
    },
    {
      id: "hi-9",
      question: "Translate 'Excuse me'",
      options: ["माफ़ कीजिए", "धन्यवाद", "हाँ", "नमस्ते"],
      correctAnswer: 0,
      explanation: '"माफ़ कीजिए" is used as excuse me.',
      type: "mcq",
    },
    {
      id: "hi-10",
      question: "Translate 'How are you?'",
      options: ["आप कैसे हैं?", "अलविदा", "शुभ प्रभात", "धन्यवाद"],
      correctAnswer: 0,
      explanation: '"आप कैसे हैं?" means how are you?',
      type: "mcq",
    },
    {
      id: "hi-11",
      question: "Translate 'See you soon'",
      options: ["फिर मिलेंगे", "धन्यवाद", "अलविदा", "नमस्ते"],
      correctAnswer: 0,
      explanation: '"फिर मिलेंगे" means see you soon.',
      type: "mcq",
    },
    {
      id: "hi-12",
      question: "Translate 'I am sorry'",
      options: ["मुझे माफ़ करें", "धन्यवाद", "नमस्ते", "अलविदा"],
      correctAnswer: 0,
      explanation: '"मुझे माफ़ करें" means I am sorry.',
      type: "mcq",
    },
  ],
};

// ------------------- MOCK USER (for demo mode only) -------------------

export const mockUser: User = {
  id: "1",
  name: "Alex Johnson",
  email: "alex@example.com",
  totalXP: 0,
  currentStreak: 0,
  longestStreak: 0,
  avatar: "👨‍🎓",
  badges: [
    {
      id: "1",
      name: "First Steps",
      description: "Complete your first lesson",
      icon: "🎯",
      earned: false,
    },
    {
      id: "2",
      name: "Streak Master",
      description: "Maintain a 7-day streak",
      icon: "🔥",
      earned: false,
    },
    {
      id: "3",
      name: "XP Collector",
      description: "Earn 1000 XP",
      icon: "⭐",
      earned: false,
    },
    {
      id: "4",
      name: "Polyglot",
      description: "Study 3 different languages",
      icon: "🌍",
      earned: false,
    },
  ],
};

// ------------------- DEFAULT LESSON -------------------

export const mockLesson: Lesson = {
  id: "1",
  courseId: "1",
  title: "Basic Greetings",
  questions: mockQuestions.spanish,
  xpReward: 50,
};
