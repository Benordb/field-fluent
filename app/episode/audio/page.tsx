"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ElevenLabsAudio } from "@/components/episode/eleven-labs-audio";
import { Voice } from "@/types/voice";
import { toast } from "sonner";

export default function AudioPage() {
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [voice, setVoice] = useState<Voice | null>(null);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Generate Audio</h1>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Text for Audio</Label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to convert to speech..."
            rows={8}
          />
        </div>
        <ElevenLabsAudio
          text={text}
          onAudioGenerated={(url, selectedVoice) => {
            setAudioUrl(url);
            setVoice(selectedVoice);
          }}
          showVoiceSelect={true}
        />
      </div>
    </div>
  );
}
