import { useState, useRef, useCallback, useEffect } from 'react';

export type RecordingState = 'idle' | 'recording' | 'paused' | 'preview' | 'error';

export interface UseAdvancedVoiceRecordingReturn {
  recordingState: RecordingState;
  recordingTime: number;
  maxDuration: number;
  audioBlob: Blob | null;
  audioUrl: string | null;
  error: string | null;
  hasPermission: boolean | null;
  startRecording: () => void;
  stopRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  cancelRecording: () => void;
  reRecord: () => void;
  sendRecording: () => Blob | null;
  requestPermission: () => Promise<void>;
  formatTime: (time: number) => string;
}

export const useAdvancedVoiceRecording = (maxDurationInSeconds: number = 60): UseAdvancedVoiceRecordingReturn => {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const maxDuration = maxDurationInSeconds;

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setRecordingTime(elapsed);
      
      // Auto-stop when max duration is reached
      if (elapsed >= maxDuration) {
        stopRecording();
      }
    }, 1000);
  }, [maxDuration]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const cleanupStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        } 
      });
      
      // Immediately stop the stream after getting permission
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      setError(null);
    } catch (err) {
      console.error('Microphone permission denied:', err);
      setHasPermission(false);
      setError('Microphone access is required for voice recording. Please enable it in your browser settings.');
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      audioChunksRef.current = [];
      setRecordingTime(0);
      
      // Check permission first
      if (hasPermission === false) {
        await requestPermission();
        if (hasPermission === false) return;
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        } 
      });
      
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        cleanupStream();
        
        if (audioChunksRef.current.length > 0) {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          setAudioBlob(blob);
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
        }
      };
      
      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setError('Recording failed. Please try again.');
        setRecordingState('error');
        cleanupStream();
      };
      
      mediaRecorder.start(1000); // Collect data every second
      setRecordingState('recording');
      startTimer();
      
    } catch (err) {
      console.error('Error starting recording:', err);
      setError(err instanceof Error ? err.message : 'Failed to start recording');
      setRecordingState('error');
    }
  }, [hasPermission, requestPermission, startTimer, cleanupStream]);

  const stopRecording = useCallback(async () => {
    if (!mediaRecorderRef.current || recordingState !== 'recording') {
      return;
    }
    
    mediaRecorderRef.current.stop();
    stopTimer();
    setRecordingState('preview');
  }, [recordingState, stopTimer]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.pause();
      setRecordingState('paused');
      stopTimer();
    }
  }, [recordingState, stopTimer]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState === 'paused') {
      mediaRecorderRef.current.resume();
      setRecordingState('recording');
      startTimer();
    }
  }, [recordingState, startTimer]);

  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    cleanupStream();
    stopTimer();
    setRecordingState('idle');
    setRecordingTime(0);
    setAudioBlob(null);
    setAudioUrl(null);
    setError(null);
    audioChunksRef.current = [];
  }, [cleanupStream, stopTimer]);

  const reRecord = useCallback(() => {
    // Clean up previous recording
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingState('idle');
    setRecordingTime(0);
    audioChunksRef.current = [];
  }, [audioUrl]);

  const sendRecording = (): Blob | null => {
    const blobToReturn = audioBlob;
    // Reset all states to initial values
    setRecordingState('idle');
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setRecordingTime(0);
    return blobToReturn;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupStream();
      stopTimer();
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [cleanupStream, stopTimer, audioUrl]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    recordingState,
    recordingTime,
    maxDuration,
    audioBlob,
    audioUrl,
    error,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    cancelRecording,
    reRecord,
    sendRecording,
    formatTime,
    hasPermission,
    requestPermission,
  };
}; 