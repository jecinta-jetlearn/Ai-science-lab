export type LabId = "volcano" | "gravity" | "circuit" | "rocket" | "critter" | "quiz";

export interface LabStation {
  id: LabId;
  title: string;
  shortTitle: string;
  subtitle: string;
  icon: string;
  themeColor: {
    bg: string;
    border: string;
    text: string;
    badgeBg: string;
  };
  ageTag: string;
  summary: string;
}

export interface Badge {
  id: string;
  title: string;
  emoji: string;
  description: string;
  labId: LabId;
  unlocked: boolean;
}

export interface PipMessage {
  id: string;
  text: string;
  mood?: "happy" | "thinking" | "excited" | "curious";
  analogy?: string;
  speakable?: boolean;
}

export interface QuizQuestion {
  id: number;
  labId: LabId;
  question: string;
  hint: string;
  options: {
    text: string;
    emoji: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}
