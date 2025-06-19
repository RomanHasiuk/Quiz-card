// src/App.tsx
import { useState } from 'react';
import './App.css';
import CategorySelect from './components/CategorySelect/CategorySelect';
import useQuizData from './hooks/useQuizData';
import Card from './components/Card/Card';
import SubCard from './components/SubCard/SubCard';

type AnswerKey = `main-${string}` | `sub-${string}-${number}`;

function App() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const { data: quizData, loading, error, reshuffleData } = useQuizData(selectedTopic);

  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [mainAnswerShown, setMainAnswerShown] = useState<boolean>(false);
  const [showSubQuestions, setShowSubQuestions] = useState<boolean>(false);
  const [currentSubCardIndex, setCurrentSubCardIndex] = useState<number>(0);
  const [mainAnswerRecorded, setMainAnswerRecorded] = useState<boolean>(false);
  const [answers, setAnswers] = useState<Record<AnswerKey, 'known' | 'unknown'>>({});
  
  // Стани для анімацій
  const [isMainCollapsed, setIsMainCollapsed] = useState<boolean>(false);
  const [subCardPosition, setSubCardPosition] = useState<'bottom' | 'top'>('bottom');
  const [subCardBlurred, setSubCardBlurred] = useState<boolean>(true);
  const [subAnswerShown, setSubAnswerShown] = useState<boolean>(false);
  const [exitAnimation, setExitAnimation] = useState<boolean>(false);
  
  const handleSelectTopic = (topic: string) => {
    setSelectedTopic(topic);
    resetAllStates();
  };

  const handleBackToCategories = () => {
    setSelectedTopic(null);
    resetAllStates();
  };

  const handleRestartTopic = () => {
    resetAllStates();
    reshuffleData();
  };

  const resetAllStates = () => {
    setCurrentCardIndex(0);
    setMainAnswerShown(false);
    setShowSubQuestions(false);
    setCurrentSubCardIndex(0);
    setMainAnswerRecorded(false);
    setIsMainCollapsed(false);
    setSubCardPosition('bottom');
    setSubCardBlurred(true);
    setSubAnswerShown(false);
    setExitAnimation(false);
    setAnswers({});
  };

  const handleMainAnswerShown = () => {
    setMainAnswerShown(true);
    if (
      quizData
      && currentCardIndex < quizData.length
      && quizData[currentCardIndex]?.additionalQuestions?.length
      && quizData[currentCardIndex].additionalQuestions!.length > 0
    ) {
      setShowSubQuestions(true);
      setCurrentSubCardIndex(0);
    }
  };

  const handleSubAnswerShown = () => {
    setSubAnswerShown(true);
  };

  const handleKnow = () => {
    if (!mainAnswerRecorded && showSubQuestions) {
      // Записуємо відповідь для головної картки
      const mainKey: AnswerKey = `main-${currentCard?.id}`;
      setAnswers(prev => ({ ...prev, [mainKey]: 'known' }));
      setMainAnswerRecorded(true);
      
      // Піднімаємо допоміжну картку та розблюровуємо питання
      setIsMainCollapsed(true);
      setSubCardPosition('top');
      setSubCardBlurred(false); // Розблюровуємо питання
    } else if (showSubQuestions && !subCardBlurred) {
      // Записуємо відповідь для допоміжної картки
      const subKey: AnswerKey = `sub-${currentCard?.id}-${currentSubCardIndex}`;
      setAnswers(prev => ({ ...prev, [subKey]: 'known' }));
      
      // Перехід до наступного питання
      handleNextSubQuestion();
    }
  };

  const handleDontKnow = () => {
    if (!mainAnswerRecorded && showSubQuestions) {
      // Записуємо відповідь для головної картки
      const mainKey: AnswerKey = `main-${currentCard?.id}`;
      setAnswers(prev => ({ ...prev, [mainKey]: 'unknown' }));
      setMainAnswerRecorded(true);
      
      // Піднімаємо допоміжну картку та розблюровуємо питання
      setIsMainCollapsed(true);
      setSubCardPosition('top');
      setSubCardBlurred(false); // Розблюровуємо питання
    } else if (showSubQuestions && !subCardBlurred) {
      // Записуємо відповідь для допоміжної картки
      const subKey: AnswerKey = `sub-${currentCard?.id}-${currentSubCardIndex}`;
      setAnswers(prev => ({ ...prev, [subKey]: 'unknown' }));
      
      // Перехід до наступного питання
      handleNextSubQuestion();
    }
  };

  const handleNextSubQuestion = () => {
    if (quizData && quizData[currentCardIndex]?.additionalQuestions &&
        currentSubCardIndex < quizData[currentCardIndex].additionalQuestions!.length - 1) {
      // Перехід до наступного допоміжного питання
      setCurrentSubCardIndex(prevIndex => prevIndex + 1);
      setSubCardBlurred(true); // Нове питання заблюроване
      setSubAnswerShown(false); // Скидаємо показ відповіді
      
      // Додаємо затримку для коректного відображення анімації
      setTimeout(() => {
        // Після переходу автоматично показуємо питання (розблюровуємо)
        setSubCardBlurred(false);
      }, 10);
    } else {
      // Перехід до наступної головної картки
      setExitAnimation(true);
      setTimeout(() => {
        handleNextMainCard();
      }, 300);
    }
  };

  const handleNextMainCard = () => {
    setMainAnswerShown(false);
    setShowSubQuestions(false);
    setCurrentSubCardIndex(0);
    setMainAnswerRecorded(false);
    setIsMainCollapsed(false);
    setSubCardPosition('bottom');
    setSubCardBlurred(true);
    setSubAnswerShown(false);
    setCurrentCardIndex(prevIndex => prevIndex + 1);
    setExitAnimation(false);
  };

  const currentCard = quizData?.[currentCardIndex] || null;
  const currentSubCard = currentCard?.additionalQuestions?.[currentSubCardIndex] || null;

  // Підрахунок питань
  const totalMainQuestions = quizData?.length || 0;
  const totalSubQuestions = quizData?.reduce((acc, card) => 
    acc + (card.additionalQuestions?.length || 0), 0) || 0;
  const totalAllQuestions = totalMainQuestions + totalSubQuestions;

  // Поточний номер питання
  const getCurrentQuestionNumber = () => {
    if (!showSubQuestions) {
      return `${currentCardIndex + 1}`;
    } else {
      return `${currentCardIndex + 1}.${currentSubCardIndex + 1}`;
    }
  };

  const getCurrentTotalQuestions = () => {
    if (!showSubQuestions) {
      return totalMainQuestions;
    } else {
      return currentCard?.additionalQuestions?.length || 0;
    }
  };

  // Підрахунок результатів
  const mainKnownCount = quizData
    ? quizData.filter(card => answers[`main-${card.id}` as AnswerKey] === 'known').length
    : 0;
  
  const subKnownCount = Object.keys(answers).filter(key => 
    key.startsWith('sub-') && answers[key as AnswerKey] === 'known'
  ).length;

  const totalKnownCount = mainKnownCount + subKnownCount;
  const percentage = totalAllQuestions > 0 ? Math.round((totalKnownCount / totalAllQuestions) * 100) : 0;

  // Списки невідомих питань
  const unknownMainList = quizData 
    ? quizData
        .filter(card => answers[`main-${card.id}` as AnswerKey] === 'unknown')
        .map(card => card.originalIndex! + 1)
        .sort((a, b) => a - b)
    : [];

  const unknownSubList = Object.keys(answers)
  .filter(key => key.startsWith('sub-') && answers[key as AnswerKey] === 'unknown')
  .map(key => {
    console.log('Processing key:', key);
    
    // Правильний парсинг: key має формат 'sub-cardId-subIndex'
    // Де cardId може містити дефіси (наприклад, 'newbie-q3')
    const match = key.match(/^sub-(.+)-(\d+)$/);
    
    if (match) {
      const cardId = match[1]; // 'newbie-q3'
      const subIndex = parseInt(match[2]); // 0, 1, 2...
      
      console.log('Parsed - cardId:', cardId, 'subIndex:', subIndex);
      
      const card = quizData?.find(c => c.id === cardId);
      console.log('Found card:', card);
      
      if (card && typeof card.originalIndex === 'number') {
        const result = `${card.originalIndex + 1}.${subIndex + 1}`;
        console.log('Generated result:', result);
        return result;
      }
    }
    
    console.log('No match or card not found for key:', key);
    return null;
  })
  .filter((item): item is string => item !== null)
  .sort((a, b) => {
    const [aMain, aSub] = a.split('.').map(Number);
    const [bMain, bSub] = b.split('.').map(Number);
    if (aMain !== bMain) return aMain - bMain;
    return aSub - bSub;
  });

  return (
    <div className="container is-fluid">
      {selectedTopic && quizData && !loading && !error ? (
        <>
          <h2 className="subtitle has-text-centered">
            Тема: <span className="has-text-info">{selectedTopic}</span>
          </h2>
          <p className="has-text-centered has-text-grey-dark">
            {currentCardIndex < quizData.length 
              ? `Питання ${getCurrentQuestionNumber()} з ${getCurrentTotalQuestions()} у темі`
              : `Знаєш ${totalKnownCount} з ${totalAllQuestions}`
            }
          </p>
          <hr />
        </>
      ) : (
        <h1 className="title has-text-centered has-text-primary mb-1">
          Флеш-картки для співбесіди
        </h1>
      )}
      
      {error && (
        <div 
          className="notification is-danger error-notification" 
          onClick={handleBackToCategories}
        >
          {error} (Натисніть, щоб повернутися до тем)
        </div>
      )}

      {loading && (
        <progress className="progress is-small is-primary" max="100">
          Завантаження...
        </progress>
      )}
      
      {!selectedTopic && !loading && !error && (
        <CategorySelect onSelectTopic={handleSelectTopic} />
      )}

      {selectedTopic && quizData && !loading && !error && (
        <div className="box is-flex is-flex-direction-column">
          {quizData.length > 0 && currentCardIndex < quizData.length ? (
            <>
              {/* Головна картка */}
              {!exitAnimation && (
                <div className={exitAnimation ? "main-card-exit" : ""}>
                  {isMainCollapsed ? (
                    <div className="collapsed-main-question comfortaa-font">
                      {currentCard?.mainQuestion}
                    </div>
                  ) : (
                    <Card
                      card={currentCard!}
                      onAnswerShown={handleMainAnswerShown}
                      showAnswer={mainAnswerShown}
                    />
                  )}
                </div>
              )}

              {/* Допоміжна картка */}
              {showSubQuestions && currentSubCard && (
                <div
                  className={`sub-card is-flex ${subCardPosition === 'top' ? 'sub-card-top' : 'sub-card-bottom'}`}
                >
                  <SubCard 
                    subCard={currentSubCard}
                    showAnswer={subAnswerShown}
                    onAnswerShown={handleSubAnswerShown}
                    blurred={subCardBlurred}
                  />
                </div>
              )}

              {/* Кнопки "Знаю"/"Не знаю" */}
              {(mainAnswerShown && !mainAnswerRecorded) || 
               (showSubQuestions && !subCardBlurred && subAnswerShown) ? (
                <div className="buttons is-centered mt-4">
                  <button 
                    className="button rubik-font is-primary mr-2"
                    onClick={handleKnow}
                  >
                    Знаю
                  </button>
                  <button 
                    className="button rubik-font is-primary"
                    onClick={handleDontKnow}
                  >
                    Не знаю
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <div className="has-text-centered">
              <p className="title is-4">Усі питання пройдено!</p>
              <p className="subtitle is-5">Результат: {percentage}%</p>
              
              {(unknownMainList.length > 0 || unknownSubList.length > 0) && (
                <div className="notification is-warning is-light mt-4">
                  <p className="subtitle is-6">Питання, на які ви відповіли "Не знаю":</p>
                  {unknownMainList.length > 0 && (
                    <p><strong>Головні:</strong> {unknownMainList.join(', ')}</p>
                  )}
                  {unknownSubList.length > 0 && (
                    <p><strong>Додаткові:</strong> {unknownSubList.join(', ')}</p>
                  )}
                </div>
              )}
              
              <button className="button rubik-font is-primary mt-4" onClick={handleRestartTopic}>
                Пройти знову
              </button>
            </div>
          )}

          <div className="has-text-centered mt-5">
            <button className="button rubik-font is-link is-light" onClick={handleBackToCategories}>
              Змінити тему
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
