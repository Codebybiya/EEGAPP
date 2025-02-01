import React from "react";
import {
  Calendar,
  Activity,
  FileText,
  ArrowRight,
  Brain,
  ChevronRight,
  Star,
  Users,
  Shield,
} from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full">
                <Star className="w-4 h-4 text-yellow-500 mr-2" />
                <span className="text-blue-600 text-sm font-medium">
                  Trusted by leading neurologists
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Advanced <span className="text-blue-600">EEG Analysis</span>{" "}
                Made Simple
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Transform your EEG diagnostics with our AI-powered platform. Get
                precise analysis, detailed insights, and professional reports in
                minutes, not hours.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => onNavigate("/dashboard")}
                  className="group bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>Start Analysis</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => onNavigate("#")}
                  className="group px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Watch Demo</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="flex items-center space-x-8 pt-8">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      src={`https://images.unsplash.com/photo-${i}?auto=format&fit=crop&q=80`}
                      alt={`User ${i}`}
                      className="w-10 h-10 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-blue-600">4.9/5</span>{" "}
                  from over 1,000+ reviews
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-blue-200 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
              <img
                src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80"
                alt="EEG Analysis"
                className="relative rounded-3xl shadow-2xl w-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto mt-20 py-12 px-8 bg-white rounded-2xl shadow-lg">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">100K+</div>
              <div className="text-gray-600 mt-2">EEG Scans Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">99.9%</div>
              <div className="text-gray-600 mt-2">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">50+</div>
              <div className="text-gray-600 mt-2">Research Institutions</div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {/* Feature 1: Upload EEG Data */}
          <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
              <Activity className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Upload EEG Data
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Seamlessly upload and process EEG files in multiple formats. Our
              platform supports all major EEG recording systems.
            </p>
            <button
              onClick={() => onNavigate("#")}
              className="group inline-flex items-center text-blue-600 font-medium hover:text-blue-700"
            >
              <span>Upload Now</span>
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Feature 2: Generate Reports */}
          <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
              <FileText className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Smart Reports
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Generate comprehensive reports with advanced visualizations,
              anomaly detection, and clinical insights.
            </p>
            <button
              onClick={() => onNavigate("#")}
              className="group inline-flex items-center text-blue-600 font-medium hover:text-blue-700"
            >
              <span>View Reports</span>
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Feature 3: Expert Analysis */}
          <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
              <Brain className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              AI-Powered Analysis
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Leverage cutting-edge AI algorithms for precise pattern
              recognition and anomaly detection in brain activity.
            </p>
            <button
              onClick={() => onNavigate("#")}
              className="group inline-flex items-center text-blue-600 font-medium hover:text-blue-700"
            >
              <span>Learn More</span>
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
