import { EpisodesTable } from "../components/episode/episodes-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Episodes</h1>
        <Link href="/episode/create">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Create Episode
          </Button>
        </Link>
      </div>
      <EpisodesTable />
    </div>
  );
}
