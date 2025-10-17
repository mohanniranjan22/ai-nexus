"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useState, useEffect } from "react";

export function AppSidebar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // ensures the component only renders after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-3">
          <div className="flex justify-between items-center">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="logo"
                width={40}
                height={40}
                className="rounded-md"
              />
              <h2 className="font-bold text-xl">AI Nexus</h2>
            </div>

            {/* Theme Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                {theme === "light" ? <Sun /> : <Moon />}
              </Button>
            )}
          </div>

          {/* New Chat Button */}
          <Button className="mt-7 w-full" size="lg">
            + New
          </Button>
        </div>
      </SidebarHeader>

      {/* Sidebar Main Content */}
      <SidebarContent>
        <SidebarGroup>
          <div className="p-3">
            <h2 className="font-bold text-lg">Chat</h2>
            <p className="text-sm text-gray-400">
              Sign in to start chatting with multiple AI models
            </p>
          </div>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <div className="p-3 mb-10">
          <Button className="w-full" size="lg">
            Sign In / Sign Up
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
