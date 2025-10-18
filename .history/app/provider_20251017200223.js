"use client";

import React, { useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/AppSidebar";
import AppHeader from "./_components/AppHeader";
import { useUser } from "@clerk/nextjs";
import { db } from "@/config/FirebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { AiSelectedModelContext } from "@/context/AiSelectedModelContext";
import { DefaultModel } from "@/shared/AiModelsShared";
import { UserDetailsContext } from "@/context/UserDetailsContext";
import { Info } from "lucide-react";

function Provider({ children, ...props }) {
  const { user } = useUser();
  const [aiSelectedModels, setAiSelectedModels] = useState(DefaultModel);
  const [userDetails, setUserDetails] = useState();
  const [messages, setMessages] = useState({});

  useEffect(() => {
    if (user) {
      CreateUser();
    }
  }, [user]);

  useEffect(() => {
    if (aiSelectedModels) {
      //update to Firebase Database
      updateAIModelSelectionPref();
    }
  }, [aiSelectedModels]);

  // const updateAIModelSelectionPref = async () => {
  //   const docRef = doc(db, "users", user?.primaryEmailAddress?.emailAddress);
  //   await updateDoc(docRef, {
  //     selectedModelPref: aiSelectedModels,
  //   });
  // };
  const updateAIModelSelectionPref = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      console.warn("User email not available — skipping Firestore update.");
      return;
    }

    const docRef = doc(db, "users", user?.primaryEmailAddress?.emailAddress);
    await updateDoc(docRef, {
      selectedModelPref: aiSelectedModels,
    });
  };

  const CreateUser = async () => {
    //if User exist?
    const userRef = doc(db, "users", user?.primaryEmailAddress?.emailAddress);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      console.log("Existing User");
      const userInfo = userSnap.data();
      setAiSelectedModels(userInfo?.selectedModelPref??DefaultModel);
      setUserDetails(userInfo);
      return;
    } else {
      const userData = {
        name: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
        createdAt: new Date(),
        remainingMsg: 5, //only for free users
        plan: "Free",
        credits: 1000, //Paid User
      };
      await setDoc(userRef, userData);
      console.log(" New user data saved");
      setUserDetails(userData);
    }

    //if not then insert
  };
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      <UserDetailsContext.Provider value={{ userDetails, setUserDetails }}>
        <AiSelectedModelContext.Provider
          value={{
            aiSelectedModels,
            setAiSelectedModels,
            messages,
            setMessages,
          }}
        >
          <SidebarProvider>
            <AppSidebar />

            <div className="w-full">
              <AppHeader />
              {children}
            </div>
          </SidebarProvider>
        </AiSelectedModelContext.Provider>
      </UserDetailsContext.Provider>
    </NextThemesProvider>
  );
}

export default Provider;
