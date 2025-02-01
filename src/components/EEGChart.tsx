import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceArea,
  Tooltip,
  ReferenceLine,
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

  const zoom = () => {
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
  };

  const zoomOut = () => {
    setRefAreaLeft("");
    setRefAreaRight("");
    setZoomIn(false);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div className="bg-white px-3 py-2 shadow-lg rounded-lg border">
          <p className="text-sm font-medium">{channel}</p>
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
    <div className="w-full h-16 relative group">
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-12 text-xs font-mono">
        {channel}
      </div>
      <div className="ml-12 h-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredData}
            onMouseDown={(e) => {
              if (!e) return;
              setRefAreaLeft(e.activeLabel || "");
            }}
            onMouseMove={(e) => {
              if (!e) return;
              if (refAreaLeft) setRefAreaRight(e.activeLabel || "");
              if (e.activePayload) {
                setHoveredValue(e.activePayload[0].value);
              }
            }}
            onMouseUp={zoom}
            onMouseLeave={() => setHoveredValue(null)}
          >
            <XAxis
              dataKey="timestamp"
              hide={true}
              domain={zoomIn ? [left!, right!] : ["auto", "auto"]}
            />
            <YAxis hide={true} domain={["auto", "auto"]} />
            <Tooltip content={<CustomTooltip />} />

            {/* Frequency bands */}
            {showFrequencyBands && (
              <>
                <ReferenceLine y={0} stroke="#E5E7EB" strokeDasharray="3 3" />
                <ReferenceLine y={5} stroke="#E5E7EB" strokeDasharray="3 3" />
                <ReferenceLine y={-5} stroke="#E5E7EB" strokeDasharray="3 3" />
              </>
            )}

            <Line
              type="linear"
              dataKey={channel}
              stroke="#2563eb"
              dot={false}
              isAnimationActive={false}
              strokeWidth={0.75}
            />

            {refAreaLeft && refAreaRight ? (
              <ReferenceArea
                x1={refAreaLeft}
                x2={refAreaRight}
                strokeOpacity={0.3}
                fill="#2563eb"
                fillOpacity={0.1}
              />
            ) : null}
          </LineChart>
        </ResponsiveContainer>

        {/* Hover value indicator */}
        {hoveredValue !== null && (
          <div className="absolute top-0 right-0 bg-blue-100 text-blue-600 px-2 py-1 text-xs rounded">
            {hoveredValue.toFixed(2)}
          </div>
        )}

        {/* Zoom reset button */}
        {zoomIn && (
          <button
            onClick={zoomOut}
            className="absolute top-0 right-0 bg-blue-100 text-blue-600 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Reset Zoom
          </button>
        )}
      </div>
    </div>
  );
};
