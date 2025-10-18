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
import { Moon, Sun, User2, Zap } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import UsageCreditProgress from "./UsageCreditProgress";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import moment from "moment/moment";
import Link from "next/link";

export function AppSidebar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user } = useUser();
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => setMounted(true), []);

  // 🔥 Real-time Firestore listener
  useEffect(() => {
    if (!user) {
      setChatHistory([]);
      return;
    }

    const q = query(
      collection(db, "chatHistory"),
      where("userEmail", "==", user?.primaryEmailAddress?.emailAddress)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map((doc) => doc.data());
      setChatHistory(chats);
    });

    return () => unsubscribe();
  }, [user]);

  const GetLastUserMessageFromChatSync = (chat) => {
    try {
      if (!chat) return { chatId: null, message: null, lastMsgDate: null };

      let allMessages = [];
      if (Array.isArray(chat.messages)) {
        allMessages = chat.messages;
      } else if (chat.messages && typeof chat.messages === "object") {
        const vals = Object.values(chat.messages);
        allMessages = Array.isArray(vals[0]) ? vals.flat() : vals;
      }

      const userMessages = allMessages.filter((msg) => msg?.role === "user");
      const lastUserMsg = userMessages.at(-1)?.content ?? null;
      const lastUpdated = chat.lastUpdated ?? Date.now();
      const formattedDate = moment(lastUpdated).fromNow();
      

      return {
        chatId: chat.chatId,
        message: lastUserMsg,
        lastMsgDate: formattedDate,
        lastMsgTimestamp: lastUpdated, 
      };
    } catch (err) {
      console.error("Message parse error:", err);
      return { chatId: chat?.chatId, message: null, lastMsgDate: null };
    }
  };

  const processedChats = useMemo(
    () => chatHistory.map((c) => GetLastUserMessageFromChatSync(c)),
    [chatHistory]
  );

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-3">
          <div className="flex justify-between items-center">
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

            {mounted && (
              <Button
                variant="ghost"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                {theme === "light" ? <Sun /> : <Moon />}
              </Button>
            )}
          </div>

          {user ? (
            <Link href={"/"}>
              <Button className="mt-7 w-full" size="lg">
                + New
              </Button>
            </Link>
          ) : (
            <SignInButton>
              <Button className="mt-7 w-full" size="lg">
                + New
              </Button>
            </SignInButton>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <div className="p-3">
            <h2 className="font-bold text-lg">Chat</h2>
            {!user && (
              <p className="text-sm text-gray-400">
                Sign in to start chatting with multiple AI models
              </p>
            )}

            {processedChats.length === 0 ? (
              <p className="text-sm text-gray-400 mt-3">No chats yet</p>
            ) : (
              processedChats
                .sort((a, b) => b.lastMsgTimestamp - a.lastMsgTimestamp)
                .map((chat, index) => (
                  <Link
                    href={"?chat=" + (chat.chatId ?? index)}
                    key={chat.chatId ?? index}
                    className="mt-2"
                  >
                    <div className="hover:bg-gray-100 p-3 cursor-pointer">
                      <h2 className="text-sm text-gray-400">
                        {chat.lastMsgDate}
                      </h2>
                      <h2 className="text-lg line-clamp-1">
                        {chat.message ?? "—"}
                      </h2>
                      <hr className="my-3" />
                    </div>
                  </Link>
                ))
            )}
          </div>
        </SidebarGroup>
      </SidebarContent>

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
                <h2>Settings</h2>
              </Button>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
