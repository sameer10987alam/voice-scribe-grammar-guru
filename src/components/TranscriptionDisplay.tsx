
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TranscriptionDisplayProps {
  transcription: string;
  grammarIssues?: Array<{
    text: string;
    issue: string;
    suggestion?: string;
  }>;
}

const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({ 
  transcription,
  grammarIssues = []
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Transcription</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-700 leading-relaxed">
          {transcription || "Transcription will appear here after processing..."}
        </div>
        
        {grammarIssues.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-gray-800 mb-2">Grammar Issues</h4>
            <div className="space-y-2">
              {grammarIssues.map((issue, index) => (
                <div key={index} className="bg-red-50 border border-red-100 rounded-md p-3">
                  <div className="flex gap-2">
                    <span className="text-red-500 font-medium text-sm">Issue:</span>
                    <span className="text-sm">{issue.text}</span>
                  </div>
                  <div className="text-xs text-gray-700 mt-1">{issue.issue}</div>
                  {issue.suggestion && (
                    <div className="mt-1 text-xs text-green-600">
                      Suggestion: {issue.suggestion}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TranscriptionDisplay;
