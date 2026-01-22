
export interface ArabicLetter {
  char: string;
  name: string;
  transliteration: string;
  exampleWord: string;
  exampleTranslation: string;
  exampleImage: string;
}

export type GameType = 'QUIZ' | 'GLYPH_GALAXY';
export type GameMode = 'SOLO' | 'TEAMS_2' | 'TEAMS_3';

export interface Team {
  id: number;
  name: string;
  score: number;
  color: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  letter: string;
}
