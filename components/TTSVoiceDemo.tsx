"use client";

import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface TTSVoiceDemoProps {
  provider: 'google' | 'cartesia';
  providerName: string;
  demoText?: string;
  isAvailable: boolean;
  onContactSales?: () => void;
}

const TTSVoiceDemo: React.FC<TTSVoiceDemoProps> = ({
  provider,
  providerName,
  demoText = "Hello! This is a sample of our AI voice technology. Experience natural, human-like speech for your customer interactions.",
  isAvailable,
  onContactSales
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Demo audio URLs - using actual audio files
  const demoUrls = {
    google: '/demo-audio/google-tts-demo.m4a',
    cartesia: '/demo-audio/cartesia-tts-demo.wav'
  };

  const handlePlayDemo = async () => {
    if (!audioRef.current) return;

    try {
      setIsLoading(true);
      
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Try to load and play audio file
        audioRef.current.src = demoUrls[provider];
        
        // Add a small delay to ensure audio is loaded
        audioRef.current.load();
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing demo audio:', error);
      // Fallback: show text demo with TTS info
      alert(`🎵 ${providerName} Voice Demo\n\n"${demoText}"\n\n⚠️ Audio playback failed. Please check your browser's audio settings or try refreshing the page.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mt-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Volume2 className="w-4 h-4 text-blue-400" />
          <h4 className="text-sm font-medium text-slate-200">
            {providerName} Voice Demo
          </h4>
        </div>
        
        {isAvailable ? (
          <span className="px-2 py-1 text-xs bg-green-600/20 text-green-400 rounded-full border border-green-600/30">
            Available
          </span>
        ) : (
          <span className="px-2 py-1 text-xs bg-orange-600/20 text-orange-400 rounded-full border border-orange-600/30">
            Contact Sales
          </span>
        )}
      </div>

      <div className="text-sm text-slate-400 mb-3 max-h-20 overflow-y-auto">
        <p className="italic">"{demoText}"</p>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={handlePlayDemo}
          disabled={isLoading}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg text-sm transition-colors"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          <span>{isLoading ? 'Loading...' : isPlaying ? 'Pause' : 'Play Demo'}</span>
        </button>

        {!isAvailable && onContactSales && (
          <button
            onClick={onContactSales}
            className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
          >
            Contact Sales
          </button>
        )}
      </div>

      <audio
        ref={audioRef}
        onEnded={handleAudioEnd}
        onError={(e) => {
          console.error('Audio error:', e);
          setIsPlaying(false);
          setIsLoading(false);
        }}
        className="hidden"
      />
    </div>
  );
};

export default TTSVoiceDemo;