import React, { useRef, useEffect, useState } from 'react';
import { 
  Mic, 
  MicOff, 
  Pause, 
  Play, 
  Square, 
  Send, 
  X, 
  RotateCcw, 
  Volume2,
  AlertCircle,
  Settings
} from 'lucide-react';
import { useAdvancedVoiceRecording, RecordingState } from '../hooks/useAdvancedVoiceRecording';

interface AdvancedVoiceRecorderProps {
  onSendVoiceMessage: (audioBlob: Blob) => void;
  onCancel: () => void;
  isDisabled?: boolean;
  className?: string;
}

const AdvancedVoiceRecorder: React.FC<AdvancedVoiceRecorderProps> = ({
  onSendVoiceMessage,
  onCancel,
  isDisabled = false,
  className = ''
}) => {
  const {
    recordingState,
    recordingTime,
    maxDuration,
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
    requestPermission
  } = useAdvancedVoiceRecording(90);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => setPlaybackTime(audioElement.currentTime);
    const onLoadedMetadata = () => setDuration(audioElement.duration);
    const onEnded = () => {
      setIsPlaying(false);
      setPlaybackTime(0);
    };

    audioElement.addEventListener('play', onPlay);
    audioElement.addEventListener('pause', onPause);
    audioElement.addEventListener('timeupdate', onTimeUpdate);
    audioElement.addEventListener('loadedmetadata', onLoadedMetadata);
    audioElement.addEventListener('ended', onEnded);

    return () => {
      audioElement.removeEventListener('play', onPlay);
      audioElement.removeEventListener('pause', onPause);
      audioElement.removeEventListener('timeupdate', onTimeUpdate);
      audioElement.removeEventListener('loadedmetadata', onLoadedMetadata);
      audioElement.removeEventListener('ended', onEnded);
    };
  }, [audioRef.current, audioUrl]);

  const handleSend = () => {
    const blob = sendRecording();
    if (blob) {
      onSendVoiceMessage(blob);
    }
    onCancel();
  };

  const handleCancel = () => {
    cancelRecording();
    onCancel();
  };
  
  const getProgressPercentage = (current: number, total: number) => {
    if (total === 0) return 0;
    return (current / total) * 100;
  };
  
  const isNearMaxDuration = recordingTime >= maxDuration - 10;
  
  const renderRecordingState = () => (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Recording...</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-lg font-mono ${isNearMaxDuration ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`}>
            {formatTime(recordingTime)}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">/ {formatTime(maxDuration)}</span>
        </div>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${isNearMaxDuration ? 'bg-red-500' : 'bg-purple-500'}`}
          style={{ width: `${getProgressPercentage(recordingTime, maxDuration)}%` }}
        ></div>
      </div>
      <div className="flex items-center justify-center space-x-4">
        <button onClick={pauseRecording} className="p-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600" title="Pause"><Pause className="w-5 h-5" /></button>
        <button onClick={stopRecording} className="p-4 bg-red-500 text-white rounded-full hover:bg-red-600" title="Stop"><Square className="w-6 h-6" /></button>
        <button onClick={handleCancel} className="p-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600" title="Cancel"><X className="w-5 h-5" /></button>
      </div>
    </div>
  );

  const renderPausedState = () => (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Paused</span>
        <span className="text-lg font-mono">{formatTime(recordingTime)}</span>
      </div>
      <div className="flex items-center justify-center space-x-4">
        <button onClick={resumeRecording} className="p-4 bg-green-500 text-white rounded-full hover:bg-green-600" title="Resume"><Play className="w-6 h-6" /></button>
        <button onClick={handleCancel} className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full" title="Cancel"><X className="w-5 h-5" /></button>
      </div>
    </div>
  );

  const renderPreviewState = () => {
    const playbackProgress = getProgressPercentage(playbackTime, duration);
    return (
      <div className="w-full">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
          <audio ref={audioRef} src={audioUrl || ''} onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)} />
          <div className="flex items-center space-x-3">
            <button onClick={handlePlayPause} className="p-2 bg-purple-500 text-white rounded-full">{isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}</button>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2"><div className="bg-purple-500 h-2 rounded-full" style={{ width: `${playbackProgress}%` }}></div></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{formatTime(playbackTime)} / {formatTime(duration)}</span>
          </div>
        </div>
        <div className="flex items-center justify-center space-x-3">
          <button onClick={reRecord} className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"><RotateCcw className="w-4 h-4" /><span className="text-sm">Re-record</span></button>
          <button onClick={handleSend} className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg"><Send className="w-4 h-4" /><span className="text-sm">Send</span></button>
          <button onClick={handleCancel} className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"><X className="w-4 h-4" /><span className="text-sm">Cancel</span></button>
        </div>
      </div>
    );
  };
  
  const renderErrorState = () => (
    <div className="w-full p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
      <div className="flex items-center mb-2">
        <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
        <h4 className="font-semibold text-red-800 dark:text-red-200">Recording Error</h4>
      </div>
      <p className="text-sm text-red-700 dark:text-red-300 mb-3">{error}</p>
      <div className="flex items-center space-x-3">
        <button onClick={requestPermission} className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600">Try Again</button>
        <button onClick={handleCancel} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-sm rounded hover:bg-gray-300">Cancel</button>
      </div>
    </div>
  );

  switch (recordingState) {
    case 'recording': return renderRecordingState();
    case 'paused': return renderPausedState();
    case 'preview': return renderPreviewState();
    case 'error': return renderErrorState();
    default: // idle state
      return (
        <div className="flex items-center justify-center w-full">
          <button
            onClick={startRecording}
            disabled={isDisabled}
            className="p-4 bg-purple-500 text-white rounded-full transition-transform hover:scale-110"
            title="Start recording"
          >
            <Mic className="w-8 h-8" />
          </button>
        </div>
      );
  }
};

export default AdvancedVoiceRecorder; 