import React from "react";
import type { ChannelGroup } from "../types";
import { Brain } from "lucide-react";

interface ChannelSelectorProps {
  groups: ChannelGroup[];
  selectedChannels: string[];
  onToggleChannel: (channel: string) => void;
}

export const ChannelSelector: React.FC<ChannelSelectorProps> = ({
  groups,
  selectedChannels,
  onToggleChannel,
}) => {
  if (groups.length === 0) {
    return (
      <div className="flex items-center justify-center py-4 text-gray-500">
        <Brain className="w-5 h-5 mr-2" />
        <span>No channels detected</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.name} className="mb-2">
          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
            {group.name}
            <span className="text-xs text-gray-500 ml-2">
              ({group.channels.length})
            </span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {group.channels.map((channel) => (
              <button
                key={channel}
                onClick={() => onToggleChannel(channel)}
                className={`px-3 py-1.5 text-xs rounded-full transition-all ${
                  selectedChannels.includes(channel)
                    ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {channel}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
