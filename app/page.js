"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function Home() {
  const { setTheme } = useTheme();
  return (
    <div>
      <h1>this is ai nexus </h1>
      <Button>subcribe</Button>
      <Button onClick={() => setTheme("dark")}>dark mode</Button>
      <Button onClick={() => setTheme("light")}>light mode</Button>
    </div>
  );
}
