"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { PlayIcon, PauseIcon } from "lucide-react";

interface AudioPlayerProps {
  audioUrl: string | null;
}

export const AudioPlayer = ({ audioUrl }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = () => {
    if (!audioUrl || !audioRef.current) return;
    audioRef.current.play();
    setIsPlaying(true);
  };

  const handlePause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  return (
    <div>
      <Button
        onClick={isPlaying ? handlePause : handlePlay}
        disabled={!audioUrl}
        variant="outline"
        size="sm"
      >
        {isPlaying ? (
          <PauseIcon className="h-4 w-4" />
        ) : (
          <PlayIcon className="h-4 w-4" />
        )}
      </Button>
      <audio
        ref={audioRef}
        src={audioUrl || undefined}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
    </div>
  );
};
