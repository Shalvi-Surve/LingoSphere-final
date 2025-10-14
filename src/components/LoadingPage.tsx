import React from 'react';
import { Card } from '@/components/ui/card';
import LoadingSpinner from './LoadingSpinner';

interface LoadingPageProps {
  message?: string;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ 
  message = 'Loading...' 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="lingo-card p-8">
        <LoadingSpinner size="lg" text={message} />
      </Card>
    </div>
  );
};

export default LoadingPage;
