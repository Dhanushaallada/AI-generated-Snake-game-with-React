import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music as MusicIcon } from 'lucide-react';
import { Track } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Horizon',
    artist: 'Cyber Synth AI',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/synth/400/400',
  },
  {
    id: '2',
    title: 'Midnight Drive',
    artist: 'Retrowave Bot',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/drive/400/400',
  },
  {
    id: '3',
    title: 'Digital Dreams',
    artist: 'Lo-Fi Neural',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/dream/400/400',
  },
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(console.error);
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(currentProgress || 0);
    }
  };

  return (
    <div className="hw-card w-full max-w-md p-6 flex flex-col gap-6 relative overflow-hidden">
      {/* Top Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-hw-accent hw-active-glow' : 'bg-hw-text-secondary'}`} />
          <span className="hw-label">Audio Stream</span>
        </div>
        <span className="hw-value text-[10px] opacity-40">CH: 01/02</span>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={skipForward}
      />

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-6">
          <motion.div 
            key={currentTrack.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative w-24 h-24 rounded-lg overflow-hidden border border-hw-text-secondary/20 bg-hw-bg/5"
          >
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title} 
              className="w-full h-full object-cover opacity-80 mix-blend-luminosity"
              referrerPolicy="no-referrer"
            />
            {isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-hw-card/20">
                <div className="flex gap-1 items-end h-8">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ height: ['20%', '100%', '20%'] }}
                      transition={{ repeat: Infinity, duration: 0.4, delay: i * 0.1 }}
                      className="w-1 bg-hw-accent"
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-hw-text-primary truncate uppercase tracking-tight">{currentTrack.title}</h3>
            <p className="hw-label truncate mt-1">{currentTrack.artist}</p>
            <div className="flex items-center gap-2 mt-4">
              <div className="p-1 bg-hw-bg/10 rounded border border-hw-text-secondary/10">
                <MusicIcon size={12} className="text-hw-accent" />
              </div>
              <span className="hw-label text-[8px]">PCM 24-bit / 48kHz</span>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex justify-between hw-label text-[9px]">
            <span>{Math.floor((audioRef.current?.currentTime || 0) / 60)}:{(Math.floor((audioRef.current?.currentTime || 0) % 60)).toString().padStart(2, '0')}</span>
            <span>{Math.floor((audioRef.current?.duration || 0) / 60)}:{(Math.floor((audioRef.current?.duration || 0) % 60)).toString().padStart(2, '0')}</span>
          </div>
          <div className="h-1 w-full bg-hw-bg/10 rounded-full overflow-hidden relative">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-hw-accent hw-active-glow"
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', bounce: 0, duration: 0.1 }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-2">
          <button className="p-2 text-hw-text-secondary hover:text-hw-accent transition-colors">
            <Volume2 size={16} />
          </button>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={skipBackward}
              className="p-2 text-hw-text-secondary hover:text-hw-text-primary transition-all active:scale-90"
            >
              <SkipBack size={20} fill="currentColor" />
            </button>
            <button 
              onClick={togglePlay}
              className="w-12 h-12 bg-hw-bg/5 border border-hw-accent/30 text-hw-accent rounded-full flex items-center justify-center hover:border-hw-accent hover:bg-hw-accent/10 transition-all active:scale-95 hw-active-glow"
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
            </button>
            <button 
              onClick={skipForward}
              className="p-2 text-hw-text-secondary hover:text-hw-text-primary transition-all active:scale-90"
            >
              <SkipForward size={20} fill="currentColor" />
            </button>
          </div>

          <div className="w-8" />
        </div>
      </div>
    </div>
  );
};
