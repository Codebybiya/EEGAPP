import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Navigation */}
        <nav className="bg-white shadow-lg">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="text-xl font-bold text-blue-600">EEG Analysis</div>
            <div className="flex space-x-4">
              <Link
                to="/Home"
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
            <Route
              path="/Home"
              element={
                <Home
                  onNavigate={(page: string) =>
                    console.log(`Navigating to ${page}`)
                  }
                />
              }
            />
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
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
