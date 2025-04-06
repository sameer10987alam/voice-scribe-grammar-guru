
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SubmissionEntry {
  id: string;
  filename: string;
  score: number;
}

interface SubmitPredictionProps {
  currentScore?: number;
  currentFilename?: string;
}

const SubmitPrediction: React.FC<SubmitPredictionProps> = ({ 
  currentScore, 
  currentFilename 
}) => {
  const [entries, setEntries] = useState<SubmissionEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Add current prediction to the submission
  const addCurrentPrediction = () => {
    if (!currentScore || !currentFilename) {
      toast({
        variant: "destructive",
        title: "Missing prediction",
        description: "Process an audio file first to generate a prediction",
      });
      return;
    }

    const newEntry: SubmissionEntry = {
      id: Date.now().toString(),
      filename: currentFilename,
      score: currentScore
    };

    setEntries((prev) => {
      // Check if file already exists and replace it
      const fileExists = prev.some(entry => entry.filename === currentFilename);
      if (fileExists) {
        return prev.map(entry => 
          entry.filename === currentFilename ? newEntry : entry
        );
      }
      return [...prev, newEntry];
    });

    toast({
      title: "Prediction added",
      description: `Added score for ${currentFilename}`
    });
  };

  // Remove entry from submission
  const removeEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  // Download predictions as CSV
  const downloadPredictions = () => {
    if (entries.length === 0) {
      toast({
        variant: "destructive",
        title: "No predictions",
        description: "Add some predictions before downloading"
      });
      return;
    }

    // Create CSV content
    const csvHeader = "filename,score\n";
    const csvContent = entries.map(entry => 
      `${entry.filename},${entry.score.toFixed(2)}`
    ).join("\n");
    const csv = csvHeader + csvContent;

    // Create download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'predictions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Simulate submission to Kaggle
  const submitPredictions = () => {
    if (entries.length === 0) {
      toast({
        variant: "destructive",
        title: "No predictions",
        description: "Add some predictions before submitting"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Submission successful",
        description: `${entries.length} predictions submitted to Kaggle`
      });
    }, 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Submit Predictions</CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length > 0 ? (
          <div className="overflow-y-auto max-h-64 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Filename</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.filename}</TableCell>
                    <TableCell className="text-right">{entry.score.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => removeEntry(entry.id)}
                      >
                        <span className="sr-only">Remove</span>
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            <p>No predictions added yet</p>
            <p className="text-sm mt-1">Process audio files and add them to your submission</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2 justify-end">
        <Button 
          variant="outline" 
          onClick={addCurrentPrediction}
          disabled={!currentScore || !currentFilename}
        >
          Add Current Prediction
        </Button>
        <Button 
          variant="outline"
          onClick={downloadPredictions} 
          disabled={entries.length === 0}
          className="gap-1"
        >
          <Download className="h-4 w-4" />
          Download CSV
        </Button>
        <Button 
          onClick={submitPredictions} 
          disabled={entries.length === 0 || isSubmitting}
          className="gap-1"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Submit to Kaggle
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

// Adding X icon defined within component to avoid additional import
const X = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

export default SubmitPrediction;
