
import React, { useState } from 'react';
import Header from '@/components/Header';
import AudioUploader from '@/components/AudioUploader';
import ProcessingStage from '@/components/ProcessingStage';
import GrammarScoreDisplay from '@/components/GrammarScoreDisplay';
import TranscriptionDisplay from '@/components/TranscriptionDisplay';
import ScoreMetricsChart from '@/components/ScoreMetricsChart';
import SubmitPrediction from '@/components/SubmitPrediction';
import { transcribeAudio } from '@/services/audioService';
import { analyzeGrammar, GrammarIssue, GrammarMetrics } from '@/services/grammarService';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState<string>('');
  const [grammarIssues, setGrammarIssues] = useState<GrammarIssue[]>([]);
  const [grammarMetrics, setGrammarMetrics] = useState<GrammarMetrics[]>([]);
  const [grammarScore, setGrammarScore] = useState<number | null>(null);
  
  const [transcriptionStatus, setTranscriptionStatus] = useState<'waiting' | 'processing' | 'completed' | 'error'>('waiting');
  const [analysisStatus, setAnalysisStatus] = useState<'waiting' | 'processing' | 'completed' | 'error'>('waiting');
  const [scoringStatus, setScoringStatus] = useState<'waiting' | 'processing' | 'completed' | 'error'>('waiting');
  
  const { toast } = useToast();

  const handleAudioUploaded = async (file: File) => {
    setAudioFile(file);
    resetProcessingState();
    startProcessing(file);
  };

  const resetProcessingState = () => {
    setTranscription('');
    setGrammarIssues([]);
    setGrammarMetrics([]);
    setGrammarScore(null);
    setTranscriptionStatus('waiting');
    setAnalysisStatus('waiting');
    setScoringStatus('waiting');
  };

  const startProcessing = async (file: File) => {
    try {
      // Step 1: Transcription
      setTranscriptionStatus('processing');
      const text = await transcribeAudio(file);
      setTranscription(text);
      setTranscriptionStatus('completed');
      
      // Step 2: Grammar Analysis
      setAnalysisStatus('processing');
      const grammarAnalysis = await analyzeGrammar(text);
      setGrammarIssues(grammarAnalysis.issues);
      setGrammarMetrics(grammarAnalysis.metrics);
      setAnalysisStatus('completed');
      
      // Step 3: Score Calculation
      setScoringStatus('processing');
      // Small delay for UX purposes
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGrammarScore(grammarAnalysis.score);
      setScoringStatus('completed');
      
      toast({
        title: "Processing complete",
        description: `Grammar score: ${grammarAnalysis.score.toFixed(1)}/5.0`,
      });
      
    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        variant: "destructive",
        title: "Processing failed",
        description: "There was an error processing the audio file.",
      });
      
      if (transcriptionStatus === 'processing') {
        setTranscriptionStatus('error');
      } else if (analysisStatus === 'processing') {
        setAnalysisStatus('error');
      } else if (scoringStatus === 'processing') {
        setScoringStatus('error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Grammar Scoring Engine</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-medium mb-3">Upload Audio</h2>
              <AudioUploader onAudioUploaded={handleAudioUploaded} />
            </div>
            
            <div>
              <h2 className="text-lg font-medium mb-3">Processing Status</h2>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <ProcessingStage 
                    stage="transcription" 
                    status={transcriptionStatus} 
                  />
                  <ProcessingStage 
                    stage="analysis" 
                    status={analysisStatus} 
                  />
                  <ProcessingStage 
                    stage="scoring" 
                    status={scoringStatus} 
                  />
                </CardContent>
              </Card>
            </div>
          </div>
          
          {grammarScore !== null && (
            <>
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-3">Grammar Score Results</h2>
                <GrammarScoreDisplay score={grammarScore} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <TranscriptionDisplay 
                  transcription={transcription} 
                  grammarIssues={grammarIssues}
                />
                
                <ScoreMetricsChart metrics={grammarMetrics} />
              </div>
              
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-3">Submit Your Prediction</h2>
                <SubmitPrediction 
                  currentScore={grammarScore} 
                  currentFilename={audioFile?.name}
                />
              </div>
            </>
          )}
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-bold mb-2">Grammar Score Rubric</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left font-medium">Score</th>
                    <th className="px-4 py-2 text-left font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="px-4 py-3 align-top font-medium">1</td>
                    <td className="px-4 py-3">The person's speech struggles with proper sentence structure and syntax, displaying limited control over simple grammatical structures and memorized sentence patterns.</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-3 align-top font-medium">2</td>
                    <td className="px-4 py-3">The person has a limited understanding of sentence structure and syntax. Although they use simple structures, they consistently make basic sentence structure and grammatical mistakes. They might leave sentences incomplete.</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-3 align-top font-medium">3</td>
                    <td className="px-4 py-3">The person demonstrates a decent grasp of sentence structure but makes errors in grammatical structure, or they show a decent grasp of grammatical structure but make errors in sentence syntax and structure.</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-3 align-top font-medium">4</td>
                    <td className="px-4 py-3">The person displays a strong understanding of sentence structure and syntax. They consistently show good control of grammar. While occasional errors may occur, they are generally minor and do not lead to misunderstandings; the person can correct most of them.</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-3 align-top font-medium">5</td>
                    <td className="px-4 py-3">Overall, the person showcases high grammatical accuracy and adept control of complex grammar. They use grammar accurately and effectively, seldom making noticeable mistakes. Additionally, they handle complex language structures well and correct themselves when necessary.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>SHL Hiring Assessment - Grammar Scoring Engine</p>
          <p className="mt-1">© 2025 SHL Labs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
