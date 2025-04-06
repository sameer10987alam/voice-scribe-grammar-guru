
/**
 * Service for processing audio files and transcription
 * In a real implementation, this would connect to a speech-to-text API
 */

// Simulates a speech-to-text transcription
export const transcribeAudio = async (audioFile: File): Promise<string> => {
  // Simulating API call to a speech-to-text service
  return new Promise((resolve) => {
    // Simulate processing time
    setTimeout(() => {
      // Return a sample transcription based on audio filename
      // In a real app, we'd send the audio to a service like Google's Speech-to-Text
      const sampleTranscriptions: {[key: string]: string} = {
        'sample1.wav': 'The weather is nice today, but I think it will rain tomorrow.',
        'sample2.wav': 'I has went to the store yesterday and buyed some groceries.',
        'sample3.wav': 'She don\'t like pizza because it\'s too greasy for her taste.',
        'default': 'The speaker talks about their experiences in daily life. They mention several activities and express opinions on various topics. Some grammatical errors were detected in the speech pattern.'
      };
      
      // Check if we have a sample for this filename, otherwise use default
      const filenameLower = audioFile.name.toLowerCase();
      const transcription = Object.keys(sampleTranscriptions).some(key => 
        filenameLower.includes(key)
      ) 
        ? sampleTranscriptions[Object.keys(sampleTranscriptions).find(key => 
            filenameLower.includes(key)
          ) || 'default']
        : sampleTranscriptions.default;
        
      resolve(transcription);
    }, 2000);
  });
};

// Simulates audio file validation
export const validateAudioFile = (file: File): boolean => {
  // Check if file is audio type
  return file.type.startsWith('audio/');
};

// Simulates audio duration calculation
export const getAudioDuration = async (file: File): Promise<number> => {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.src = URL.createObjectURL(file);
    
    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(audio.src);
      resolve(audio.duration);
    };
    
    // Fallback in case of error
    audio.onerror = () => {
      URL.revokeObjectURL(audio.src);
      // Return a random duration between 45-60 seconds (for simulation)
      resolve(Math.random() * 15 + 45);
    };
  });
};
