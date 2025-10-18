// "use client";
// import AiModelList from "@/shared/AiModelList";
// import Image from "next/image";
// import React, { use, useContext, useState } from "react";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
// import { Loader, Loader2, Lock, MessageSquare } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { AiSelectedModelContext } from "@/context/AiSelectedModelContext";
// import { doc, updateDoc } from "firebase/firestore";
// import { db } from "@/config/FirebaseConfig";
// import { useUser } from "@clerk/nextjs";
// import Markdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import { useSearchParams } from "next/navigation";

// function AiMultiModels() {
//   const { user } = useUser();
//   const [aiModelList, setAimodelList] = useState(AiModelList);
//   const { aiSelectedModels, setAiSelectedModels, messages, setMessages } =
//     useContext(AiSelectedModelContext);



//   const onToggleChange = (model, value) => {
//     setAimodelList((prev) =>
//       prev.map((m) => (m.model == model ? { ...m, enable: value } : m))
//     );
//     setAiSelectedModels((prev) => ({
//       ...prev,
//       [model]: {
//         ...(prev?.[model] ?? {}),
//         enable: value,
//       },
//     }));
//   };
//   console.log(aiSelectedModels);

//   const onSelectedValue = async (parentModel, value) => {
//     setAiSelectedModels((prev) => ({
//       ...prev,
//       [parentModel]: { modelId: value },
//     }));

//     //update to FireBase database
//     const docRef = doc(db, "users", user?.primaryEmailAddress?.emailAddress);
//     await updateDoc(docRef, {
//       selectedModelPref: aiSelectedModels,
//     });
//   };

//   return (
//     <div className="flex flex-1 h-[75vh] border-b">
//       {aiModelList.map((model, index) => (
//         <div
//           key={index}
//           className={`flex flex-col border-r h-full overflow-auto  ${
//             model.enable ? "flex-1 min-w-[400px]" : "w-[100px] flex-none  "
//           }`}
//         >
//           <div
//             key={index}
//             className="flex w-full h-[70px] items-center justify-between border-b p-4"
//           >
//             <div className="flex items-center gap-4">
//               <Image
//                 src={model.icon}
//                 alt={model.model}
//                 width={24}
//                 height={24}
//               />
//               {model.enable && (
//                 <Select
//                   defaultValue={aiSelectedModels?.[model?.model]?.modelId}
//                   onValueChange={(value) => onSelectedValue(model.model, value)}
//                   disabled={model.premium}
//                 >
//                   <SelectTrigger className="w-[180px]">
//                     <SelectValue
//                       placeholder={aiSelectedModels?.[model?.model]?.modelId}
//                     />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectGroup>
//                       <SelectLabel>Free</SelectLabel>
//                       {model.subModel.map(
//                         (subModel, index) =>
//                           subModel.premium == false && (
//                             <SelectItem key={index} value={subModel.id}>
//                               {subModel.name}
//                             </SelectItem>
//                           )
//                       )}
//                     </SelectGroup>
//                     <SelectGroup>
//                       <SelectLabel>Premium</SelectLabel>
//                       {model.subModel.map(
//                         (subModel, index) =>
//                           subModel.premium == true && (
//                             <SelectItem
//                               key={index}
//                               value={subModel.id}
//                               disabled={subModel.premium}
//                             >
//                               {subModel.name}
//                               {subModel.premium && <Lock className="h-4 w-4" />}
//                             </SelectItem>
//                           )
//                       )}
//                     </SelectGroup>
//                   </SelectContent>
//                 </Select>
//               )}
//             </div>
//             <div>
//               {model.enable ? (
//                 <Switch
//                   checked={model.enable}
//                   onCheckedChange={(v) => onToggleChange(model.model, v)}
//                 />
//               ) : (
//                 <MessageSquare
//                   onClick={() => onToggleChange(model.model, true)}
//                 />
//               )}
//             </div>
//           </div>
//           {model.premium && model.enable && (
//             <div className="flex items-center justify-center h-full">
//               <Button>
//                 <Lock />
//                 Upgrade to unlock
//               </Button>
//             </div>
//           )}
//           {model.enable && (
//             <div className="flex-1 p-4">
//               <div className="flex-1 p-4 space-y-2">
//                 {messages[model.model]?.map((m, i) => (
//                   <div
//                     key={i}
//                     className={`p-2 rounded-md ${
//                       m.role == "user"
//                         ? "bg-blue-100 text-blue-900"
//                         : "bg-gray-100 text-gray-900"
//                     }`}
//                   >
//                     {m.role == "assistant" && (
//                       <span className="text-sm text-gray-400">
//                         {m.model ?? model.model}
//                       </span>
//                     )}
//                     <div className="flex gap-3 items-center">
//                       {m.content == "loading" && (
//                         <>
//                           <Loader className="h-5 w-5 animate-spin text-gray-500" />
//                           <span>Thinking...</span>
//                         </>
//                       )}
//                       {m.content !== "loading" && (
//                         <Markdown remarkPlugins={[remarkGfm]}>
//                           {m.content}
//                         </Markdown>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }

