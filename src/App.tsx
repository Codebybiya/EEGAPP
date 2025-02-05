import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import { Brain } from "lucide-react";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ReportPage from "./pages/ReportPage";

function App() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Navigation */}
        <nav
          className={`fixed w-full z-50 transition-all duration-300 ${
            isScrolled
              ? "bg-white/80 backdrop-blur-md shadow-md"
              : "bg-white/60 backdrop-blur-sm"
          }`}
        >
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center">
              {/* Logo (Left-Aligned) */}
              <Link to="/" className="flex items-center space-x-2 group">
                <Brain className="w-8 h-8 text-blue-600 transition-transform group-hover:scale-110" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  EEG Analyzer
                </span>
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="container mx-auto px-6 pt-24 pb-8">
          <Routes>
            <Route path="/" element={<Navigate replace to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route
              path="/dashboard"
              element={
                <Dashboard
                  onViewReport={(id: string) =>
                    console.log(`Viewing report ${id}`)
                  }
                />
              }
            />
            <Route path="/report" element={<ReportPage />} />
            <Route
              path="*"
              element={
                <div className="text-center py-20">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    Coming Soon
                  </h2>
                  <p className="text-gray-600 mb-8">
                    The page you're looking for is under development. Stay
                    tuned!
                  </p>
                  <Link
                    to="/home"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                  >
                    Return Home
                  </Link>
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
