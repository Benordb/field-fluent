"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ElevenLabsAudio } from "@/components/episode/eleven-labs-audio";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { generateText } from "@/utils/openai";

export default function CreateEpisodePage() {
  const router = useRouter();
  const supabase = createClient();
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [newEpisode, setNewEpisode] = useState({
    title: "",
    description: "",
    text: "",
    audio_files: [""],
    voice_id: "",
    voice_name: "",
  });

  const handleGenerateText = async () => {
    if (!newEpisode.title) {
      toast.error("Please enter a title first");
      return;
    }

    try {
      setIsGeneratingText(true);
      const text = await generateText(newEpisode.title);
      setNewEpisode((prev) => ({ ...prev, text }));
      toast.success("Text generated successfully!");
    } catch (error) {
      toast.error("Failed to generate text");
    } finally {
      setIsGeneratingText(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newEpisode.text) {
      toast.error("Please enter text for audio");
      return;
    }

    try {
      setIsGeneratingAudio(true);
      const { audioUrl, voice } = await generateAudio(newEpisode.text);

      const episodeToCreate = {
        title: newEpisode.title,
        description: newEpisode.description,
        text: newEpisode.text,
        audio_url: audioUrl,
        voice_id: voice.voice_id,
        voice_name: voice.name,
      };

      const { error } = await supabase
        .from("episode")
        .insert([episodeToCreate]);

      if (error) throw error;

      toast.success("Episode created successfully!");
      router.push("/");
    } catch (error) {
      console.error("Error creating episode:", error);
      toast.error("Failed to create episode. Please try again.");
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Episode</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            type="text"
            value={newEpisode.title}
            onChange={(e) =>
              setNewEpisode({ ...newEpisode, title: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={newEpisode.description}
            onChange={(e) =>
              setNewEpisode({ ...newEpisode, description: e.target.value })
            }
            required
            placeholder="Enter episode description"
          />
        </div>
        <div className="space-y-2">
          <Label>Text for Audio</Label>
          <div className="flex gap-2 mb-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleGenerateText}
              disabled={isGeneratingText || !newEpisode.title}
            >
              {isGeneratingText ? "Generating..." : "Generate Text"}
            </Button>
          </div>
          <Textarea
            value={newEpisode.text}
            onChange={(e) =>
              setNewEpisode({ ...newEpisode, text: e.target.value })
            }
            placeholder="Enter text to convert to speech..."
            rows={8}
          />
          <ElevenLabsAudio
            text={newEpisode.text}
            onAudioGenerated={(audioUrl, voice) => {
              setNewEpisode((prev) => ({
                ...prev,
                audio_files: [audioUrl],
                voice_id: voice.voice_id,
                voice_name: voice.name,
              }));
            }}
            showVoiceSelect={true}
          />
        </div>
        <Button type="submit" disabled={isGeneratingAudio}>
          {isGeneratingAudio ? "Generating Audio..." : "Create Episode"}
        </Button>
      </form>
    </div>
  );
}
