
import React from 'react';
import { Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn("w-full bg-white shadow-sm py-4", className)}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mic className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold text-gray-800">Grammar Scoring Engine</h1>
        </div>
        <div className="text-sm text-gray-500">
          SHL Hiring Assessment
        </div>
      </div>
    </header>
  );
};

export default Header;
