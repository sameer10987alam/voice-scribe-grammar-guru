
import React, { useState, useRef } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

interface AudioUploaderProps {
  onAudioUploaded: (audioFile: File) => void;
}

const AudioUploader: React.FC<AudioUploaderProps> = ({ onAudioUploaded }) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    if (!file.type.includes('audio')) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an audio file (.wav, .mp3, etc.)",
      });
      return;
    }
    
    setFile(file);
    simulateUpload(file);
  };

  const simulateUpload = (file: File) => {
    setIsUploading(true);
    setProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          onAudioUploaded(file);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const removeFile = () => {
    setFile(null);
    setProgress(0);
    setIsUploading(false);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      {!file ? (
        <div
          className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${
            dragActive ? 'border-primary bg-primary/10' : 'border-gray-300'
          } hover:border-primary hover:bg-primary/5`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept="audio/*"
            onChange={handleChange}
          />
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">Upload Audio File</h3>
          <p className="mt-2 text-sm text-gray-500">
            Drag and drop your audio file, or 
            <button
              type="button"
              onClick={handleButtonClick}
              className="ml-1 text-primary hover:text-primary/80 font-medium"
            >
              browse
            </button>
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Supported formats: .wav (recommended), .mp3, .ogg
          </p>
          <div className="mt-6">
            <Button onClick={handleButtonClick}>
              Select Audio File
            </Button>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded text-primary">
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
                >
                  <path d="M17.5 22h.5c.5 0 1-.2 1.4-.6.4-.4.6-.9.6-1.4V7.5L14.5 2H6c-.5 0-1 .2-1.4.6C4.2 3 4 3.5 4 4v3"/>
                  <path d="M14 2v6h6"/>
                  <circle cx="10" cy="16" r="6"/>
                  <path d="m9 15 2 2 2-2"/>
                  <path d="M8 13h4"/>
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-700 truncate" title={file.name}>
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="text-gray-500 hover:text-gray-700 p-1"
              disabled={isUploading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Upload Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          {progress === 100 && (
            <div className="mt-3 flex items-center text-sm text-green-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span>Upload complete</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AudioUploader;
