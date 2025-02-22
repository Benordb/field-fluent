"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Category {
  id: number;
  name: string;
}

interface CategorySelectProps {
  value: string;
  onValueChange: (value: string) => void;
  showAddButton?: boolean;
}

export function CategorySelect({
  value,
  onValueChange,
  showAddButton = true,
}: CategorySelectProps) {
  const supabase = createClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("persona_category")
      .select("*")
      .order("name");

    if (error) {
      toast.error("Failed to load categories");
      return;
    }
    setCategories(data || []);
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("persona_category")
        .insert([{ name: newCategoryName.trim() }])
        .select()
        .single();

      if (error) throw error;

      setCategories([...categories, data]);
      onValueChange(data.id.toString());
      setNewCategoryName("");
      setIsCreatingNew(false);
      toast.success("Category created successfully");
    } catch (error) {
      toast.error("Failed to create category");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Select value={value} onValueChange={onValueChange} required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a genre" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {showAddButton && (
          <Dialog open={isCreatingNew} onOpenChange={setIsCreatingNew}>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="shrink-0"
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Enter category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <Button
                  onClick={handleCreateCategory}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? "Creating..." : "Create Category"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
