import React from "react";
import type { ChannelGroup } from "../types";
import { Brain, Activity } from "lucide-react";

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
      <div className="flex items-center justify-center py-8 text-gray-500">
        <Brain className="w-6 h-6 mr-3 text-gray-400" />
        <span className="text-sm">No channels detected</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.name} className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
            <h3 className="text-sm font-medium text-gray-800">
              {group.name}
              <span className="ml-2 text-xs text-gray-500">
                ({group.channels.length})
              </span>
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {group.channels.map((channel) => {
              const isSelected = selectedChannels.includes(channel);
              return (
                <button
                  key={channel}
                  onClick={() => onToggleChannel(channel)}
                  className={`
                    relative group px-4 py-2 text-xs rounded-lg transition-all duration-300
                    ${
                      isSelected
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }
                  `}
                >
                  <div className="flex items-center gap-1.5">
                    <Activity
                      className={`w-3 h-3 ${
                        isSelected ? "text-white" : "text-gray-500"
                      }`}
                    />
                    {channel}
                  </div>
                  {isSelected && (
                    <div className="absolute inset-0 rounded-lg bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
