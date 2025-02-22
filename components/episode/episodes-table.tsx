"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Episode } from "@/types/episode";
import { AudioPlayer } from "./audio-player";
import { useEffect } from "react";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing environment variables for Supabase configuration");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const EpisodesTable = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);

  useEffect(() => {
    fetchEpisodes();
  }, []);

  const fetchEpisodes = async () => {
    const { data, error } = await supabase.from("episode").select("*");
    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error("No data returned from Supabase");
    }
    setEpisodes(data);
  };
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Voice</TableHead>
            <TableHead className="w-[100px]">Audio</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {episodes.map((episode) => (
            <TableRow key={episode.id}>
              <TableCell className="font-medium">{episode.id}</TableCell>
              <TableCell className="font-medium">{episode.title}</TableCell>
              <TableCell>{episode.description}</TableCell>
              <TableCell>{episode.voice_name}</TableCell>
              <TableCell>
                <AudioPlayer audioUrl={episode.audio_url || null} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
