
import React, { useState, useEffect } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProcessingStageProps {
  stage: 'transcription' | 'analysis' | 'scoring';
  status: 'waiting' | 'processing' | 'completed' | 'error';
  className?: string;
}

const stageInfo = {
  transcription: {
    title: 'Speech-to-Text Transcription',
    description: 'Converting audio to text for analysis'
  },
  analysis: {
    title: 'Grammar Analysis',
    description: 'Analyzing text for grammatical patterns'
  },
  scoring: {
    title: 'Score Calculation',
    description: 'Calculating final grammar score'
  }
};

const ProcessingStage: React.FC<ProcessingStageProps> = ({ 
  stage, 
  status,
  className
}) => {
  const [progressWidth, setProgressWidth] = useState(0);
  
  useEffect(() => {
    if (status === 'processing') {
      const timer = setTimeout(() => {
        setProgressWidth(100);
      }, 100);
      return () => clearTimeout(timer);
    } else if (status === 'waiting') {
      setProgressWidth(0);
    } else if (status === 'completed') {
      setProgressWidth(100);
    }
  }, [status]);

  return (
    <div className={cn("flex items-start gap-4", className)}>
      <div className="relative mt-1">
        {status === 'waiting' && (
          <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex items-center justify-center" />
        )}
        
        {status === 'processing' && (
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
        )}
        
        {status === 'completed' && (
          <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="h-4 w-4 text-white" />
          </div>
        )}
        
        {status === 'error' && (
          <div className="h-6 w-6 rounded-full bg-red-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">!</span>
          </div>
        )}
      </div>
      
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{stageInfo[stage].title}</h3>
        <p className="text-sm text-gray-500">{stageInfo[stage].description}</p>
        
        <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-1000",
              status === 'completed' ? 'bg-green-500' : 'bg-primary'
            )}
            style={{ width: `${progressWidth}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProcessingStage;
