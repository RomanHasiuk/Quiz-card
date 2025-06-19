/**
 * Інтерфейс для допоміжного питання (SubCard).
 */
export interface SubQuestion {
  id: string;
  question: string;
  answer: string;
}

/**
 * Інтерфейс для основної картки питання.
 */
export interface QuizCard {
  id: string;
  topic: string;
  mainQuestion: string;
  mainAnswer: string;
  additionalQuestions?: SubQuestion[]; // Масив допоміжних питань, опціонально
  originalIndex?: number; // Для відстеження початкової позиції картки
}

/**
 * Інтерфейс для даних цілої теми вікторини (масиву QuizCard).
 */
export type QuizTopicData = QuizCard[];
