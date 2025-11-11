"use client"

import { useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  Legend,
} from "recharts"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { VisualizationData } from "@/lib/visualization-generator"

interface DynamicVisualizationProps {
  visualization: VisualizationData
  className?: string
}

export function DynamicVisualization({ visualization, className = "" }: DynamicVisualizationProps) {
  const { type, title, data, config } = visualization

  // Render different visualization types
  const renderVisualization = useMemo(() => {
    switch (type) {
      case "metric":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {data.slice(0, 6).map((metric: any, idx: number) => {
              // Use single blue color scheme for all metrics
              const colorScheme = {
                bg: "from-blue-50 to-white",
                border: "border-blue-200",
                text: "text-blue-700",
                iconBg: "from-blue-500 to-blue-600"
              }

              return (
                <div
                  key={idx}
                  className={`p-4 bg-gradient-to-br ${colorScheme.bg} rounded-xl border ${colorScheme.border} shadow-lg hover:shadow-xl transition-all`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
                      {metric.label}
                    </div>
                    <div className={`p-1.5 rounded-lg bg-gradient-to-br ${colorScheme.iconBg} shadow-md`}>
                      <TrendingUp className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <div className={`text-3xl font-bold bg-gradient-to-br ${colorScheme.iconBg} bg-clip-text text-transparent`}>
                    {typeof metric.value === "number"
                      ? metric.value.toLocaleString()
                      : metric.value}
                  </div>
                  {metric.trend && (
                    <div className="mt-2 flex items-center gap-1 text-xs">
                      {metric.trend === "up" && <TrendingUp className="h-3 w-3 text-green-600" />}
                      {metric.trend === "down" && <TrendingDown className="h-3 w-3 text-red-600" />}
                      {metric.trend === "stable" && <Minus className="h-3 w-3 text-gray-600" />}
                      <span
                        className={
                          metric.trend === "up"
                            ? "text-green-600 font-semibold"
                            : metric.trend === "down"
                              ? "text-red-600 font-semibold"
                              : "text-gray-600 font-semibold"
                        }
                      >
                        {metric.trend}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )

      case "bar":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id={`barGradient-${visualization.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#1e40af" stopOpacity={0.95} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey={config?.xKey || "name"}
                tick={{ fill: "#64748b", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                angle={data.length > 5 ? -45 : 0}
                textAnchor={data.length > 5 ? "end" : "middle"}
                height={data.length > 5 ? 80 : 30}
              />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "12px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                cursor={{ fill: "#f1f5f9" }}
                formatter={(value: any, name: any) => [value, name === "value" ? "Value" : name]}
              />
              <Bar
                dataKey={config?.yKey || "value"}
                fill={`url(#barGradient-${visualization.id})`}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )

      case "line":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <RechartsLineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey={config?.xKey || "date"}
                tick={{ fill: "#64748b", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "12px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey={config?.yKey || "value"}
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", r: 5, strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 7, strokeWidth: 2, stroke: "#fff" }}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        )

      case "area":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id={`areaGradient-${visualization.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey={config?.xKey || "date"}
                tick={{ fill: "#64748b", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "12px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey={config?.yKey || "value"}
                stroke="#3b82f6"
                strokeWidth={3}
                fill={`url(#areaGradient-${visualization.id})`}
                dot={{ fill: "#3b82f6", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <RechartsPieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={{
                  stroke: "#64748b",
                  strokeWidth: 2,
                }}
                label={({ name, percent }: any) => {
                  const displayName = name || "Unknown"
                  return `${displayName}: ${(percent * 100).toFixed(1)}%`
                }}
                outerRadius={110}
                innerRadius={60}
                paddingAngle={2}
                fill="#8884d8"
                dataKey={config?.dataKey || "value"}
              >
                {data.map((entry: any, index: number) => {
                  const colors = config?.colors || [
                    "#3b82f6",
                    "#8b5cf6",
                    "#ec4899",
                    "#f59e0b",
                    "#10b981",
                    "#06b6d4",
                  ]
                  return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                })}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "12px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                formatter={(value: any, name: any, props: any) => {
                  const displayName = props.payload.name || name || "Value"
                  return [value, displayName]
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value: string) => (
                  <span className="text-sm text-slate-700">{value}</span>
                )}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        )

      case "table":
        if (data.length === 0) return <div className="text-sm text-gray-500 text-center py-8">No data available</div>
        const headers = Object.keys(data[0])
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
                  {headers.map((header, idx) => (
                    <th key={idx} className="text-left py-4 px-4 text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row: any, rowIdx: number) => (
                  <tr
                    key={rowIdx}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
                  >
                    {headers.map((header, cellIdx) => (
                      <td key={cellIdx} className="py-4 px-4 text-sm text-slate-700 font-medium">
                        {row[header]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )

      default:
        return <div className="text-sm text-gray-500">Visualization type not supported</div>
    }
  }, [type, data, config])

  return (
    <div className={`p-6 bg-white rounded-xl border border-slate-200 shadow-lg hover:shadow-xl transition-all ${className}`}>
      <div className="flex items-center gap-2 mb-5">
        <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
      </div>
      {renderVisualization}
    </div>
  )
}
