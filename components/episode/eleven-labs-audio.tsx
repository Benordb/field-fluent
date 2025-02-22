"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { PlayIcon, PauseIcon } from "lucide-react";
import { toast } from "sonner";
import { ELEVEN_LABS_VOICES, Voice } from "@/types/voice";
import { VoiceSelect } from "./voice-select";

interface ElevenLabsAudioProps {
  text: string;
  onAudioGenerated?: (audioUrl: string, voice: Voice) => void;
  showVoiceSelect?: boolean;
}

export const ElevenLabsAudio = ({
  text,
  onAudioGenerated,
  showVoiceSelect = false,
}: ElevenLabsAudioProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<Voice>(
    ELEVEN_LABS_VOICES[0]
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayAudio = async () => {
    if (!text) {
      toast.error("Please enter text first");
      return;
    }

    try {
      setIsPlaying(true);
      setIsGenerating(true);
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice.voice_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": process.env.NEXT_PUBLIC_ELEVEN_LABS_API_KEY || "",
          },
          body: JSON.stringify({
            text,
            model_id: "eleven_monolingual_v1",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.5,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }

      onAudioGenerated?.(audioUrl, selectedVoice);
    } catch (error) {
      console.error("Error playing audio:", error);
      toast.error("Failed to play audio. Please try again.");
      setIsPlaying(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <VoiceSelect
        selectedVoice={selectedVoice}
        onVoiceChange={setSelectedVoice}
      />

      <Button
        onClick={isPlaying ? handlePause : handlePlayAudio}
        disabled={!text || isGenerating}
        variant="outline"
        className="flex items-center gap-2"
      >
        {isGenerating ? (
          "Generating..."
        ) : isPlaying ? (
          <>
            <PauseIcon className="w-4 h-4" /> Pause
          </>
        ) : (
          <>
            <PlayIcon className="w-4 h-4" /> Play
          </>
        )}
      </Button>

      <audio
        ref={audioRef}
        className="hidden"
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
};
