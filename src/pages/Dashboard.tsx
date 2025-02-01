import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { EEGChart } from "../components/EEGChart";
import type { EEGData } from "../types";
import {
  Brain,
  LineChart,
  Loader2,
  ChevronRight,
  Filter,
  ZoomIn,
  Activity,
  Download,
} from "lucide-react";

const channels = [
  "Fp1",
  "Fp2",
  "F3",
  "F4",
  "F7",
  "F8",
  "T3",
  "T4",
  "C3",
  "C4",
  "T5",
  "T6",
  "P3",
  "P4",
  "O1",
  "O2",
  "Fz",
  "Cz",
  "Pz",
];

const files = Array.from(
  { length: 36 },
  (_, i) => `s${i.toString().padStart(2, "0")}`
);

const frequencyBands = [
  { name: "Delta", range: "0.5-4 Hz", color: "blue" },
  { name: "Theta", range: "4-8 Hz", color: "green" },
  { name: "Alpha", range: "8-13 Hz", color: "yellow" },
  { name: "Beta", range: "13-30 Hz", color: "red" },
  { name: "Gamma", range: ">30 Hz", color: "purple" },
];

export default function Dashboard({
  onViewReport,
}: {
  onViewReport: (id: string) => void;
}) {
  const [selectedFile, setSelectedFile] = useState("s00");
  const [data, setData] = useState<EEGData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedChannels, setSelectedChannels] = useState<string[]>(channels);
  const [timeWindow, setTimeWindow] = useState<[number, number]>([0, 1000]);
  const [amplitudeScale, setAmplitudeScale] = useState(1);
  const [showFrequencyBands, setShowFrequencyBands] = useState(false);

  const loadData = async (filename: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/src/data/${filename}.csv`);
      if (!response.ok) {
        throw new Error(`Failed to load ${filename}.csv`);
      }
      const csvText = await response.text();

      const parsedData = Papa.parse(csvText, {
        delimiter: ",",
        skipEmptyLines: true,
      }).data as string[][];

      const formattedData: EEGData[] = parsedData.map((row, index) => {
        const dataPoint: any = { timestamp: index };
        channels.forEach((channel, i) => {
          dataPoint[channel] = parseFloat(row[i]);
        });
        return dataPoint as EEGData;
      });

      setData(formattedData);
    } catch (err) {
      setError(
        `Error loading ${filename}.csv. Please check if the file exists and is accessible.`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(selectedFile);
  }, [selectedFile]);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => setAnalyzing(false), 1000);
  };

  const toggleChannel = (channel: string) => {
    setSelectedChannels((prev) =>
      prev.includes(channel)
        ? prev.filter((ch) => ch !== channel)
        : [...prev, channel]
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-800">
                EEG Signal Analysis
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={selectedFile}
                onChange={(e) => setSelectedFile(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                {files.map((file) => (
                  <option key={file} value={file}>
                    Subject {file.substring(1)}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAnalyze}
                disabled={loading || analyzing}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Activity className="w-4 h-4" />
                {analyzing ? "Analyzing..." : "Analyze"}
              </button>
              <button
                onClick={() => setShowFrequencyBands(!showFrequencyBands)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Frequency Bands
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                Export Data
              </button>
            </div>
          </div>

          {/* Analysis Tools */}
          <div className="mt-4 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Amplitude Scale:</label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={amplitudeScale}
                onChange={(e) => setAmplitudeScale(parseFloat(e.target.value))}
                className="w-32"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Time Window:</label>
              <input
                type="number"
                value={timeWindow[0]}
                onChange={(e) =>
                  setTimeWindow([parseInt(e.target.value), timeWindow[1]])
                }
                className="w-20 px-2 py-1 border rounded"
              />
              <span>-</span>
              <input
                type="number"
                value={timeWindow[1]}
                onChange={(e) =>
                  setTimeWindow([timeWindow[0], parseInt(e.target.value)])
                }
                className="w-20 px-2 py-1 border rounded"
              />
              <span className="text-sm text-gray-600">ms</span>
            </div>
          </div>
        </div>

        {/* Channel Selection */}
        <div className="px-6 py-3 border-b bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {channels.map((channel) => (
              <button
                key={channel}
                onClick={() => toggleChannel(channel)}
                className={`px-2 py-1 text-xs rounded ${
                  selectedChannels.includes(channel)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {channel}
              </button>
            ))}
          </div>
        </div>

        {/* Frequency Bands Legend */}
        {showFrequencyBands && (
          <div className="px-6 py-3 border-b bg-gray-50">
            <div className="flex items-center gap-6">
              {frequencyBands.map((band) => (
                <div key={band.name} className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full bg-${band.color}-500`}
                  />
                  <span className="text-sm text-gray-600">{band.name}</span>
                  <span className="text-xs text-gray-400">({band.range})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EEG Charts */}
        <div className="p-4 relative">
          {loading ? (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
                <p className="text-gray-600">Loading data...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">
              <Brain className="w-12 h-12 mx-auto mb-4" />
              <p>{error}</p>
              <button
                onClick={() => loadData(selectedFile)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              {selectedChannels.map((channel, index) => (
                <EEGChart
                  key={channel}
                  data={data}
                  channel={channel}
                  index={index}
                  amplitudeScale={amplitudeScale}
                  timeWindow={timeWindow}
                  showFrequencyBands={showFrequencyBands}
                />
              ))}
              <div className="h-6 relative border-t mt-2">
                <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 text-xs text-gray-500">
                  {[...Array(6)].map((_, i) => (
                    <span key={i}>{i * 200}ms</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
