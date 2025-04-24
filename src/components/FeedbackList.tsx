import { useState, useEffect } from 'react';
import { getDocuments } from '../utils/firebaseUtils';
import { formatDistanceToNow } from 'date-fns';

interface Feedback {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: {
    toDate: () => Date;
  };
}

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        const fetchedFeedbacks = await getDocuments('feedbacks');
        
        // Sort by timestamp - newest first
        const sortedFeedbacks = [...fetchedFeedbacks].sort((a, b) => {
          if (!a.timestamp || !b.timestamp) return 0;
          return b.timestamp.toDate().getTime() - a.timestamp.toDate().getTime();
        });
        
        setFeedbacks(sortedFeedbacks as Feedback[]);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching feedbacks:', err);
        setError(err.message || 'Failed to load feedbacks');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const formatDate = (timestamp: { toDate: () => Date }) => {
    if (!timestamp) return 'Unknown time';
    try {
      return formatDistanceToNow(timestamp.toDate(), { addSuffix: true });
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Date error';
    }
  };

  if (loading) {
    return (
      <div className="p-6 rounded-lg shadow bg-white dark:bg-gray-800 transition-colors duration-200">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-lg shadow bg-white dark:bg-gray-800 transition-colors duration-200">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <div className="p-6 rounded-lg shadow bg-white dark:bg-gray-800 transition-colors duration-200">
        <div className="flex flex-col items-center justify-center h-40">
          <svg 
            className="w-16 h-16 text-gray-400 mb-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
            ></path>
          </svg>
          <p className="text-xl text-gray-500 dark:text-gray-400">No feedback submitted yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 transition-colors duration-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Recent Feedback</h2>
      
      <div className="space-y-4">
        {feedbacks.map((feedback) => (
          <div 
            key={feedback.id}
            className="p-4 rounded-lg shadow bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transform transition-all duration-200 hover:shadow-lg hover:translate-y-[-2px]"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{feedback.name}</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(feedback.timestamp)}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-2 break-words whitespace-pre-wrap">{feedback.message}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{feedback.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackList; 