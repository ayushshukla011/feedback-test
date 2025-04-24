import { useState } from 'react';
import { loginUser, registerUser, signInWithGoogle, signOut } from '../utils/firebaseUtils';
import { useAuth } from '../contexts/AuthContext';

interface AuthProps {
  hideSignOut?: boolean;
}

const Auth = ({ hideSignOut = false }: AuthProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { currentUser } = useAuth();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      if (isLogin) {
        await loginUser(email, password);
        setMessage('Logged in successfully!');
      } else {
        await registerUser(email, password);
        setMessage('Registered successfully!');
      }
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      setMessage('Logged in with Google successfully!');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setMessage('Signed out successfully!');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full transform transition-all duration-500 opacity-100 translate-y-0"
    >
      <h2 
        className="text-2xl font-bold mb-6 text-gray-800 dark:text-white"
      >
        {isLogin ? 'Login' : 'Register'}
      </h2>

      {currentUser ? (
        <div 
          className="mb-6 transform transition-opacity duration-300"
        >
          <p 
            className="text-green-600 dark:text-green-400 mb-4"
          >
            Logged in as: {currentUser.email}
          </p>
          {!hideSignOut && (
            <button
              onClick={handleSignOut}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors hover:scale-102 active:scale-98"
            >
              Sign Out
            </button>
          )}
        </div>
      ) : (
        <form 
          onSubmit={handleAuth} 
          className="space-y-4 transform transition-opacity duration-300"
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:scale-101 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-transform"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:scale-101 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-transform"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors hover:scale-102 active:scale-98"
            >
              {isLogin ? 'Login' : 'Register'}
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors hover:scale-102 active:scale-98"
            >
              Sign In with Google
            </button>
          </div>
        </form>
      )}

      <div className="mt-4">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!!currentUser}
        >
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </button>
      </div>

      {error && (
        <p 
          className="mt-4 text-red-600 dark:text-red-400 transform transition-all duration-300"
        >
          {error}
        </p>
      )}

      {message && (
        <p 
          className="mt-4 text-green-600 dark:text-green-400 transform transition-all duration-300"
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default Auth; 