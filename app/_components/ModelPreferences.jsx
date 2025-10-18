// // app/profile/_components/ModelPreferences.jsx
// "use client";

// import { useContext, useState, useEffect } from "react";
// import { useUser } from "@clerk/nextjs";
// import { AiSelectedModelContext } from "@/context/AiSelectedModelContext";
// import { db } from "@/config/FirebaseConfig";
// import { doc, updateDoc } from "firebase/firestore";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { Save } from "lucide-react";
// import { toast } from "react-toastify";
// import AiModelList from "@/shared/AiModelList";

// export function ModelPreferences() {
//   const { user } = useUser();
//   const { aiSelectedModels, setAiSelectedModels } = useContext(
//     AiSelectedModelContext
//   );
//   const [localPreferences, setLocalPreferences] = useState({});
//   const [isSaving, setIsSaving] = useState(false);

//   useEffect(() => {
//     if (aiSelectedModels) {
//       setLocalPreferences(aiSelectedModels);
//     }
//   }, [aiSelectedModels]);

//   const handleModelToggle = (modelKey, enabled) => {
//     setLocalPreferences((prev) => ({
//       ...prev,
//       [modelKey]: {
//         ...prev[modelKey],
//         enable: enabled,
//       },
//     }));
//   };

//   const handleModelSelection = (modelKey, subModelId) => {
//     setLocalPreferences((prev) => ({
//       ...prev,
//       [modelKey]: {
//         ...prev[modelKey],
//         modelId: subModelId,
//         enable: prev[modelKey]?.enable || true,
//       },
//     }));
//   };

//   const savePreferences = async () => {
//     if (!user?.primaryEmailAddress?.emailAddress) {
//       toast.error("User not authenticated");
//       return;
//     }

//     setIsSaving(true);
//     try {
//       const docRef = doc(db, "users", user.primaryEmailAddress.emailAddress);
//       await updateDoc(docRef, {
//         selectedModelPref: localPreferences,
//         lastUpdated: new Date(),
//       });

//       setAiSelectedModels(localPreferences);
//       toast.success("Preferences saved successfully!");
//     } catch (error) {
//       console.error("Error saving preferences:", error);
//       toast.error("Failed to save preferences");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const getSubModelName = (modelKey, subModelId) => {
//     const model = AiModelList.find((m) => m.model === modelKey);
//     if (!model) return "Unknown";

