import { useState, FormEvent } from 'react';
import { addDocument } from '../utils/firebaseUtils';
import { serverTimestamp } from 'firebase/firestore';

interface FormError {
  field: string;
  message: string;
}

const FeedbackForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [errors, setErrors] = useState<FormError[]>([]);
  const [success, setSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormError[] = [];

    // Name validation
    if (!name.trim()) {
      newErrors.push({ field: 'name', message: 'Name is required' });
    } else if (name.trim().length < 2) {
      newErrors.push({ field: 'name', message: 'Name must be at least 2 characters' });
    }

    // Email validation
    if (!email.trim()) {
      newErrors.push({ field: 'email', message: 'Email is required' });
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.push({ field: 'email', message: 'Please enter a valid email address' });
      }
    }

    // Message validation
    if (!message.trim()) {
      newErrors.push({ field: 'message', message: 'Feedback message is required' });
    } else if (message.trim().length < 10) {
      newErrors.push({ field: 'message', message: 'Message must be at least 10 characters' });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const getFieldError = (field: string): string => {
    const error = errors.find(e => e.field === field);
    return error ? error.message : '';
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccess(false);
    
    console.log('Form submission started');

    // Validate form
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting to add document to Firestore');
      // Prepare data without serverTimestamp for better error tracking
      const feedbackData = {
        name,
        email,
        message,
        timestamp: serverTimestamp(),
      };
      
      console.log('Feedback data:', feedbackData);
      
      // Add document to Firestore
      const docRef = await addDocument('feedbacks', feedbackData);
      
      console.log('Document successfully added with ID:', docRef.id);

      // Reset the form
      setName('');
      setEmail('');
      setMessage('');
      setErrors([]);
      setSuccess(true);
    } catch (err: any) {
      console.error('Error submitting feedback:', err);
      setErrorMsg(err.message || 'Error submitting feedback. Please try again.');
      
      // Adding more detailed error information
      if (err.code) {
        console.error('Error code:', err.code);
      }
      
      if (err.name === 'FirebaseError') {
        // Handle Firebase specific errors
        if (err.code === 'permission-denied') {
          setErrorMsg('Permission denied. Please check your Firestore rules.');
        } else if (err.code === 'unavailable') {
          setErrorMsg('Firebase service is currently unavailable. Please try again later.');
        }
      }
    } finally {
      console.log('Form submission completed');
      setLoading(false);
    }
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transform transition-all duration-500 opacity-100 translate-y-0"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Submit Feedback
      </h2>

      {success && (
        <div 
          className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded transition-all duration-300 ease-in-out"
        >
          <p>Thank you for your feedback! It has been submitted successfully.</p>
        </div>
      )}

      {errorMsg && (
        <div 
          className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded transition-all duration-300 ease-in-out"
        >
          <p>{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.length) validateForm();
            }}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-transform focus:scale-[1.01]
              ${getFieldError('name') 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500'}`}
            required
            disabled={loading}
          />
          {getFieldError('name') && (
            <p 
              className="mt-1 text-sm text-red-600 transition-all duration-200 transform-gpu"
            >
              {getFieldError('name')}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.length) validateForm();
            }}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-transform focus:scale-[1.01]
              ${getFieldError('email') 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500'}`}
            required
            disabled={loading}
          />
          {getFieldError('email') && (
            <p 
              className="mt-1 text-sm text-red-600 transition-all duration-200 transform-gpu"
            >
              {getFieldError('email')}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Feedback Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (errors.length) validateForm();
            }}
            rows={5}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-transform focus:scale-[1.01]
              ${getFieldError('message') 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500'}`}
            required
            disabled={loading}
          />
          {getFieldError('message') && (
            <p 
              className="mt-1 text-sm text-red-600 transition-all duration-200 transform-gpu"
            >
              {getFieldError('message')}
            </p>
          )}
        </div>

        <div className="hover:scale-[1.02] active:scale-[0.98] transition-transform">
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
              loading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              'Submit Feedback'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm; 