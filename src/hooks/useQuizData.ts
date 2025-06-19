import { useState, useEffect } from "react";
import type { QuizTopicData } from "../types/quiz";

const useQuizData = (topic: string | null) => {
  const [data, setData] = useState<QuizTopicData | null>(null);
  const [originalData, setOriginalData] = useState<QuizTopicData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!topic) {
      setData(null);
      setOriginalData(null);
      setError(null); // Додано очищення помилки
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    const fetchQuizData = async () => {
      try {
        const response = await fetch(`api/${topic}.json`);
        if (!response.ok) {
          throw new Error(`Не вдалося завантажити дані для теми: ${topic}`);
        }
        const jsonData: QuizTopicData = await response.json();

        const withIndexes = jsonData.map((card, index) => ({
          ...card,
          originalIndex: index
        }));
        
        setOriginalData(withIndexes);
        const shuffledData = [...withIndexes].sort(() => Math.random() - 0.5);
        setData(shuffledData);
      }
      catch (err) {
        console.error("Помилка завантаження даних:", err);
        setError("Не вдалося завантажити дані вікторини. Спробуйте пізніше.");
        setData(null);
        setOriginalData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizData();
  }, [topic]);
  
  const reshuffleData = () => {
    if (originalData) {
      const shuffledData = [...originalData].sort(() => Math.random() - 0.5);
      setData(shuffledData);
    }
  };
  
  return { data, loading, error, reshuffleData };
};

export default useQuizData;
