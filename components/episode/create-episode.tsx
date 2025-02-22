"use client";
import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Episode } from "@/types/episode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ElevenLabsAudio } from "./eleven-labs-audio";
import { toast } from "sonner";
import { ELEVEN_LABS_VOICES, Voice } from "@/types/voice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const CreateEpisode = () => {
  const supabase = createClient();
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [open, setOpen] = useState(false);
  const [newEpisode, setNewEpisode] = useState({
    title: "",
    description: "",
    text: "",
    audio_files: [""],
    voice_id: "",
    voice_name: "",
  });

  const generateAudio = async (
    text: string
  ): Promise<{ audioUrl: string; voice: Voice }> => {
    const voice = ELEVEN_LABS_VOICES[0];
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice.voice_id}`,
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
    return { audioUrl, voice };
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

      const { data, error } = await supabase
        .from("episode")
        .insert([episodeToCreate])
        .select();

      if (error) {
        throw error;
      }

      if (data) {
        setNewEpisode({
          title: "",
          description: "",
          text: "",
          audio_files: [""],
          voice_id: "",
          voice_name: "",
        });
        toast.success("Episode created successfully!");
        setOpen(false);
      }
    } catch (error) {
      console.error("Error creating episode:", error);
      toast.error("Failed to create episode. Please try again.");
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 w-fit">
          <PlusCircle className="h-4 w-4" />
          Create Episode
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Episode</DialogTitle>
        </DialogHeader>
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
            <Textarea
              value={newEpisode.text}
              onChange={(e) =>
                setNewEpisode({ ...newEpisode, text: e.target.value })
              }
              placeholder="Enter text to convert to speech..."
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

        {newEpisode.audio_files[0] && (
          <div className="mt-4">
            <audio
              controls
              src={newEpisode.audio_files[0]}
              className="w-full"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
