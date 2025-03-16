import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import { EEGChart } from "../components/EEGChart";
import { ChannelSelector } from "../components/ChannelSelector";
import type { EEGData, DetectedChannels } from "../types";
import { parseCSVFile } from "../../utils/csvParser";
import { parseExcelFile } from "../../utils/excelParser";
import { organizeChannels } from "../../utils/channelUtils";
import {
  Brain,
  Upload,
  Activity,
  Filter,
  Download,
  Loader2,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  XCircle,
  AudioWaveform as Waveform,
  Gauge,
  BarChart3,
  LineChart,
  Settings,
  Zap,
} from "lucide-react";

const files = Array.from(
  { length: 36 },
  (_, i) => `s${i.toString().padStart(2, "0")}`
);

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

const standardChannels = [
  "FP1",
  "FP2",
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
  "FZ",
  "CZ",
  "PZ",
];

export default function Dashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<EEGData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPresetFile, setSelectedPresetFile] = useState("s00");
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [channelGroups, setChannelGroups] = useState<DetectedChannels>({
    available: [],
    groups: [],
  });
  const [amplitudeScale, setAmplitudeScale] = useState(1);
  const [timeWindow, setTimeWindow] = useState<[number, number]>([0, 1000]);
  const [showFrequencyBands, setShowFrequencyBands] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [analysisStep, setAnalysisStep] = useState<number>(0);

  useEffect(() => {
    if (selectedPresetFile) {
      loadPresetData(selectedPresetFile);
    }
  }, [selectedPresetFile]);

  const loadPresetData = async (filename: string) => {
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
        standardChannels.forEach((channel, i) => {
          dataPoint[channel] = parseFloat(row[i]);
        });
        return dataPoint as EEGData;
      });

      setData(formattedData);
      setUploadedFileName(`${filename}.csv`);

      const organized = organizeChannels(standardChannels);
      setChannelGroups(organized);
      setSelectedChannels(organized.available);

      setTimeWindow([0, formattedData.length - 1]);
    } catch (err: any) {
      console.error("Error loading preset data:", err);
      setError(`Error loading ${filename}.csv: ${err.message}`);
      setData([]);
      setSelectedChannels([]);
      setChannelGroups({ available: [], groups: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setLoading(true);
    setError(null);
    setUploadedFileName(file.name);
    setSelectedFile(file);
    setSelectedPresetFile("");

    try {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      let parsedData: EEGData[];

      if (fileExtension === "xlsx" || fileExtension === "xls") {
        parsedData = await parseExcelFile(file);
      } else if (fileExtension === "csv") {
        parsedData = await parseCSVFile(file);
      } else {
        throw new Error(
          "Unsupported file format. Please upload a CSV or Excel file."
        );
      }

      if (parsedData.length === 0) {
        throw new Error("No valid data found in the file");
      }

      setData(parsedData);

      const availableChannels = Object.keys(parsedData[0])
        .filter((key) => key !== "timestamp")
        .map((channel) => channel.toUpperCase());

      const organized = organizeChannels(availableChannels);
      setChannelGroups(organized);
      setSelectedChannels(organized.available);

      const lastTimestamp = parsedData[parsedData.length - 1].timestamp;
      setTimeWindow([0, lastTimestamp]);
    } catch (error: any) {
      console.error("Error reading file:", error);
      setError(error.message || "Failed to read the file");
      setData([]);
      setSelectedChannels([]);
      setChannelGroups({ available: [], groups: [] });
      setSelectedFile(null);
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const toggleChannel = (channel: string) => {
    setSelectedChannels((prev) =>
      prev.includes(channel)
        ? prev.filter((ch) => ch !== channel)
        : [...prev, channel]
    );
  };

  const handleAnalyze = async () => {
    if ((!selectedFile && !selectedPresetFile) || !data.length) {
      setError("Please upload or select a file first");
      return;
    }

    setAnalyzing(true);
    setAnalysisStatus("loading");
    setAnalysisStep(0);
    setError(null);

    try {
      let response;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const headers = ["timestamp", ...selectedChannels];
        const csvRows = [headers.join(",")];

        data.forEach((row) => {
          const rowValues = headers.map((header) =>
            header === "timestamp" ? row.timestamp : row[header] || ""
          );
          csvRows.push(rowValues.join(","));
        });

        const processedContent = csvRows.join("\n");
        const processedFile = new File([processedContent], selectedFile.name, {
          type: "text/csv",
        });
        formData.append("processed_file", processedFile);

        response = await fetch(
          "https://web-production-6e93.up.railway.app/upload-and-analyze-eeg",
          {
            method: "POST",
            body: formData,
          }
        );
      } else {
        const filename = `${selectedPresetFile}.csv`;
        response = await fetch(
          "https://web-production-6e93.up.railway.app/analyze-eeg",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              filename: filename,
              preset_file: filename,
              selected_channels: selectedChannels,
            }),
          }
        );
      }

      const progressInterval = setInterval(() => {
        setAnalysisStep((prev) =>
          prev < analysisSteps.length - 1 ? prev + 1 : prev
        );
      }, 2000);

      if (!response.ok) {
        const errorData = await response.json(); // Parse the error response
        clearInterval(progressInterval);
        navigate("/report", {
          state: {
            error: errorData.error || "Failed to analyze EEG data", // Pass the error message
            files: null, // Explicitly set files to null
          },
        });
        return;
      }

      clearInterval(progressInterval);

      const result = await response.json();
      setAnalysisStatus("success");

      setTimeout(() => {
        navigate("/report", {
          state: {
            files: result.files, // Pass the files
            originalFileName: selectedFile
              ? selectedFile.name
              : `${selectedPresetFile}.csv`,
          },
        });
      }, 1500);
    } catch (error: any) {
      console.error("Error:", error);
      navigate("/report", {
        state: {
          error: error.message || "Failed to analyze the data", // Pass the error message
          files: null, // Explicitly set files to null
        },
      });
    } finally {
      setAnalyzing(false);
    }
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
                value={selectedPresetFile}
                onChange={(e) => setSelectedPresetFile(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="">Choose a preset file...</option>
                {files.map((file) => (
                  <option key={file} value={file}>
                    Subject {file.substring(1)}
                  </option>
                ))}
              </select>
              <label
                htmlFor="eeg-file-upload"
                className="flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-md hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                Upload EEG File
              </label>
              <input
                id="eeg-file-upload"
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".csv,.xlsx,.xls"
                className="hidden"
              />
              <button
                onClick={handleAnalyze}
                disabled={loading || analyzing || !data.length}
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
            </div>
          </div>

          {/* Analysis Tools */}
          <div className="mt-4 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Amplitude Scale:</label>
              <input
                type="range"
                min="0.1"
                max="10"
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            EEG Channels
          </h2>
          <ChannelSelector
            groups={channelGroups.groups}
            selectedChannels={selectedChannels}
            onToggleChannel={toggleChannel}
          />
        </div>

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
                onClick={() => loadPresetData(selectedPresetFile)}
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
                  {[...Array(9)].map((_, i) => (
                    <span key={i}>{i * 1000}ms</span>
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
