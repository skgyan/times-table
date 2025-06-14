
export interface AnswerOption {
  value: number;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  options: AnswerOption[];
  correctAnswer: number;
}
