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

  const filteredData = data
    .filter(
      (point) =>
        point.timestamp >= timeWindow[0] && point.timestamp <= timeWindow[1]
    )
    .map((point) => ({
      ...point,
      [channel]: point[channel]
        ? point[channel] * amplitudeScale - index * 100
        : 0,
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
        <div className="bg-white/90 backdrop-blur-sm px-3 py-2 shadow-lg rounded-lg border border-gray-100">
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
    <div className="w-full h-24 relative group border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-12 text-xs font-mono font-medium text-gray-700 z-10">
        {channel}
      </div>
      <div className="absolute inset-0 ml-14">
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
            margin={{ top: 5, right: 30, bottom: 5, left: 10 }}
          >
            <XAxis
              dataKey="timestamp"
              type="number"
              domain={zoomIn ? [left!, right!] : ["auto", "auto"]}
              tick={{ fontSize: 10 }}
              stroke="#94a3b8"
              hide
            />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fontSize: 10 }}
              stroke="#94a3b8"
              hide
            />
            <Tooltip content={<CustomTooltip />} />

            {showFrequencyBands && (
              <>
                <ReferenceLine y={0} stroke="#E5E7EB" strokeDasharray="3 3" />
                <ReferenceLine y={50} stroke="#E5E7EB" strokeDasharray="3 3" />
                <ReferenceLine y={-50} stroke="#E5E7EB" strokeDasharray="3 3" />
              </>
            )}

            <Line
              type="monotone"
              dataKey={channel}
              stroke="url(#colorGradient)"
              dot={false}
              isAnimationActive={false}
              strokeWidth={1.5}
            />

            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>
            </defs>

            {refAreaLeft && refAreaRight ? (
              <ReferenceArea
                x1={refAreaLeft}
                x2={refAreaRight}
                strokeOpacity={0.3}
                fill="url(#colorGradient)"
                fillOpacity={0.1}
              />
            ) : null}
          </LineChart>
        </ResponsiveContainer>

        {hoveredValue !== null && (
          <div className="absolute top-1 right-1 bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded-md font-medium">
            {hoveredValue.toFixed(2)}
          </div>
        )}

        {zoomIn && (
          <button
            onClick={zoomOut}
            className="absolute top-1 right-1 bg-blue-600 text-white px-2 py-1 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-700"
          >
            Reset Zoom
          </button>
        )}
      </div>
    </div>
  );
};
