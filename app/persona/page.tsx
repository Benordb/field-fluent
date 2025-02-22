"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { CreatePersona } from "@/components/persona/create-persona";
import { PersonasTable } from "@/components/persona/personas-table";
import { Persona } from "@/types/persona";

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
