import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  FileDown,
  Eye,
  AlertCircle,
  Download,
  FileText,
  Image as ImageIcon,
  ChevronLeft,
  X,
  FileOutput,
  Brain,
} from "lucide-react";

const ReportPage: React.FC = () => {
  const location = useLocation();
  const files = location.state?.files as { [key: string]: string } | undefined;
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // If no files are found, display a message
  if (!files || Object.keys(files).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          No Files Found
        </h2>
        <p className="text-gray-500 mb-6">
          Please try uploading your files again.
        </p>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Go Back
        </button>
      </div>
    );
  }

  // Base URL of your backend server
  const baseUrl = "https://eeg-analyzer-production.up.railway.app";

  // Function to handle image URLs
  const getValidImageUrl = (url: string) => {
    if (url.startsWith("/")) {
      return `${baseUrl}${url}`;
    }
    return url.startsWith("http") ? url : "/placeholder.png";
  };

  // Function to handle file download
  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Find the main PDF report if it exists
  const mainReport = Object.entries(files).find(([name]) =>
    name.toLowerCase().includes("eeg_analysis_report")
  );

  // Filter out the main PDF report from the files to display in the grid
  const displayFiles = Object.entries(files).filter(
    ([name]) => !name.toLowerCase().includes("eeg_analysis_report")
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Header with Download Button */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                EEG Analysis Report
              </h1>
              <p className="text-gray-600">
                Analysis results and generated visualizations
              </p>
            </div>
            {mainReport && (
              <div className="flex-shrink-0">
                <button
                  onClick={() =>
                    handleDownload(
                      getValidImageUrl(mainReport[1]),
                      mainReport[0]
                    )
                  }
                  className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <Brain className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span className="font-medium">Download Full Report</span>
                  <FileOutput className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  <span className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            )}
          </div>
          <div className="h-px bg-gradient-to-r from-blue-100 via-indigo-100 to-blue-100" />
        </div>

        {/* File Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayFiles.map(([name, url]) => {
            const imageUrl = getValidImageUrl(url);

            return (
              <div
                key={name}
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {/* Preview Area */}
                <div className="relative aspect-video bg-gray-50 flex items-center justify-center">
                  <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.png";
                    }}
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button
                      onClick={() => setSelectedFile(imageUrl)}
                      className="p-2 bg-white rounded-full hover:bg-blue-50 transition-colors"
                      title="Preview"
                    >
                      <Eye className="w-5 h-5 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDownload(imageUrl, name)}
                      className="p-2 bg-white rounded-full hover:bg-blue-50 transition-colors"
                      title="Download"
                    >
                      <Download className="w-5 h-5 text-blue-600" />
                    </button>
                  </div>
                </div>

                {/* File Info */}
                <div className="p-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ImageIcon className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {name.length > 20
                          ? `${name.substring(0, 20)}...`
                          : name}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDownload(imageUrl, name)}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <FileDown className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* File Preview Modal */}
      {selectedFile && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedFile(null)}
        >
          <div
            className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                File Preview
              </h3>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <img
                src={selectedFile}
                alt="Preview"
                className="max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportPage;
