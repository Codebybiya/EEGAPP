import React from "react";
import { useLocation } from "react-router-dom";

const ReportPage: React.FC = () => {
  const location = useLocation();
  const files = location.state?.files as { [key: string]: string } | undefined;

  // If no files are found, display a message
  if (!files || Object.keys(files).length === 0) {
    return <div>No images found. Try again.</div>;
  }

  // Function to handle Google Drive image links
  const getValidImageUrl = (url: string) => {
    if (url.includes("drive.google.com")) {
      const match = url.match(/id=([a-zA-Z0-9_-]+)/);
      if (match) {
        return `https://drive.google.com/uc?export=view&id=${match[1]}`;
      }
    }
    return url.startsWith("http") ? url : `/placeholder.png`; // Fallback for invalid URLs
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">EEG Analysis Report</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(files).map(([name, url]) => {
          const imageUrl = getValidImageUrl(url);
          console.log(`Processing: ${name}, URL: ${imageUrl}`);

          return (
            <div key={name} className="bg-white rounded-lg shadow-md p-4">
              {name.endsWith(".pdf") ? (
                <a
                  href={imageUrl}
                  download={name}
                  className="text-blue-600 hover:underline"
                >
                  Download {name}
                </a>
              ) : (
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-full h-auto rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.png"; // Fallback image for errors
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReportPage;
