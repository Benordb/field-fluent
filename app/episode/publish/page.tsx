"use client";
import { LEVELS } from "@/types/level";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function PublishPage() {
  const [newEpisode, setNewEpisode] = useState({
    level_id: "",
  });

  return (
    <div className="space-y-2 w-fit">
      <Label>Language Level</Label>
      <Select
        value={newEpisode.level_id}
        onValueChange={(value) =>
          setNewEpisode({ ...newEpisode, level_id: value })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select level" />
        </SelectTrigger>
        <SelectContent>
          {LEVELS.map((level) => (
            <SelectItem key={level.id} value={level.id.toString()}>
              {level.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
