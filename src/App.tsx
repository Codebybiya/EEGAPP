import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ReportPage from "./pages/ReportPage";

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {" "}
      {/* ✅ Fixed Future Flags */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Navigation */}
        <nav className="bg-white shadow-lg">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="text-xl font-bold text-blue-600">EEG Analysis</div>
            <div className="flex space-x-4">
              <Link
                to="/"
                className="px-4 py-2 rounded text-blue-600 hover:bg-blue-50"
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded text-blue-600 hover:bg-blue-50"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          <Routes>
            {/* ✅ Fixed Duplicate Route & Added Redirect for "/" */}
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
            {/* ✅ Catch-all Route for 404 Page */}
            <Route
              path="*"
              element={
                <div className="text-red-500 text-center">
                  404 - Page Not Found
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
