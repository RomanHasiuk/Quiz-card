import React, { useEffect, useState } from 'react';

interface CategorySelectProps {
  onSelectTopic: (topic: string) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ onSelectTopic }) => {
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch(`api/topics.json`);
        if (!response.ok) {
          throw new Error('Не вдалося завантажити список тем.');
        }
        const data: string[] = await response.json();
        setAvailableTopics(data);
        setLoading(false);
      } catch (err) {
        console.error("Помилка завантаження тем:", err);
        setError("Не вдалося завантажити доступні теми. Спробуйте пізніше.");
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);
    
  if (loading) {
    return <progress className="progress is-small is-primary" max="100">Завантаження тем...</progress>;
  }
  if (error) {
    return (
      <div className="notification is-danger">
        {error}
      </div>
    );
  }

  return (
    <div className="box has-text-centered">
      <h2 className="subtitle">Оберіть тему вікторини:</h2>
      <div className="buttons is-centered is-flex-wrap-wrap">
        {availableTopics.length === 0
          && <p className="has-text-grey">Немає доступних тем.</p>
        }
        {availableTopics.map(topic => (
          <button
            key={topic}
            className="button is-primary is-light is-large m-2"
            onClick={() => onSelectTopic(topic)}
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelect;
