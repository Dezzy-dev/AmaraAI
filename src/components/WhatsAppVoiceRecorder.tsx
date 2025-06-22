import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, X, Send } from 'lucide-react';
import { useVoiceRecording } from '../hooks/useVoiceRecording';

interface WhatsAppVoiceRecorderProps {
  onSendVoiceMessage: (audioBlob: Blob) => void;
  isDisabled?: boolean;
  className?: string;
}

const WhatsAppVoiceRecorder: React.FC<WhatsAppVoiceRecorderProps> = ({
  onSendVoiceMessage,
  isDisabled = false,
  className = ''
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [dragDistance, setDragDistance] = useState(0);
  const [showCancel, setShowCancel] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const {
    isRecording,
    isHolding,
    recordingTime,
    startHoldRecording,
    stopHoldRecording,
    cancelRecording,
    error
  } = useVoiceRecording();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMouseDown = async (e: React.MouseEvent) => {
    if (isDisabled) return;
    e.preventDefault();
    setIsPressed(true);
    await startHoldRecording();
  };

  const handleMouseUp = async () => {
    if (isDisabled || !isPressed) return;
    setIsPressed(false);
    setDragDistance(0);
    setShowCancel(false);
    
    if (showCancel) {
      cancelRecording();
    } else {
      const audioBlob = await stopHoldRecording();
      if (audioBlob && audioBlob.size > 0) {
        onSendVoiceMessage(audioBlob);
      }
    }
  };

  const handleMouseLeave = async () => {
    if (isDisabled || !isPressed) return;
    setIsPressed(false);
    setDragDistance(0);
    setShowCancel(false);
    
    if (showCancel) {
      cancelRecording();
    } else {
      const audioBlob = await stopHoldRecording();
      if (audioBlob && audioBlob.size > 0) {
        onSendVoiceMessage(audioBlob);
      }
    }
  };

  const handleTouchStart = async (e: React.TouchEvent) => {
    if (isDisabled) return;
    e.preventDefault();
    setIsPressed(true);
    setTouchStartY(e.touches[0].clientY);
    await startHoldRecording();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDisabled || !isPressed) return;
    e.preventDefault();
    
    const currentY = e.touches[0].clientY;
    const distance = touchStartY - currentY;
    setDragDistance(Math.max(0, distance));
    
    // Show cancel if dragged up more than 50px
    setShowCancel(distance > 50);
  };

  const handleTouchEnd = async () => {
    if (isDisabled || !isPressed) return;
    setIsPressed(false);
    setDragDistance(0);
    setShowCancel(false);
    
    if (showCancel) {
      cancelRecording();
    } else {
      const audioBlob = await stopHoldRecording();
      if (audioBlob && audioBlob.size > 0) {
        onSendVoiceMessage(audioBlob);
      }
    }
  };

  // Handle escape key to cancel recording
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isRecording) {
        cancelRecording();
        setIsPressed(false);
        setDragDistance(0);
        setShowCancel(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isRecording, cancelRecording]);

  return (
    <div className={`relative ${className}`}>
      {/* Recording Overlay */}
      {isRecording && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              {/* Recording Animation */}
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                  <Mic className="w-8 h-8 text-white" />
                </div>
              </div>
              
              {/* Recording Text */}
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {showCancel ? 'Slide to cancel' : 'Recording...'}
              </p>
              
              {/* Timer */}
              <p className="text-2xl font-mono text-gray-600 dark:text-gray-300 mb-4">
                {formatTime(recordingTime)}
              </p>
              
              {/* Cancel Icon */}
              {showCancel && (
                <div className="flex items-center justify-center text-red-500">
                  <X className="w-6 h-6 mr-2" />
                  <span className="text-sm font-medium">Release to cancel</span>
                </div>
              )}
              
              {/* Instructions */}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {showCancel 
                  ? 'Release to cancel recording' 
                  : 'Release to send • Slide up to cancel'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Voice Button */}
      <button
        ref={buttonRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        disabled={isDisabled}
        className={`relative p-3 rounded-full transition-all duration-200 ${
          isRecording
            ? 'bg-red-500 text-white scale-110'
            : isDisabled
            ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400'
        }`}
        title={isRecording ? 'Recording... Release to send' : 'Hold to record voice message'}
      >
        {isRecording ? (
          <MicOff className="w-5 h-5" />
        ) : (
          <Mic className="w-5 h-5" />
        )}
        
        {/* Recording Indicator */}
        {isRecording && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
        )}
        
        {/* Disabled Lock */}
        {isDisabled && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
            <X className="w-2 h-2 text-white" />
          </div>
        )}
      </button>

      {/* Error Message */}
      {error && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          {error}
        </div>
      )}
    </div>
  );
};

export default WhatsAppVoiceRecorder; 