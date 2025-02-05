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
  Zap,
  Award,
  BarChart3,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Activity className="w-7 h-7" />,
      title: "Upload EEG Data",
      description:
        "Seamlessly upload and process EEG files in multiple formats. Our platform supports all major EEG recording systems.",
      action: "Upload Now",
      path: "/upload",
    },
  ];

  const benefits = [
    {
      icon: <Clock className="w-6 h-6 text-blue-600" />,
      title: "Fast Processing",
      description: "Get results in minutes, not hours",
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-blue-600" />,
      title: "High Accuracy",
      description: "99.9% accuracy in detection",
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-600" />,
      title: "Secure Platform",
      description: "HIPAA compliant & encrypted",
    },
    {
      icon: <Award className="w-6 h-6 text-blue-600" />,
      title: "Expert Validated",
      description: "Verified by neurologists",
    },
  ];

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
                Advanced{" "}
                <span className="relative">
                  <span className="relative z-10 text-blue-600">
                    EEG Analysis
                  </span>
                  <span className="absolute bottom-2 left-0 w-full h-3 bg-blue-200 opacity-30 -rotate-2"></span>
                </span>{" "}
                Made Simple
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Transform your EEG diagnostics with our AI-powered platform. Get
                precise analysis, detailed insights, and professional reports in
                minutes, not hours.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <Zap className="w-5 h-5" />
                  <span>Start Analysis</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  <span className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></span>
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
              <div className="relative rounded-3xl shadow-2xl overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80"
                  alt="EEG Analysis"
                  className="w-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="max-w-7xl mx-auto mt-20">
          <div className="grid md:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}

        {/* Features Section */}
        <div className="grid md:grid-cols-1 gap-8 mt-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <div className="text-blue-600 group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {feature.description}
              </p>
              <button
                onClick={() => navigate(feature.path)}
                className="group inline-flex items-center text-blue-600 font-medium hover:text-blue-700"
              >
                <span>{feature.action}</span>
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
