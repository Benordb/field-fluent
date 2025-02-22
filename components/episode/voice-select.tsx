"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ELEVEN_LABS_VOICES, Voice } from "@/types/voice";

interface VoiceSelectProps {
  selectedVoice: Voice;
  onVoiceChange: (voice: Voice) => void;
}

export const VoiceSelect = ({
  selectedVoice,
  onVoiceChange,
}: VoiceSelectProps) => {
  return (
    <Select
      value={selectedVoice.voice_id}
      onValueChange={(value: string) => {
        const voice = ELEVEN_LABS_VOICES.find((v) => v.voice_id === value);
        if (voice) onVoiceChange(voice);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a voice" />
      </SelectTrigger>
      <SelectContent>
        {ELEVEN_LABS_VOICES.map((voice) => (
          <SelectItem key={voice.voice_id} value={voice.voice_id}>
            {voice.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
