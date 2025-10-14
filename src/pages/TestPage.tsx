import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const TestPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="lingo-card max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">🎉 LingoSphere is Working!</h1>
        <p className="text-muted-foreground mb-6">
          Your React + Vite + TailwindCSS app is running successfully!
        </p>
        <div className="space-y-4">
          <Button className="w-full">
            Test Button
          </Button>
          <div className="text-sm text-muted-foreground">
            <p>✅ React is working</p>
            <p>✅ TailwindCSS is working</p>
            <p>✅ Components are rendering</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TestPage;
