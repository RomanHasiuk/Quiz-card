import React from "react";
import type { SubQuestion } from "../../types/quiz";
import styles from "./SubCard.module.css";

interface SubCardProps {
  subCard: SubQuestion;
  showAnswer: boolean;
  onAnswerShown: () => void;
  blurred: boolean;
}

const SubCard: React.FC<SubCardProps> = ({ 
  subCard, 
  showAnswer, 
  onAnswerShown, 
  blurred
}) => {
  return (
    <div className="card container">
      <div className="card-content">
        <div className="content is-flex is-flex-direction-column is-align-items-center">
          {/* Запитання - завжди видиме, але може бути заблюроване */}
          <p className={`title comfortaa-font is-4 mb-5 ${blurred ? styles.blurredQuestion : ''}`}>
            {subCard.question}
          </p>

          {/* Кнопка "Показати відповідь" - показується лише коли питання не заблюроване і відповідь не показана */}
          {!showAnswer && !blurred && (
            <div className="has-text-centered">
              <button
                className="button rubik-font is-link is-outlined is-medium"
                onClick={onAnswerShown}
              >
                Показати відповідь
              </button>
            </div>
          )}

          {/* Відповідь - показується лише коли користувач натиснув кнопку */}
          {showAnswer && (
            <div className={`notification is-primary ${styles.answerBox}`}>
              <p className="subtitle cormorant-infant-font is-6">Відповідь:</p>
              <p className="content">{subCard.answer}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubCard;
