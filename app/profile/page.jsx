// app/profile/page.jsx - Updated version
"use client";

import { useUser } from "@clerk/nextjs";
import { UserProfile } from "@clerk/nextjs";
import { ArrowLeft, Settings, User, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState, useContext } from "react";
import { ModelPreferences } from "../_components/ModelPreferences";
import UsageCreditProgress from "../_components/UsageCreditProgress";
import PricingModal from "../_components/PricingModal";
import { AiSelectedModelContext } from "@/context/AiSelectedModelContext";
import axios from "axios";

export default function ProfilePage() {
  const { user } = useUser();
  const { isLoaded, has } = useAuth();
  const [paidUser, setPaidUser] = useState(false);
  const [freeMsgCount, setFreeMsgCount] = useState(0);
  const { messages } = useContext(AiSelectedModelContext);

  useEffect(() => {
    if (isLoaded) {
      const checkPaidUser = async () => {
        try {
          const isPaid = await has({ plan: "unlimited_plan" });
          setPaidUser(isPaid);
        } catch (error) {
          console.error("Error checking paid user:", error);
          setPaidUser(false);
        }
      };
      checkPaidUser();
    }
  }, [isLoaded, has]);

  // Get real remaining token count (same as sidebar)
  useEffect(() => {
    GetRemainingTokenMsgs();
  }, [messages, user]); // Update when messages change or user changes

  const GetRemainingTokenMsgs = async () => {
    if (!user) return;

    try {
      const result = await axios.get("/api/user-remaining-msg");
      console.log("Profile - Remaining tokens:", result?.data?.remainingToken);
      setFreeMsgCount(result?.data?.remainingToken || 0);
    } catch (error) {
      console.error("Error fetching remaining tokens:", error);
      setFreeMsgCount(0);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Profile Settings</h1>
              <p className="text-muted-foreground">
                Manage your profile information and AI model preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="models" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                AI Models
              </TabsTrigger>
              <TabsTrigger
                value="subscription"
                className="flex items-center gap-2"
              >
                <Zap className="h-4 w-4" />
                Subscription
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Manage your basic profile details and account information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Email</h3>
                        <p className="text-muted-foreground">
                          {user?.primaryEmailAddress?.emailAddress}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Full Name</h3>
                        <p className="text-muted-foreground">
                          {user?.fullName || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 bg-muted rounded-lg">
                      <UserProfile
                        appearance={{
                          elements: {
                            rootBox: "w-full",
                            card: "w-full shadow-none border-none bg-transparent",
                            navbar: "hidden",
                            header: "hidden",
                          },
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI Models Tab */}
            <TabsContent value="models">
              <ModelPreferences />
            </TabsContent>

            {/* Subscription Tab */}
            <TabsContent value="subscription">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Information</CardTitle>
                  <CardDescription>
                    Manage your subscription plan and usage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!paidUser ? (
                    <>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Free Plan
                        </h3>
                        <UsageCreditProgress remainingToken={freeMsgCount} />
                        <p className="text-sm text-muted-foreground mt-2">
                          {freeMsgCount}/15 messages used • Upgrade for
                          unlimited messages and premium AI models
                        </p>
                      </div>

                      <PricingModal>
                        <Button className="w-full" size="lg">
                          <Zap className="h-4 w-4 mr-2" />
                          Upgrade to Premium
                        </Button>
                      </PricingModal>

                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900 dark:border-blue-700">
                        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                          Premium Features
                        </h4>
                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                          <li>• Unlimited messages</li>
                          <li>
                            • Access to premium AI models (GPT-4, Claude-2,
                            etc.)
                          </li>
                          <li>• Faster response times</li>
                          <li>• Priority support</li>
                        </ul>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Zap className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-green-600 mb-2">
                        Premium Plan Active
                      </h3>
                      <p className="text-muted-foreground">
                        You have unlimited access to all AI models and features
                      </p>

                      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900 dark:border-green-700">
                        <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                          Current Usage
                        </h4>
                        <p className="text-sm text-green-800 dark:text-green-200">
                          • Unlimited messages available
                        </p>
                        <p className="text-sm text-green-800 dark:text-green-200">
                          • All premium AI models unlocked
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}



