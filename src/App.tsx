import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";
import {
  Brain,
  LayoutDashboard,
  Home as HomeIcon,
  Menu,
  X,
} from "lucide-react";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ReportPage from "./pages/ReportPage";

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const NavLink = ({
    to,
    children,
  }: {
    to: string;
    children: React.ReactNode;
  }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
      <Link
        to={to}
        className={`relative px-4 py-2 rounded-lg transition-all duration-300 group ${
          isActive
            ? "text-blue-600 bg-blue-50"
            : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
        }`}
      >
        <span className="relative z-10 flex items-center gap-2">
          {to === "/" && <HomeIcon className="w-4 h-4" />}
          {to === "/dashboard" && <LayoutDashboard className="w-4 h-4" />}
          {children}
        </span>
        {isActive && (
          <span className="absolute inset-0 bg-blue-100/50 rounded-lg transform scale-105" />
        )}
      </Link>
    );
  };

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
            <div className="flex justify-between items-center">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-2 group">
                <Brain className="w-8 h-8 text-blue-600 transition-transform group-hover:scale-110" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  NeuroAnalyzer
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-2">
                <NavLink to="/home">Home</NavLink>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <button className="ml-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all hover:shadow-lg transform hover:-translate-y-0.5">
                  Get Started
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-blue-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-blue-600" />
                ) : (
                  <Menu className="w-6 h-6 text-blue-600" />
                )}
              </button>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
              <div className="md:hidden mt-4 pb-4 space-y-2">
                <NavLink to="/home">Home</NavLink>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <button className="w-full mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all">
                  Get Started
                </button>
              </div>
            )}
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
                    404 - Page Not Found
                  </h2>
                  <p className="text-gray-600 mb-8">
                    The page you're looking for doesn't exist.
                  </p>
                  <Link
                    to="/home"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                  >
                    <HomeIcon className="w-5 h-5 mr-2" />
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
