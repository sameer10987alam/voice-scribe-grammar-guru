
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface GrammarScoreDisplayProps {
  score: number;
}

const GrammarScoreDisplay: React.FC<GrammarScoreDisplayProps> = ({ score }) => {
  // Normalize score to ensure it's between 0-5
  const normalizedScore = Math.max(0, Math.min(5, score));
  const percentage = (normalizedScore / 5) * 100;
  
  // Determine color based on score
  const getScoreColor = () => {
    if (normalizedScore >= 4) return 'bg-green-500';
    if (normalizedScore >= 3) return 'bg-blue-500';
    if (normalizedScore >= 2) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Get score text description
  const getScoreDescription = () => {
    if (normalizedScore >= 4.5) return 'Excellent grammar with high accuracy and complex structures';
    if (normalizedScore >= 4) return 'Strong grammar with minor errors that don\'t affect understanding';
    if (normalizedScore >= 3) return 'Decent grammar with some structural or syntax errors';
    if (normalizedScore >= 2) return 'Limited grammar with consistent basic errors';
    return 'Poor grammar with significant structural issues';
  };

  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-baseline">
            <h3 className="text-xl font-semibold">Grammar Score</h3>
            <span className="text-3xl font-bold">{normalizedScore.toFixed(1)}/5.0</span>
          </div>
          
          <Progress value={percentage} className={`h-3 ${getScoreColor()}`} />
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>Poor (1.0)</span>
            <span>Excellent (5.0)</span>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-700">
              {getScoreDescription()}
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-5 gap-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div key={level} className="text-center">
                  <div 
                    className={`h-1.5 w-full rounded-full ${
                      level <= Math.round(normalizedScore) 
                        ? getScoreColor()
                        : 'bg-gray-200'
                    }`}
                  />
                  <span className="text-xs text-gray-500 mt-1 block">{level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GrammarScoreDisplay;
