"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { generateText } from "@/utils/openai";
import { Voice } from "@/types/voice";
import { ELEVEN_LABS_VOICES } from "@/types/voice";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LEVELS } from "@/types/level";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategorySelect } from "@/components/persona/category-select";
import { Persona } from "@/types/persona";

export default function CreateEpisodePage() {
  const router = useRouter();
  const supabase = createClient();
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [mode, setMode] = useState("single");
  const [newEpisode, setNewEpisode] = useState({
    title: "",
    description: "",
    text: "",
    type: "single",
    level_id: "",
    persona_id: "",
  });
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedGenre, setSelectedGenre] = useState("");

  useEffect(() => {
    if (selectedGenre) {
      const fetchPersonas = async () => {
        const { data } = await supabase
          .from("persona")
          .select("*")
          .eq("category_id", selectedGenre);
        setPersonas(data || []);
      };
      fetchPersonas();
    }
  }, [selectedGenre, supabase]);

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
      const episodeToCreate = {
        title: newEpisode.title,
        description: newEpisode.description,
        text: newEpisode.text,
        level_id: newEpisode.level_id,
        persona_id: newEpisode.persona_id,
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
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Episode</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <RadioGroup
                value={newEpisode.type}
                onValueChange={(value) =>
                  setNewEpisode({ ...newEpisode, type: value })
                }
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="single" id="single" />
                  <Label htmlFor="single">Single</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="series" id="series" />
                  <Label htmlFor="series">Series</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Genre</Label>
              <CategorySelect
                value={selectedGenre}
                onValueChange={setSelectedGenre}
                showAddButton={false}
              />
            </div>

            {selectedGenre && (
              <div className="space-y-2">
                <Label>Available Personas</Label>
                <RadioGroup
                  value={newEpisode.persona_id}
                  onValueChange={(value) =>
                    setNewEpisode({ ...newEpisode, persona_id: value })
                  }
                  className="border rounded-md p-2 space-y-2"
                >
                  {personas.map((persona) => (
                    <div
                      key={persona.id}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem
                        value={persona.id.toString()}
                        id={`persona-${persona.id}`}
                      />
                      <Label
                        htmlFor={`persona-${persona.id}`}
                        className="text-sm"
                      >
                        {persona.name}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
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
        </div>
        <Button type="submit" disabled={isGeneratingAudio}>
          {isGeneratingAudio ? "Publishing..." : "Publish"}
        </Button>
      </form>
    </div>
  );
}
