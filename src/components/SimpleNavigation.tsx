import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const SimpleNavigation = () => {
  return (
    <nav className="bg-card border-b border-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <span className="text-xl font-bold text-white">L</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              LingoSphere
            </span>
          </Link>

          {/* Simple Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link to="/home">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link to="/courses">
              <Button variant="ghost">Courses</Button>
            </Link>
            <Link to="/developers">
              <Button variant="ghost">Developers</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SimpleNavigation;
