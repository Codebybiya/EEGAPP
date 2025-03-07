import { DetectedChannels, CHANNEL_MAPPINGS } from "../src/types";

export function organizeChannels(channels: string[]): DetectedChannels {
  const groupedChannels: { [key: string]: string[] } = {};

  // Group channels by region
  channels.forEach((channel) => {
    const upperChannel = channel.toUpperCase();
    const region = CHANNEL_MAPPINGS[upperChannel] || "Other";

    if (!groupedChannels[region]) {
      groupedChannels[region] = [];
    }
    groupedChannels[region].push(upperChannel);
  });

  // Sort channels within each group
  Object.keys(groupedChannels).forEach((region) => {
    groupedChannels[region].sort();
  });

  // Create groups array with standard order
  const standardOrder = [
    "Frontal",
    "Central",
    "Temporal",
    "Parietal",
    "Occipital",
    "Other",
  ];
  const groups = standardOrder
    .filter((region) => groupedChannels[region]?.length > 0)
    .map((region) => ({
      name: region,
      channels: groupedChannels[region],
    }));

  return {
    available: channels.map((ch) => ch.toUpperCase()),
    groups,
  };
}
