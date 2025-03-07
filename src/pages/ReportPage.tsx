import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FileDown,
  Eye,
  AlertCircle,
  Download,
  ChevronLeft,
  X,
  Brain,
  Image as ImageIcon,
  FileText,
  ArrowLeft,
} from "lucide-react";

interface ReportFiles {
  [key: string]: string;
}

const ReportPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const files = location.state?.files as ReportFiles | undefined;
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!files || Object.keys(files).length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            No Analysis Results
          </h2>
          <p className="text-gray-600 mb-6">
            Please upload your EEG data file and run the analysis first.
          </p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Analysis
          </button>
        </div>
      </div>
    );
  }

  const baseUrl = "https://web-production-6e93.up.railway.app";

  const getValidImageUrl = (url: string) => {
    if (url.startsWith("/")) {
      return `${baseUrl}${url}`;
    }
    return url;
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      setLoading(true);
      const response = await fetch(getValidImageUrl(url));
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Group files by category
  const groupedFiles = Object.entries(files).reduce((acc, [name, url]) => {
    let category = "Other";
    if (name.includes("autism")) category = "Autism Analysis";
    else if (name.includes("epilepsy")) category = "Epilepsy Analysis";
    else if (name.includes("hjorth")) category = "Hjorth Parameters";
    else if (name.includes("eeg_")) category = "EEG Analysis";
    else if (name.includes("band_power")) category = "Band Power";
    else if (name.includes("topographic")) category = "Topographic Maps";
    else if (name.includes("entropy")) category = "Entropy Analysis";

    if (!acc[category]) acc[category] = [];
    acc[category].push({ name, url });
    return acc;
  }, {} as Record<string, { name: string; url: string }[]>);

  const mainReport = Object.entries(files).find(([name]) =>
    name.toLowerCase().includes("eeg_analysis_report")
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/")}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Back to Analysis"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  EEG Analysis Report
                </h1>
                <p className="text-gray-600 text-sm">
                  Comprehensive analysis results and visualizations
                </p>
              </div>
            </div>
            {mainReport && (
              <button
                onClick={() => handleDownload(mainReport[1], mainReport[0])}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md disabled:opacity-50"
              >
                <FileText className="w-5 h-5" />
                <span>Download Full Report</span>
                {loading && <span className="animate-spin">⏳</span>}
              </button>
            )}
          </div>
        </div>

        {/* Results Grid */}
        <div className="space-y-8">
          {Object.entries(groupedFiles).map(([category, items]) => (
            <div
              key={category}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">
                  {category}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {items.map(({ name, url }) => {
                  if (name.includes("eeg_analysis_report")) return null;
                  const imageUrl = getValidImageUrl(url);

                  return (
                    <div
                      key={name}
                      className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                      <div className="relative aspect-video bg-gray-50">
                        <img
                          src={imageUrl}
                          alt={name}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                          <button
                            onClick={() => setSelectedFile(imageUrl)}
                            className="p-2 bg-white rounded-full hover:bg-blue-50 transition-colors"
                            title="Preview"
                          >
                            <Eye className="w-5 h-5 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDownload(url, name)}
                            className="p-2 bg-white rounded-full hover:bg-blue-50 transition-colors"
                            title="Download"
                            disabled={loading}
                          >
                            <Download className="w-5 h-5 text-blue-600" />
                          </button>
                        </div>
                      </div>
                      <div className="p-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <ImageIcon className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">
                              {name
                                .replace(/\.[^/.]+$/, "")
                                .split("_")
                                .join(" ")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      {selectedFile && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedFile(null)}
        >
          <div
            className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Analysis Result
              </h3>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative bg-gray-50">
              <img
                src={selectedFile}
                alt="Preview"
                className="max-w-full h-auto mx-auto"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportPage;
