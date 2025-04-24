import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const ProtectedRoute = ({ children, fallback }: ProtectedRouteProps) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (!currentUser) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded text-yellow-700">
        <p className="font-medium">Authentication Required</p>
        <p className="text-sm">Please log in to access this content.</p>
      </div>
    );
  }
  
  return <>{children}</>;
};

export default ProtectedRoute; 