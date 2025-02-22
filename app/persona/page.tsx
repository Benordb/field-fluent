"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { CreatePersona } from "@/components/persona/create-persona";
import { PersonasTable } from "@/components/persona/personas-table";

interface Persona {
  id: number;
  name: string;
  cheat_sheet: string;
  category_id: string;
  created_at: string;
}

export default function PersonaPage() {
  const supabase = createClient();
  const [personas, setPersonas] = useState<Persona[]>([]);

  useEffect(() => {
    const fetchPersonas = async () => {
      const { data, error } = await supabase.from("persona").select("*");
      if (error) throw error;
      if (data) setPersonas(data);
    };

    fetchPersonas();
  }, [supabase]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Personas</h1>
        <CreatePersona personas={personas} setPersonas={setPersonas} />
      </div>
      <PersonasTable personas={personas} />
    </div>
  );
}
