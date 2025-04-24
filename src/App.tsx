import { useState, useEffect } from 'react'
import FeedbackForm from './components/FeedbackForm'
import FeedbackList from './components/FeedbackList'
import Auth from './components/Auth'
import { useAuth } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import ThemeToggle from './components/ThemeToggle'
import { db } from './firebase'
import { collection, getDocs, limit, query } from 'firebase/firestore'
import { motion, AnimatePresence } from 'framer-motion'
import { signOut } from './utils/firebaseUtils'

function App() {
  const [showAdmin, setShowAdmin] = useState(false)
  const { currentUser } = useAuth()
  const [firestoreConnected, setFirestoreConnected] = useState<boolean | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Test Firestore connection
    const testFirestoreConnection = async () => {
      try {
        console.log('Testing Firestore connection...')
        const testQuery = query(collection(db, 'feedbacks'), limit(1))
        await getDocs(testQuery)
        console.log('Firestore connection successful')
        setFirestoreConnected(true)
      } catch (error) {
        console.error('Firestore connection error:', error)
        setFirestoreConnected(false)
      }
    }

    testFirestoreConnection()
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut();
      setMessage('Signed out successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <motion.h1 
              className="text-xl md:text-2xl font-bold text-indigo-600 dark:text-indigo-400"
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              Feedback Portal
            </motion.h1>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <span className="sr-only">Open menu</span>
                {/* Icon when menu is closed */}
                <svg 
                  className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                {/* Icon when menu is open */}
                <svg 
                  className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              
              {currentUser ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {currentUser.email}
                  </span>
                  <motion.button
                    onClick={handleSignOut}
                    className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign Out
                  </motion.button>
                </div>
              ) : null}
              
              <motion.button
                onClick={() => setShowAdmin(!showAdmin)}
                className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {showAdmin ? 'Submit Feedback' : 'View Feedback'}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              className="md:hidden bg-white dark:bg-gray-800 shadow-sm border-t border-gray-200 dark:border-gray-700"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <div className="flex items-center justify-center py-2">
                  <ThemeToggle />
                </div>
                
                {currentUser && (
                  <>
                    <div className="px-5 py-2 text-center text-sm text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700">
                      Logged in as: {currentUser.email}
                    </div>
                    <div className="pt-2 pb-3 border-t border-gray-200 dark:border-gray-700">
                      <motion.button
                        onClick={() => {
                          handleSignOut();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Sign Out
                      </motion.button>
                    </div>
                  </>
                )}
                
                <div className="pt-2 pb-3 border-t border-gray-200 dark:border-gray-700">
                  <motion.button
                    onClick={() => {
                      setShowAdmin(!showAdmin);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {showAdmin ? 'Submit Feedback' : 'View Feedback'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Firebase Connection Status */}
      <AnimatePresence>
        {firestoreConnected === false && (
          <motion.div 
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mx-auto max-w-5xl mt-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <p className="font-medium">Firebase Connection Error</p>
            <p>Unable to connect to Firebase. Please check your configuration and internet connection.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sign Out Message */}
      <AnimatePresence>
        {message && (
          <motion.div 
            className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mx-auto max-w-5xl mt-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <p>{message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Auth Component (Always visible) */}
          <div className="lg:col-span-1">
            <Auth hideSignOut={true} />
          </div>
          
          {/* Feedback Form or Admin List */}
          <div className="lg:col-span-1">
            {showAdmin ? (
              <ProtectedRoute fallback={
                <motion.div 
                  className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded text-yellow-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="font-medium">Authentication Required</p>
                  <p className="text-sm">Please log in to view submitted feedback.</p>
                </motion.div>
              }>
                <FeedbackList />
              </ProtectedRoute>
            ) : (
              <FeedbackForm />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <motion.div 
            className="text-center text-sm text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <p>© {new Date().getFullYear()} Ayush Shukla • ayushshukla3999@gmail.com • Feedback Application</p>
            <p className="mt-1">Built with React, Tailwind CSS, and Firebase</p>
          </motion.div>
        </div>
      </footer>
    </motion.div>
  )
}

export default App
