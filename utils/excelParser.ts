import { read, utils } from "xlsx";
import type { EEGData } from "../src/types";

export const parseExcelFile = async (file: File): Promise<EEGData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          throw new Error("Failed to read file content");
        }

        // Read the Excel file
        const workbook = read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert to JSON with raw headers
        const jsonData = utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length < 2) {
          throw new Error(
            "The Excel file appears to be empty or missing data rows"
          );
        }

        // Get headers from the first row and clean them
        const headers = (jsonData[0] as string[])
          .map((header) => {
            if (!header) return "";
            return header
              .toString()
              .trim()
              .replace(/[\uFEFF\xA0]/g, "") // Remove BOM and non-breaking spaces
              .replace(/[^a-zA-Z0-9]/g, "") // Remove special characters
              .toUpperCase(); // Normalize to uppercase
          })
          .filter(Boolean); // Remove empty headers

        // Define sampling interval (in milliseconds)
        const samplingInterval = 1; // Adjust this based on your data's sampling rate

        // Process data rows
        const formattedData = jsonData
          .slice(1)
          .map((row: any, index: number) => {
            const dataPoint: EEGData = {
              timestamp: index * samplingInterval, // Generate timestamp from index
            };

            // Add channel data
            headers.forEach((header, colIndex) => {
              const value = row[colIndex];
              let numValue: number | null = null;

              if (typeof value === "string") {
                const cleanValue = value.replace(/[^\d.-]/g, "");
                numValue = parseFloat(cleanValue);
              } else if (typeof value === "number") {
                numValue = value;
              }

              if (numValue !== null && !isNaN(numValue)) {
                dataPoint[header] = numValue;
              }
            });

            return dataPoint;
          })
          .filter((point) => {
            // Keep points that have at least one channel value
            const channelCount = Object.keys(point).length - 1; // Exclude timestamp
            return channelCount > 0;
          });

        if (formattedData.length === 0) {
          throw new Error("No valid data points found after parsing");
        }

        console.log(
          `Successfully parsed ${
            formattedData.length
          } data points with channels: ${headers.join(", ")}`
        );
        resolve(formattedData);
      } catch (error: any) {
        console.error("Error parsing Excel file:", error);
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read the Excel file"));
    };

    reader.readAsArrayBuffer(file);
  });
};