//     const subModel = model.subModel.find((sm) => sm.id === subModelId);
//     return subModel?.name || "Not selected";
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>AI Model Preferences</CardTitle>
//         <CardDescription>
//           Customize your chat AI model preferences. Easily update your
//           selections anytime.
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         {AiModelList.map((model) => (
//           <div
//             key={model.model}
//             className="flex items-center justify-between p-4 border rounded-lg"
//           >
//             <div className="flex items-center gap-4 flex-1">
//               <img
//                 src={model.icon}
//                 alt={model.model}
//                 className="w-8 h-8 rounded"
//               />
//               <div className="flex-1">
//                 <Label htmlFor={model.model} className="text-base font-medium">
//                   {model.model}
//                 </Label>
//                 <p className="text-sm text-muted-foreground">
//                   {localPreferences[model.model]?.modelId
//                     ? `Selected: ${getSubModelName(
//                         model.model,
//                         localPreferences[model.model]?.modelId
//                       )}`
//                     : "No model selected"}
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-4">
//               {/* Model Selection Dropdown */}
//               <Select
//                 value={localPreferences[model.model]?.modelId || ""}
//                 onValueChange={(value) =>
//                   handleModelSelection(model.model, value)
//                 }
//               >
//                 <SelectTrigger className="w-40">
//                   <SelectValue placeholder="Select model" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <div className="p-2">
//                     <p className="text-xs font-medium text-muted-foreground mb-2">
//                       Free Models
//                     </p>
//                     {model.subModel
//                       .filter((subModel) => !subModel.premium)
//                       .map((subModel) => (
//                         <SelectItem key={subModel.id} value={subModel.id}>
//                           {subModel.name}
//                         </SelectItem>
//                       ))}
//                   </div>
//                   <div className="p-2">
//                     <p className="text-xs font-medium text-muted-foreground mb-2">
//                       Premium Models
//                     </p>
//                     {model.subModel
//                       .filter((subModel) => subModel.premium)
//                       .map((subModel) => (
//                         <SelectItem key={subModel.id} value={subModel.id}>
//                           {subModel.name} {subModel.premium && "🔒"}
//                         </SelectItem>
//                       ))}
//                   </div>
//                 </SelectContent>
//               </Select>

//               {/* Enable/Disable Switch */}
//               <div className="flex items-center gap-2">
//                 <Switch
//                   id={model.model}
//                   checked={localPreferences[model.model]?.enable || false}
//                   onCheckedChange={(checked) =>
//                     handleModelToggle(model.model, checked)
//                   }
//                 />
//                 <Label htmlFor={model.model} className="text-sm">
//                   {localPreferences[model.model]?.enable
//                     ? "Enabled"
//                     : "Disabled"}
//                 </Label>
//               </div>
//             </div>
//           </div>
//         ))}

//         <Button
//           onClick={savePreferences}
//           disabled={isSaving}
//           className="w-full"
//         >
//           <Save className="h-4 w-4 mr-2" />
//           {isSaving ? "Saving..." : "Save Preferences"}
//         </Button>
//       </CardContent>
//     </Card>
//   );
// }

// app/_components/ModelPreferences.jsx
"use client";

import { useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { AiSelectedModelContext } from "@/context/AiSelectedModelContext";
import { db } from "@/config/FirebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "react-toastify";
import AiModelList from "@/shared/AiModelList";
import { useAuth } from "@clerk/nextjs";

export function ModelPreferences() {
  const { user } = useUser();
  const { isLoaded, has } = useAuth();
  const { aiSelectedModels, setAiSelectedModels } = useContext(
    AiSelectedModelContext
  );
  const [localPreferences, setLocalPreferences] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [paidUser, setPaidUser] = useState(false);

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

  // Sync with global context
  useEffect(() => {
    if (aiSelectedModels) {
      setLocalPreferences(aiSelectedModels);
    }
  }, [aiSelectedModels]);

  const handleModelToggle = (modelKey, enabled) => {
    const updatedPreferences = {
      ...localPreferences,
      [modelKey]: {
        ...localPreferences[modelKey],
        enable: enabled,
        // If disabling, keep the modelId but set enable to false
        // If enabling and no modelId is selected, set a default one
        modelId:
          localPreferences[modelKey]?.modelId || getDefaultModelId(modelKey),
      },
    };

    setLocalPreferences(updatedPreferences);

    // Update global context immediately for real-time sync
    setAiSelectedModels(updatedPreferences);
  };

  const handleModelSelection = (modelKey, subModelId) => {
    const updatedPreferences = {
      ...localPreferences,
      [modelKey]: {
        ...localPreferences[modelKey],
        modelId: subModelId,
        enable: localPreferences[modelKey]?.enable !== false, // Enable if not explicitly false
      },
    };

    setLocalPreferences(updatedPreferences);

    // Update global context immediately for real-time sync
    setAiSelectedModels(updatedPreferences);
  };

  const getDefaultModelId = (modelKey) => {
    const model = AiModelList.find((m) => m.model === modelKey);
    if (!model) return "";

    // Get first free model as default
    const freeModel = model.subModel.find((sm) => !sm.premium);
    return freeModel?.id || model.subModel[0]?.id || "";
  };

  const savePreferencesToFirebase = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      toast.error("User not authenticated");
      return;
    }

    setIsSaving(true);
    try {
      const docRef = doc(db, "users", user.primaryEmailAddress.emailAddress);
      await updateDoc(docRef, {
        selectedModelPref: localPreferences,
        lastUpdated: new Date(),
      });

      // Context is already updated, just confirm save
      toast.success("Preferences saved successfully!");
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("Failed to save preferences");
    } finally {
      setIsSaving(false);
    }
  };

  const getSubModelName = (modelKey, subModelId) => {
    const model = AiModelList.find((m) => m.model === modelKey);
    if (!model) return "Unknown";

    const subModel = model.subModel.find((sm) => sm.id === subModelId);
    return subModel?.name || "Not selected";
  };

  const isModelPremium = (modelKey) => {
    const model = AiModelList.find((m) => m.model === modelKey);
    return model?.premium || false;
  };

  if (!isLoaded) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Model Preferences</CardTitle>
        <CardDescription>
          Customize your chat AI model preferences. Changes are applied
          immediately.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {AiModelList.map((model) => {
          const isPremiumModel = model.premium;
          const isDisabledByPlan = isPremiumModel && !paidUser;

          return (
            <div
              key={model.model}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-4 flex-1">
                <img
                  src={model.icon}
                  alt={model.model}
                  className="w-8 h-8 rounded"
                />
                <div className="flex-1">
                  <Label
                    htmlFor={model.model}
                    className="text-base font-medium"
                  >
                    {model.model}
                    {isPremiumModel && " 🔒"}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {localPreferences[model.model]?.modelId
                      ? `Selected: ${getSubModelName(
                          model.model,
                          localPreferences[model.model]?.modelId
                        )}`
                      : "No model selected"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Model Selection Dropdown */}
                <Select
                  value={localPreferences[model.model]?.modelId || ""}
                  onValueChange={(value) =>
                    handleModelSelection(model.model, value)
                  }
                  disabled={isDisabledByPlan}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2">
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Free Models
                      </p>
                      {model.subModel
                        .filter((subModel) => !subModel.premium)
                        .map((subModel) => (
                          <SelectItem key={subModel.id} value={subModel.id}>
                            {subModel.name}
                          </SelectItem>
                        ))}
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Premium Models
                      </p>
                      {model.subModel
                        .filter((subModel) => subModel.premium)
                        .map((subModel) => (
                          <SelectItem
                            key={subModel.id}
                            value={subModel.id}
                            disabled={!paidUser}
                          >
                            {subModel.name} {subModel.premium && "🔒"}
                          </SelectItem>
                        ))}
                    </div>
                  </SelectContent>
                </Select>

                {/* Enable/Disable Switch */}
                <div className="flex items-center gap-2">
                  <Switch
                    id={model.model}
                    checked={localPreferences[model.model]?.enable || false}
                    onCheckedChange={(checked) =>
                      handleModelToggle(model.model, checked)
                    }
                    disabled={isDisabledByPlan}
                  />
                  <Label htmlFor={model.model} className="text-sm">
                    {localPreferences[model.model]?.enable
                      ? "Enabled"
                      : "Disabled"}
                  </Label>
                </div>
              </div>
            </div>
          );
        })}

        <div className="flex gap-3">
          <Button
            onClick={savePreferencesToFirebase}
            disabled={isSaving}
            className="flex-1"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save to Cloud"}
          </Button>

          <Button
            variant="outline"
            onClick={() => setLocalPreferences(aiSelectedModels)}
            disabled={isSaving}
          >
            Reset Changes
          </Button>
        </div>

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Model enable/disable changes are applied
            immediately. Use "Save to Cloud" to persist your preferences across
            sessions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
