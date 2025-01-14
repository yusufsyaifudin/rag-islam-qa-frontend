import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import HistoryItem from './HistoryItem';


const API_HOST = process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:5000';

const HistoryPanel: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const router = useRouter();

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API_HOST}/api/histories`);
      const data = await response.json();
      setHistory(data.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleHistoryItemClick = (journeyId: string) => {
    router.push(`/history/${journeyId}`);
  };

  return (
    <div className="bg-light p-3 h-100 overflow-auto">
      <h4 className="mb-3">History</h4>
      <ul className="list-group">
        {Array.isArray(history) && history.map((item) => (
          <li
            key={item.journeyId}
            className="list-group-item list-group-item-action"
            onClick={() => handleHistoryItemClick(item.journeyId)}
            style={{ cursor: 'pointer' }}
          >
            {item.question}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryPanel;

