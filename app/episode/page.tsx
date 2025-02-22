"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import OpenAI from "openai";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const AI_MODELS = [
  { id: "gpt-4", name: "GPT-4" },
  { id: "gpt-4-turbo-preview", name: "GPT-4 Turbo" },
  { id: "o3-mini", name: "GPT-o3-mini" },
  { id: "o1-preview", name: "GPT-o1-preview" },
  { id: "o1-mini", name: "GPT-o1-mini" },
];

export default function EpisodesPage() {
  const [content, setContent] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0].id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const completion = await openai.chat.completions.create({
        model: selectedModel,
        messages: [
          {
            role: "user",
            content,
          },
        ],
      });

      setResponse(completion.choices[0].message.content || "");
      setContent("");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Episodes</h1>
        <Link href="/episode/create">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Create Episode
          </Button>
        </Link>
      </div>

      <div className="flex-1 overflow-auto">
        {response && (
          <Textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            className="h-full w-full resize-none bg-transparent"
            placeholder="AI response will appear here..."
          />
        )}
      </div>

      <div className="border-t mt-auto pt-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-end">
          <div className="flex flex-col gap-2 w-full">
            <Label className="sr-only">Enter your prompt</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter text to send to AI..."
              className="resize-none"
              rows={2}
              required
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {AI_MODELS.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Generating..." : "Generate"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
