"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Bolt, Moon, Sun, User2, Zap } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useState, useEffect } from "react";
import UsageCreditProgress from "./UsageCreditProgress";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";

export function AppSidebar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user } = useUser();
  const [chatHistory, setChatHistory] = useState([]);

  // ensures the component only renders after hydration
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    user && GetChatHistory();
  }, [user]);

  const GetChatHistory = async () => {
    const q = query(
      collection(db, "chatHistory"),
      where("userEmail", "==", user?.primaryEmailAddress?.emailAddress)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, doc.data());
      setChatHistory((prev) => [...prev, doc.data()]);
    });
  };

  const GetLastUserMessageFromChat = async (chat) => {
    const allMessages = Object.values(chat.messages).flat();
    const userMessages = allMessages.filter((msg) => msg.role == "user");
    const lastUserMsg=userMessages[userMessages.length-1].content
  };

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
          {user ? (
            <Button className="mt-7 w-full" size="lg">
              + New
            </Button>
          ) : (
            <SignInButton>
              <Button className="mt-7 w-full" size="lg">
                + New
              </Button>
            </SignInButton>
          )}
        </div>
      </SidebarHeader>

      {/* Sidebar Main Content */}
      <SidebarContent>
        <SidebarGroup>
          <div className="p-3">
            <h2 className="font-bold text-lg">Chat</h2>
            {!user && (
              <p className="text-sm text-gray-400">
                Sign in to start chatting with multiple AI models
              </p>
            )}
            {chatHistory.map((chat, index) => (
              <div></div>
            ))}
          </div>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <div className="p-3 mb-10">
          {!user ? (
            <SignInButton mode="modal">
              <Button className="w-full" size="lg">
                Sign In / Sign Up
              </Button>
            </SignInButton>
          ) : (
            <div>
              <UsageCreditProgress />
              <Button className="w-full mb-3">
                <Zap />
                Upgrade Plan
              </Button>
              <Button className="flex" variant={"ghost"}>
                <User2 />
                <h2> Settings</h2>
              </Button>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
