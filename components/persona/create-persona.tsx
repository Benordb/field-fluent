"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
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
import { CategorySelect } from "./category-select";
import { Persona } from "@/types/persona";

interface Category {
  id: number;
  name: string;
}

interface CreatePersonaProps {
  personas: Persona[];
  setPersonas: (personas: Persona[]) => void;
}

export function CreatePersona({ personas, setPersonas }: CreatePersonaProps) {
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newPersona, setNewPersona] = useState({
    name: "",
    cheat_sheet: "",
    category_id: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("persona_category")
        .select("*");
      if (error) {
        console.log(error);
        return;
      }
      setCategories(data || []);
    };

    fetchCategories();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("persona")
        .insert([newPersona])
        .select();

      if (error) {
        throw error;
      }

      if (data) {
        setPersonas([...personas, ...data]);
        setNewPersona({
          name: "",
          cheat_sheet: "",
          category_id: "",
        });
        toast.success("Persona created successfully!");
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to create persona. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 w-fit">
          <PlusCircle className="h-4 w-4" />
          Create Persona
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Persona</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={newPersona.name}
              onChange={(e) =>
                setNewPersona({ ...newPersona, name: e.target.value })
              }
              placeholder="Enter persona name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <CategorySelect
              value={newPersona.category_id}
              onValueChange={(value) =>
                setNewPersona({ ...newPersona, category_id: value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Cheat Sheet</Label>
            <Textarea
              value={newPersona.cheat_sheet}
              onChange={(e) =>
                setNewPersona({ ...newPersona, cheat_sheet: e.target.value })
              }
              placeholder="Enter persona cheat sheet"
              required
              rows={5}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Persona"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
