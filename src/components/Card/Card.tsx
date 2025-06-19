import React from "react";
import type { QuizCard } from "../../types/quiz";
import styles from './Card.module.css';

interface CardProps {
  card: QuizCard;
  onAnswerShown: () => void;
  showAnswer: boolean;
}

const Card: React.FC<CardProps> = ({ card, onAnswerShown, showAnswer }) => {
  return (
    <div className={`card ${styles.quizCard}`}>
      <div className="card-content">
        <div className="content is-flex is-flex-direction-column is-align-items-center">
          <p className="title comfortaa-font is-4 has-text-centered mb-4">
            {card.mainQuestion}
          </p>
          
          {!showAnswer && (
            <div className="has-text-centered">
              <button
                className="button rubik-font is-primary is-outlined is-large"
                onClick={onAnswerShown}
              >
                Показати відповідь
              </button>
            </div>
          )}

          {showAnswer && (
            <div className={`notification is-info ${styles.answerBox}`}>
              <p className="subtitle cormorant-infant-font is-6">Відповідь:</p>
              <p className="content">{card.mainAnswer}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
