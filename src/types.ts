export interface EEGData {
  timestamp: number;
  [channel: string]: number;
}

export interface ChannelGroup {
  name: string;
  channels: string[];
}

export interface DetectedChannels {
  available: string[];
  groups: ChannelGroup[];
}

export const CHANNEL_MAPPINGS: { [key: string]: string } = {
  // Frontal
  FP1: "Frontal",
  FP2: "Frontal",
  F3: "Frontal",
  F4: "Frontal",
  F7: "Frontal",
  F8: "Frontal",
  FZ: "Frontal",

  // Central
  C3: "Central",
  C4: "Central",
  CZ: "Central",

  // Temporal
  T3: "Temporal",
  T4: "Temporal",
  T5: "Temporal",
  T6: "Temporal",
  T7: "Temporal",
  T8: "Temporal",

  // Parietal
  P3: "Parietal",
  P4: "Parietal",
  P7: "Parietal",
  P8: "Parietal",
  PZ: "Parietal",

  // Occipital
  O1: "Occipital",
  O2: "Occipital",
};
