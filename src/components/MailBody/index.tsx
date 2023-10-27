import React, { useState } from "react";
import { Card } from "@/components/Card";

interface MailBodyProps {
  description: string;
  timestamp: string;
  isReply?: boolean;
}

const MailBody: React.FC<MailBodyProps> = ({
  description,
  timestamp,
  isReply = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="max-h-screen overflow-y-auto hover:cursor-pointer">
      <div className="text-right text-gray-500 p-2">{timestamp}</div>

      <Card
        className={`${
          isExpanded
            ? "h-auto whitespace-pre-line"
            : "h-14 truncate overflow-ellipsis"
        }`}
      >
        <div className="relative">
          {isReply && (
            <div className="absolute left-0 h-full w-1 bg-green-500" />
          )}
          <div
            className="text-1xl text-white break-words p-4 overflow-hidden text-ellipsis"
            onClick={toggleExpansion}
          >
            {description}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MailBody;
