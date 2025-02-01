import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { EEGChart } from "../components/EEGChart";
import type { EEGData } from "../types";
import {
  Brain,
  LineChart,
  Loader2,
  Filter,
  Activity,
  Download,
  AudioWaveform as Waveform,
  Gauge,
  BarChart3,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState("s00");
  const [data, setData] = useState<EEGData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [selectedChannels, setSelectedChannels] = useState<string[]>(channels);
  const [timeWindow, setTimeWindow] = useState<[number, number]>([0, 1000]);
  const [amplitudeScale, setAmplitudeScale] = useState(1);
  const [showFrequencyBands, setShowFrequencyBands] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<number>(0);

  const analysisSteps = [
    {
      title: "Time Features",
      description: "Calculating temporal characteristics and patterns",
      icon: <Waveform className="w-5 h-5" />,
    },
    {
      title: "Frequency Features",
      description: "Analyzing frequency bands and spectral properties",
      icon: <Gauge className="w-5 h-5" />,
    },
    {
      title: "Advanced Features",
      description: "Extracting complex neural patterns",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      title: "Visualizations",
      description: "Generating comprehensive visual representations",
      icon: <LineChart className="w-5 h-5" />,
    },
    {
      title: "Report",
      description: "Compiling analysis results and insights",
      icon: <FileSpreadsheet className="w-5 h-5" />,
    },
  ];

  useEffect(() => {
    loadData(selectedFile);
  }, [selectedFile]);

  const loadData = async (filename: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/data/${filename}.csv`);
      if (!response.ok) throw new Error(`Failed to load ${filename}.csv`);

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

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setAnalysisStatus("loading");
    setAnalysisStep(0);

    try {
      const filename = `${selectedFile}.csv`;
      const requestBody = JSON.stringify({ filename });

      // Simulate progress through analysis steps
      const progressInterval = setInterval(() => {
        setAnalysisStep((prev) =>
          prev < analysisSteps.length - 1 ? prev + 1 : prev
        );
      }, 2000);

      const response = await fetch(
        "https://eeg-analyzer-production.up.railway.app/analyze-eeg",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: requestBody,
        }
      );

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorResponse = await response.text();
        console.error("API error response:", errorResponse);
        throw new Error("Failed to analyze EEG data");
      }

      const result = await response.json();
      setAnalysisStatus("success");

      // Show success message briefly before navigating
      setTimeout(() => {
        navigate("/report", { state: { files: result.files } });
      }, 1500);
    } catch (err) {
      console.error("Error analyzing EEG data:", err);
      setAnalysisStatus("error");
      setTimeout(() => {
        setAnalysisStatus("idle");
        setAnalyzing(false);
      }, 3000);
    }
  };

  const handleExportData = () => {
    if (data.length === 0) {
      alert("No data to export.");
      return;
    }

    const csv = Papa.unparse(data, {
      quotes: true,
      delimiter: ",",
      header: true,
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${selectedFile}_export.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                className="flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
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
              <button
                onClick={handleExportData}
                className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 transition-colors"
              >
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
                className={`px-2 py-1 text-xs rounded transition-all ${
                  selectedChannels.includes(channel)
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
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
              <AlertCircle className="w-12 h-12 mx-auto mb-4" />
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

      {/* Analysis Progress Modal */}
      {analyzing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-md w-full mx-4 overflow-hidden shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-center mb-6">
                {analysisStatus === "loading" && (
                  <Brain className="w-12 h-12 text-blue-600 animate-pulse" />
                )}
                {analysisStatus === "success" && (
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                )}
                {analysisStatus === "error" && (
                  <XCircle className="w-12 h-12 text-red-500" />
                )}
              </div>

              <h3 className="text-xl font-semibold text-center text-gray-900 mb-2">
                {analysisStatus === "loading" && "Analyzing EEG Data"}
                {analysisStatus === "success" && "Analysis Complete"}
                {analysisStatus === "error" && "Analysis Failed"}
              </h3>

              <p className="text-sm text-center text-gray-600 mb-8">
                {analysisStatus === "loading" &&
                  "Please wait while we process your EEG data"}
                {analysisStatus === "success" && "Redirecting to results..."}
                {analysisStatus === "error" && "Please try again later"}
              </p>

              {analysisStatus === "loading" && (
                <div className="space-y-4">
                  {analysisSteps.map((step, index) => (
                    <div
                      key={step.title}
                      className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-300 ${
                        index === analysisStep
                          ? "bg-blue-50 scale-105"
                          : index < analysisStep
                          ? "opacity-50"
                          : "opacity-30"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          index === analysisStep
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {step.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {step.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {step.description}
                        </p>
                      </div>
                      {index === analysisStep && (
                        <div className="ml-auto">
                          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
