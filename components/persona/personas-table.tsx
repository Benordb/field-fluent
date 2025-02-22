"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

interface Category {
  id: number;
  name: string;
}

interface Persona {
  id: number;
  name: string;
  cheat_sheet: string;
  category_id: string;
  created_at: string;
}

interface PersonasTableProps {
  personas: Persona[];
}

export function PersonasTable({ personas }: PersonasTableProps) {
  const supabase = createClient();
  const [categories, setCategories] = useState<Category[]>([]);

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

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id.toString() == categoryId);
    return category?.name || "Unknown";
  };
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>Cheat Sheet</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {personas.map((persona) => (
            <TableRow key={persona.id}>
              <TableCell className="font-medium">{persona.id}</TableCell>
              <TableCell>{persona.name}</TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {getCategoryName(persona.category_id)}
                </Badge>
              </TableCell>
              <TableCell className="max-w-md truncate">
                {persona.cheat_sheet}
              </TableCell>
              <TableCell>
                {new Date(persona.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
