// import React, { useState } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   ResponsiveContainer,
//   ReferenceArea,
//   Tooltip,
//   ReferenceLine,
// } from "recharts";
// import type { EEGData } from "../types";

// interface EEGChartProps {
//   data: EEGData[];
//   channel: string;
//   index: number;
//   amplitudeScale?: number;
//   timeWindow?: [number, number];
//   showFrequencyBands?: boolean;
// }

// export const EEGChart: React.FC<EEGChartProps> = ({
//   data,
//   channel,
//   index,
//   amplitudeScale = 1,
//   timeWindow = [0, 1000],
//   showFrequencyBands = false,
// }) => {
//   const [left, setLeft] = useState<number | null>(null);
//   const [right, setRight] = useState<number | null>(null);
//   const [refAreaLeft, setRefAreaLeft] = useState<string>("");
//   const [refAreaRight, setRefAreaRight] = useState<string>("");
//   const [zoomIn, setZoomIn] = useState(false);
//   const [hoveredValue, setHoveredValue] = useState<number | null>(null);

//   // Filter data based on time window and apply amplitude scaling
//   const filteredData = data
//     .filter(
//       (point) =>
//         point.timestamp >= timeWindow[0] && point.timestamp <= timeWindow[1]
//     )
//     .map((point) => ({
//       ...point,
//       [channel]: point[channel as keyof EEGData] * amplitudeScale - index * 15,
//     }));

//   const zoom = () => {
//     if (refAreaLeft === refAreaRight || refAreaRight === "") {
//       setRefAreaLeft("");
//       setRefAreaRight("");
//       return;
//     }

//     if (left! > right!) {
//       setRefAreaLeft("");
//       setRefAreaRight("");
//     }

//     setZoomIn(true);
//   };

//   const zoomOut = () => {
//     setRefAreaLeft("");
//     setRefAreaRight("");
//     setZoomIn(false);
//   };

//   const CustomTooltip = ({ active, payload }: any) => {
//     if (active && payload && payload.length) {
//       const value = payload[0].value;
//       return (
//         <div className="bg-white px-3 py-2 shadow-lg rounded-lg border">
//           <p className="text-sm font-medium">{channel}</p>
//           <p className="text-xs text-gray-600">Value: {value.toFixed(2)}</p>
//           <p className="text-xs text-gray-600">
//             Time: {payload[0].payload.timestamp}ms
//           </p>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="w-full h-16 relative group">
//       <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-12 text-xs font-mono">
//         {channel}
//       </div>
//       <div className="ml-12 h-full relative">
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart
//             data={filteredData}
//             onMouseDown={(e) => {
//               if (!e) return;
//               setRefAreaLeft(e.activeLabel || "");
//             }}
//             onMouseMove={(e) => {
//               if (!e) return;
//               if (refAreaLeft) setRefAreaRight(e.activeLabel || "");
//               if (e.activePayload) {
//                 setHoveredValue(e.activePayload[0].value);
//               }
//             }}
//             onMouseUp={zoom}
//             onMouseLeave={() => setHoveredValue(null)}
//           >
//             <XAxis
//               dataKey="timestamp"
//               hide={true}
//               domain={zoomIn ? [left!, right!] : ["auto", "auto"]}
//             />
//             <YAxis hide={true} domain={["auto", "auto"]} />
//             <Tooltip content={<CustomTooltip />} />

//             {/* Frequency bands */}
//             {showFrequencyBands && (
//               <>
//                 <ReferenceLine y={0} stroke="#E5E7EB" strokeDasharray="3 3" />
//                 <ReferenceLine y={5} stroke="#E5E7EB" strokeDasharray="3 3" />
//                 <ReferenceLine y={-5} stroke="#E5E7EB" strokeDasharray="3 3" />
//               </>
//             )}

//             <Line
//               type="linear"
//               dataKey={channel}
//               stroke="#2563eb"
//               dot={false}
//               isAnimationActive={false}
//               strokeWidth={0.75}
//             />

//             {refAreaLeft && refAreaRight ? (
//               <ReferenceArea
//                 x1={refAreaLeft}
//                 x2={refAreaRight}
//                 strokeOpacity={0.3}
//                 fill="#2563eb"
//                 fillOpacity={0.1}
//               />
//             ) : null}
//           </LineChart>
//         </ResponsiveContainer>

//         {/* Hover value indicator */}
//         {hoveredValue !== null && (
//           <div className="absolute top-0 right-0 bg-blue-100 text-blue-600 px-2 py-1 text-xs rounded">
//             {hoveredValue.toFixed(2)}
//           </div>
//         )}

