import Papa from "papaparse";
import type { EEGData } from "../src/types";

export const parseCSVFile = async (file: File): Promise<EEGData[]> => {
  return new Promise((resolve, reject) => {
    // Validate file size
    if (file.size === 0) {
      reject(new Error("The file is empty. Please select a valid CSV file."));
      return;
    }

    // Check file extension and MIME type
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/csv",
    ];

    if (fileExtension === "xlsx" || fileExtension === "xls") {
      reject(
        new Error(
          "Excel files are not supported. Please save your file as CSV format first."
        )
      );
      return;
    }

    if (!validTypes.includes(file.type) && fileExtension !== "csv") {
      reject(new Error("Invalid file type. Please upload a CSV file."));
      return;
    }

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: "greedy",
      encoding: "utf-8",
      transformHeader: (header) => {
        return header
          .trim()
          .replace(/[\uFEFF\xA0]/g, "") // Remove BOM and non-breaking spaces
          .replace(/[^a-zA-Z0-9]/g, "") // Remove any special characters
          .toUpperCase(); // Normalize to uppercase
      },
      complete: (results) => {
        try {
          if (results.errors && results.errors.length > 0) {
            const errorMessage = results.errors
              .map((err) => `Row ${err.row}: ${err.message}`)
              .join("\n");
            throw new Error(`CSV parsing errors:\n${errorMessage}`);
          }

          if (!results.data || results.data.length === 0) {
            throw new Error(
              "No data found in the file. Please check the file content."
            );
          }

          // Get headers and validate format
          const headers = Object.keys(results.data[0] as object);

          if (headers.length === 0) {
            throw new Error(
              "No columns found in the CSV file. Please check the file format."
            );
          }

          // Check for timestamp column
          const timeHeader = headers.find((h) =>
            ["TIMESTAMP", "TIME", "MS", "MILLISECONDS"].includes(h)
          );

          if (!timeHeader) {
            throw new Error(
              'No timestamp column found. The file must have a column named "Time" or "Timestamp".'
            );
          }

          const formattedData = results.data
            .filter((row: any) => {
              return (
                row &&
                typeof row === "object" &&
                Object.values(row).some(
                  (val) => val !== null && val !== undefined
                )
              );
            })
            .map((row: any, index: number) => {
              const dataPoint: EEGData = {
                timestamp: parseFloat(row[timeHeader]) || index,
              };

              // Process each channel
              headers.forEach((header) => {
                if (header !== timeHeader) {
                  const value = row[header];
                  let numValue: number | null = null;

                  if (typeof value === "string") {
                    // Handle various number formats
                    const cleanValue = value.replace(/[^\d.-]/g, "");
                    numValue = parseFloat(cleanValue);
                  } else if (typeof value === "number") {
                    numValue = value;
                  }

                  if (numValue !== null && !isNaN(numValue)) {
                    dataPoint[header] = numValue;
                  }
                }
              });

              return dataPoint;
            })
            .filter((point) => {
              const channelCount = Object.keys(point).length - 1; // Exclude timestamp
              return channelCount > 0;
            });

          if (formattedData.length === 0) {
            throw new Error(
              "No valid data points found after parsing. Please check if your file contains numeric values for the EEG channels."
            );
          }

          // Validate channels
          const expectedChannels = [
            "FP1",
            "FP2",
            "F3",
            "F4",
            "F7",
            "F8",
            "T7",
            "T8",
            "C3",
            "C4",
            "T3",
            "T4",
            "P7",
            "P8",
            "P3",
            "P4",
            "O1",
            "O2",
            "FZ",
            "CZ",
            "PZ",
          ];

          const foundChannels = Object.keys(formattedData[0])
            .filter((key) => key !== "timestamp")
            .map((ch) => ch.toUpperCase());

          const matchingChannels = expectedChannels.filter((ch) =>
            foundChannels.includes(ch)
          );

          if (matchingChannels.length === 0) {
            throw new Error(
              `No recognized EEG channels found. Your file contains these columns: ${foundChannels.join(
                ", "
              )}\n\n` +
                `Expected channel names should include some of: ${expectedChannels.join(
                  ", "
                )}`
            );
          }

          console.log(
            `Successfully parsed ${
              formattedData.length
            } data points with channels: ${matchingChannels.join(", ")}`
          );
          resolve(formattedData);
        } catch (error: any) {
          console.error("Error parsing data:", error);
          reject(error);
        }
      },
      error: (error) => {
        console.error("File reading error:", error);
        reject(
          new Error(
            `Failed to read the file: ${error.message}. Please ensure it's a valid CSV file.`
          )
        );
      },
    });
  });
};
