export interface Voice {
  voice_id: string;
  name: string;
  preview_url?: string;
}

export const ELEVEN_LABS_VOICES: Voice[] = [
  {
    voice_id: "21m00Tcm4TlvDq8ikWAM",
    name: "Rachel",
    preview_url:
      "https://api.elevenlabs.io/v1/voices/21m00Tcm4TlvDq8ikWAM/preview",
  },
  {
    voice_id: "AZnzlk1XvdvUeBnXmlld",
    name: "Domi",
    preview_url:
      "https://api.elevenlabs.io/v1/voices/AZnzlk1XvdvUeBnXmlld/preview",
  },
  {
    voice_id: "EXAVITQu4vr4xnSDxMaL",
    name: "Bella",
    preview_url:
      "https://api.elevenlabs.io/v1/voices/EXAVITQu4vr4xnSDxMaL/preview",
  },
  {
    voice_id: "ErXwobaYiN019PkySvjV",
    name: "Antoni",
    preview_url:
      "https://api.elevenlabs.io/v1/voices/ErXwobaYiN019PkySvjV/preview",
  },
];