// export default AiMultiModels;



"use client";
import AiModelList from "@/shared/AiModelList";
import Image from "next/image";
import React, { useContext, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader, Lock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AiSelectedModelContext } from "@/context/AiSelectedModelContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import { useUser } from "@clerk/nextjs";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

function AiMultiModels() {
  const { user } = useUser();
  const [aiModelList, setAimodelList] = useState(AiModelList);
  const { aiSelectedModels, setAiSelectedModels, messages } =
    useContext(AiSelectedModelContext);

  // ✅ Toggle model enable/disable
  const onToggleChange = (model, value) => {
    setAimodelList((prev) =>
      prev.map((m) => (m.model === model ? { ...m, enable: value } : m))
    );

    setAiSelectedModels((prev) => ({
      ...prev,
      [model]: {
        ...(prev?.[model] ?? {}),
        enable: value,
      },
    }));
  };

  // ✅ Update selected model + Firestore without stale state
  const onSelectedValue = (parentModel, value) => {
    setAiSelectedModels((prev) => {
      const updated = {
        ...prev,
        [parentModel]: { ...(prev?.[parentModel] ?? {}), modelId: value },
      };

      // update Firestore after state change
      const docRef = doc(db, "users", user?.primaryEmailAddress?.emailAddress);
      updateDoc(docRef, { selectedModelPref: updated });

      return updated;
    });
  };

  return (
    <div className="flex flex-1 h-[75vh] border-b overflow-hidden">
      {aiModelList.map((model, index) => (
        <div
          key={index}
          className={`flex flex-col border-r h-full ${
            model.enable ? "flex-1 min-w-[400px]" : "w-[100px] flex-none"
          }`}
        >
          {/* Header */}
          <div className="flex w-full h-[70px] items-center justify-between border-b p-4">
            <div className="flex items-center gap-4">
              <Image
                src={model.icon}
                alt={model.model}
                width={24}
                height={24}
              />
              {model.enable && (
                <Select
                  value={aiSelectedModels?.[model.model]?.modelId || ""}
                  onValueChange={(value) => onSelectedValue(model.model, value)}
                  disabled={model.premium}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue
                      placeholder={
                        aiSelectedModels?.[model.model]?.modelId || "Select model"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Free</SelectLabel>
                      {model.subModel.map(
                        (subModel, i) =>
                          !subModel.premium && (
                            <SelectItem key={i} value={subModel.id}>
                              {subModel.name}
                            </SelectItem>
                          )
                      )}
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Premium</SelectLabel>
                      {model.subModel.map(
                        (subModel, i) =>
                          subModel.premium && (
                            <SelectItem
                              key={i}
                              value={subModel.id}
                              disabled={true}
                            >
                              {subModel.name}
                              <Lock className="h-4 w-4 ml-2 inline-block" />
                            </SelectItem>
                          )
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Toggle */}
            <div>
              {model.enable ? (
                <Switch
                  checked={model.enable}
                  onCheckedChange={(v) => onToggleChange(model.model, v)}
                />
              ) : (
                <MessageSquare
                  onClick={() => onToggleChange(model.model, true)}
                  className="cursor-pointer text-gray-500 hover:text-gray-800"
                />
              )}
            </div>
          </div>

          {/* Body */}
          {model.premium && model.enable ? (
            <div className="flex items-center justify-center h-full">
              <Button>
                <Lock className="mr-2" /> Upgrade to unlock
              </Button>
            </div>
          ) : (
            model.enable && (
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages?.[model.model]?.map((m, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-md ${
                      m.role === "user"
                        ? "bg-blue-100 text-blue-900"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {m.role === "assistant" && (
                      <span className="text-sm text-gray-400 block mb-1">
                        {m.model ?? model.model}
                      </span>
                    )}

                    <div className="flex gap-3 items-start">
                      {m.content === "loading" ? (
                        <>
                          <Loader className="h-5 w-5 animate-spin text-gray-500" />
                          <span>Thinking...</span>
                        </>
                      ) : (
<div className="prose prose-sm max-w-none break-words whitespace-pre-wrap">
  <Markdown remarkPlugins={[remarkGfm]}>{m.content}</Markdown>
</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      ))}
    </div>
  );
}

export default AiMultiModels;
