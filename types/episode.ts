export interface Episode {
  id: number;
  title: string;
  description: string;
  text: string;
  audio_url?: string | null;
  voice_id?: string;
  voice_name?: string;
  audio_files: string[];
}