//         {/* Zoom reset button */}
//         {zoomIn && (
//           <button
//             onClick={zoomOut}
//             className="absolute top-0 right-0 bg-blue-100 text-blue-600 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity"
//           >
//             Reset Zoom
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };
import React, { useState, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceArea,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import type { EEGData } from "../types";

interface EEGChartProps {
  data: EEGData[];
  channel: string;
  index: number;
  amplitudeScale?: number;
  timeWindow?: [number, number];
  showFrequencyBands?: boolean;
}

export const EEGChart: React.FC<EEGChartProps> = ({
  data,
  channel,
  index,
  amplitudeScale = 1,
  timeWindow = [0, 1000],
  showFrequencyBands = false,
}) => {
  const [left, setLeft] = useState<number | null>(null);
  const [right, setRight] = useState<number | null>(null);
  const [refAreaLeft, setRefAreaLeft] = useState<string>("");
  const [refAreaRight, setRefAreaRight] = useState<string>("");
  const [zoomIn, setZoomIn] = useState(false);
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  // Filter data based on time window and apply amplitude scaling
  const filteredData = data
    .filter(
      (point) =>
        point.timestamp >= timeWindow[0] && point.timestamp <= timeWindow[1]
    )
    .map((point) => ({
      ...point,
      [channel]: point[channel as keyof EEGData] * amplitudeScale - index * 15,
    }));

  const zoom = useCallback(() => {
    if (refAreaLeft === refAreaRight || refAreaRight === "") {
      setRefAreaLeft("");
      setRefAreaRight("");
      return;
    }

    if (left! > right!) {
      setRefAreaLeft("");
      setRefAreaRight("");
    }

    setZoomIn(true);
  }, [refAreaLeft, refAreaRight, left, right]);

  const zoomOut = useCallback(() => {
    setRefAreaLeft("");
    setRefAreaRight("");
    setZoomIn(false);
  }, []);

  const handleMouseDown = useCallback((e: any) => {
    if (!e) return;
    setRefAreaLeft(e.activeLabel || "");
  }, []);

  const handleMouseMove = useCallback(
    (e: any) => {
      if (!e) return;
      if (refAreaLeft) setRefAreaRight(e.activeLabel || "");
      if (e.activePayload) {
        setHoveredValue(e.activePayload[0].value);
      }
    },
    [refAreaLeft]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setHoveredValue(null);
  }, []);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div className="bg-white px-3 py-2 shadow-lg rounded-lg border border-gray-200/50 backdrop-blur-sm">
          <p className="text-sm font-medium text-gray-900">{channel}</p>
          <p className="text-xs text-gray-600">Value: {value.toFixed(2)}</p>
          <p className="text-xs text-gray-600">
            Time: {payload[0].payload.timestamp}ms
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-32 relative group bg-white rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
      <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center bg-gray-50 border-r border-gray-100 rounded-l-lg">
        <span className="text-xs font-medium text-gray-700 rotate-270">
          {channel}
        </span>
      </div>

      <div className="absolute left-12 right-0 h-full p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredData}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={zoom}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
            />

            <XAxis
              dataKey="timestamp"
              type="number"
              domain={zoomIn ? [left!, right!] : ["auto", "auto"]}
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => `${value}ms`}
              stroke="#94a3b8"
            />

            <YAxis hide={true} domain={["auto", "auto"]} />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "#94a3b8",
                strokeWidth: 1,
                strokeDasharray: "3 3",
              }}
            />

            {/* Frequency bands */}
            {showFrequencyBands && (
              <>
                <ReferenceLine y={0} stroke="#e2e8f0" strokeDasharray="3 3" />
                <ReferenceLine y={5} stroke="#e2e8f0" strokeDasharray="3 3" />
                <ReferenceLine y={-5} stroke="#e2e8f0" strokeDasharray="3 3" />
              </>
            )}

            <Line
              type="monotone"
              dataKey={channel}
              stroke="#3b82f6"
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
              activeDot={{
                r: 4,
                fill: "#2563eb",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
            />

            {refAreaLeft && refAreaRight ? (
              <ReferenceArea
                x1={refAreaLeft}
                x2={refAreaRight}
                strokeOpacity={0.3}
                fill="#3b82f6"
                fillOpacity={0.1}
              />
            ) : null}
          </LineChart>
        </ResponsiveContainer>

        {/* Hover value indicator */}
        {hoveredValue !== null && (
          <div className="absolute top-2 right-2 bg-blue-50 text-blue-700 px-2 py-1 text-xs rounded-md border border-blue-100 font-medium">
            {hoveredValue.toFixed(2)}
          </div>
        )}

        {/* Zoom controls */}
        <div
          className={`absolute top-2 right-2 transition-opacity duration-200 ${
            isHovering ? "opacity-100" : "opacity-0"
          }`}
        >
          {zoomIn ? (
            <button
              onClick={zoomOut}
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded-md border border-blue-100 font-medium transition-colors"
            >
              Reset Zoom
            </button>
          ) : (
            <div className="text-xs text-gray-400 italic">
              Click and drag to zoom
            </div>
          )}
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />
    </div>
  );
};
