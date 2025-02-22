"use client";
import { cn } from "@/lib/utils";
import { Book, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "./ui/avatar";

const routes = [
  {
    label: "Episodes",
    icon: Book,
    href: "/",
    color: "text-sky-500",
  },
  {
    label: "Personas",
    icon: Users,
    href: "/persona",
    color: "text-violet-500",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const supabase = createClient();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setEmail(user?.email ?? null);
    };
    getUser();
  }, [supabase.auth]);

  return (
    <div className="sidebar space-y-4 pt-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/" className="flex items-center pl-3 mb-14">
          <h1 className="text-xl font-bold">Field Fluent</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href
                  ? "text-white bg-white/10"
                  : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between px-3 py-2 border-t border-gray-700">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p className="text-sm truncate max-w-[100px]">{email}</p>
        </div>
        <ThemeSwitcher />
      </div>
    </div>
  );
}
