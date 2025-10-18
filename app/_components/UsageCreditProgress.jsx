

import { Progress } from "@/components/ui/progress";
import React from "react";

function UsageCreditProgress({ remainingToken }) {
  const maxMessages = 5;
  const used = maxMessages - remainingToken;
  const percentage = (used / maxMessages) * 100;

  return (
    <div className="p-3 border rounded-2xl mb-5 flex flex-col gap-2">
      <h2 className="font-bold text-xl">Free Plan</h2>
      <p className="text-gray-400">
        {used}/{maxMessages} messages used
      </p>
      <Progress value={percentage} />
    </div>
  );
}

export default UsageCreditProgress;
