import React from "react";
import { Calendar, Activity, FileText, ArrowRight, Brain } from "lucide-react";

export default function Home() {
  function onNavigate(page: string): void {
    switch (page) {
      case "dashboard":
        window.location.href = "/dashboard";
        break;
      case "learn-more":
        window.location.href = "/learn-more";
        break;
      case "upload":
        window.location.href = "/upload";
        break;
      case "reports":
        window.location.href = "/reports";
        break;
      default:
        console.error("Unknown navigation target:", page);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full">
              <span className="text-blue-600 text-sm font-medium">
                Welcome to NeuroAnalyzer
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Analyze EEG Data with Precision
            </h1>

            <p className="text-lg text-gray-600">
              Advanced EEG diagnostics powered by AI technology. Upload your EEG
              data, analyze brainwave patterns, and generate detailed reports in
              minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onNavigate("dashboard")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Analyze EEG Data
              </button>
              <button
                onClick={() => onNavigate("#")}
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-all"
              >
                Learn More
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-blue-100 rounded-full filter blur-3xl opacity-30"></div>
            <img
              src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80"
              alt="EEG Analysis"
              className="relative rounded-3xl shadow-2xl w-full object-cover"
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {/* Feature 1: Upload EEG Data */}
          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Upload EEG Data
            </h3>
            <p className="text-gray-600 mb-4">
              Easily upload your EEG files in various formats for analysis.
            </p>
            <button
              onClick={() => onNavigate("upload")}
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              Upload Now →
            </button>
          </div>

          {/* Feature 2: Generate Reports */}
          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Generate Reports
            </h3>
            <p className="text-gray-600 mb-4">
              Get detailed reports with insights into brainwave patterns and
              anomalies.
            </p>
            <button
              onClick={() => onNavigate("reports")}
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              View Reports →
            </button>
          </div>

          {/* Feature 3: Expert Analysis */}
          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Expert Analysis
            </h3>
            <p className="text-gray-600 mb-4">
              Our AI-powered tools and neurologists provide accurate and
              actionable insights.
            </p>
            <button
              onClick={() => onNavigate("learn-more")}
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              Learn More →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
