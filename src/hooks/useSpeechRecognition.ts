import { useState, useEffect, useCallback, useRef } from 'react';

export interface DetectionEvent {
  id: string;
  keyword: string;
  timestamp: Date;
  confidence: number;
  transcript: string;
}

interface UseSpeechRecognitionOptions {
  keywords: string[];
  onKeywordDetected: (event: DetectionEvent) => void;
}

export const useSpeechRecognition = ({ keywords, onKeywordDetected }: UseSpeechRecognitionOptions) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const restartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Normalize keywords for comparison
  const normalizedKeywords = keywords.map(k => k.toLowerCase().trim());

  useEffect(() => {
    // Check for browser support
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognitionAPI) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognitionAPI();
      
      const recognition = recognitionRef.current;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 3;

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcriptText = result[0].transcript;
          
          if (result.isFinal) {
            finalTranscript += transcriptText;
            
            // Check all alternatives for keywords
            for (let j = 0; j < result.length; j++) {
              const alternative = result[j];
              const words = alternative.transcript.toLowerCase().split(/\s+/);
              
              for (const word of words) {
                const cleanWord = word.replace(/[^a-z]/g, '');
                
                for (const keyword of normalizedKeywords) {
                  // Fuzzy matching: check if word contains keyword or is similar
                  if (cleanWord === keyword || 
                      cleanWord.includes(keyword) || 
                      keyword.includes(cleanWord) ||
                      levenshteinDistance(cleanWord, keyword) <= 2) {
                    
                    const detectionEvent: DetectionEvent = {
                      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                      keyword: keyword.toUpperCase(),
                      timestamp: new Date(),
                      confidence: alternative.confidence,
                      transcript: alternative.transcript
                    };
                    
                    onKeywordDetected(detectionEvent);
                    break;
                  }
                }
              }
            }
          } else {
            interimTranscript += transcriptText;
          }
        }
        
        setTranscript(finalTranscript || interimTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        
        if (event.error === 'not-allowed') {
          setError('Microphone access denied. Please allow microphone access to use this feature.');
          setIsListening(false);
        } else if (event.error === 'no-speech') {
          // This is normal, just restart
        } else if (event.error === 'network') {
          setError('Network error. Please check your connection.');
        } else {
          setError(`Recognition error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        // Auto-restart for continuous listening
        if (isListening && recognitionRef.current) {
          restartTimeoutRef.current = setTimeout(() => {
            try {
              recognitionRef.current?.start();
            } catch (e) {
              console.log('Restarting recognition...');
            }
          }, 100);
        }
      };
    } else {
      setIsSupported(false);
      setError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
    }

    return () => {
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startListening = useCallback(async () => {
    if (!recognitionRef.current) return;
    
    setError(null);
    
    try {
      // Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('Microphone access denied. Please allow microphone access.');
        } else {
          setError(`Failed to start: ${err.message}`);
        }
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
    }
    
    if (recognitionRef.current) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    error,
    startListening,
    stopListening,
  };
};

// Levenshtein distance for fuzzy matching
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j - 1] + 1,
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1
        );
      }
    }
  }
  
  return dp[m][n];
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SpeechRecognition: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webkitSpeechRecognition: any;
  }
}
