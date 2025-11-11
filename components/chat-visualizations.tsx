"use client"

import { useState, useEffect } from "react"
import { Table, LineChart, BarChart3, PieChart, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
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
} from "recharts"

type ChartType = "table" | "line" | "bar" | "pie"

interface ChatVisualizationsProps {
  messageCount: number
  conversationContext?: string
}

// Sample data - in production, this would come from the conversation context
const churnData = [
  { month: "Jan", rate: 12.5, customers: 1250, revenue: 2500000 },
  { month: "Feb", rate: 11.8, customers: 1180, revenue: 2360000 },
  { month: "Mar", rate: 13.2, customers: 1320, revenue: 2640000 },
  { month: "Apr", rate: 10.5, customers: 1050, revenue: 2100000 },
  { month: "May", rate: 9.8, customers: 980, revenue: 1960000 },
  { month: "Jun", rate: 8.3, customers: 830, revenue: 1660000 },
]

const regionalData = [
  { region: "North America", churnRate: 12.5, customers: 1250, revenue: "$2.5M" },
  { region: "Europe", churnRate: 8.3, customers: 890, revenue: "$1.8M" },
  { region: "Asia Pacific", churnRate: 15.2, customers: 650, revenue: "$1.2M" },
  { region: "Latin America", churnRate: 10.1, customers: 420, revenue: "$850K" },
]

const pieData = [
  { name: "North America", value: 1250, color: "#3b82f6" },
  { name: "Europe", value: 890, color: "#8b5cf6" },
  { name: "Asia Pacific", value: 650, color: "#ec4899" },
  { name: "Latin America", value: 420, color: "#f59e0b" },
]

export function ChatVisualizations({ messageCount, conversationContext }: ChatVisualizationsProps) {
  const [chartType, setChartType] = useState<ChartType>("bar")
  const [contextKeywords, setContextKeywords] = useState<string[]>([])
  const [isUpdating, setIsUpdating] = useState(false)

  const avgChurn = (churnData.reduce((sum, d) => sum + d.rate, 0) / churnData.length).toFixed(1)

  // Update visualization based on conversation context
  useEffect(() => {
    if (conversationContext) {
      // Show updating animation
      setIsUpdating(true)

      const keywords: string[] = []
      const lowerContext = conversationContext.toLowerCase()

      // Detect what kind of data to show
      if (lowerContext.includes("churn") || lowerContext.includes("retention")) {
        keywords.push("churn")
      }
      if (lowerContext.includes("revenue") || lowerContext.includes("mrr") || lowerContext.includes("arr")) {
        keywords.push("revenue")
      }
      if (lowerContext.includes("region") || lowerContext.includes("geographic")) {
        keywords.push("regional")
      }
      if (lowerContext.includes("usage") || lowerContext.includes("engagement")) {
        keywords.push("usage")
      }
      if (lowerContext.includes("api error") || lowerContext.includes("error")) {
        keywords.push("errors")
      }
      if (lowerContext.includes("trend") || lowerContext.includes("over time") || lowerContext.includes("monthly")) {
        setChartType("line")
      }
      if (lowerContext.includes("compare") || lowerContext.includes("breakdown")) {
        setChartType("bar")
      }
      if (lowerContext.includes("table") || lowerContext.includes("details") || lowerContext.includes("list")) {
        setChartType("table")
      }

      setContextKeywords(keywords)

      // Hide updating animation after a short delay
      setTimeout(() => {
        setIsUpdating(false)
      }, 500)
    }
  }, [conversationContext])

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-slate-900">Visualizations</h2>
            {isUpdating && (
              <div className="flex items-center gap-1.5 text-xs text-blue-600">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                <span className="font-medium">Updating...</span>
              </div>
            )}
          </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setChartType("table")}
            className={cn(
              "h-8 w-8 rounded-lg",
              chartType === "table"
                ? "bg-slate-900 text-white hover:bg-slate-800"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            )}
            title="Table view"
          >
            <Table className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setChartType("line")}
            className={cn(
              "h-8 w-8 rounded-lg",
              chartType === "line"
                ? "bg-slate-900 text-white hover:bg-slate-800"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            )}
            title="Line chart"
          >
            <LineChart className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setChartType("bar")}
            className={cn(
              "h-8 w-8 rounded-lg",
              chartType === "bar"
                ? "bg-slate-900 text-white hover:bg-slate-800"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            )}
            title="Bar chart"
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setChartType("pie")}
            className={cn(
              "h-8 w-8 rounded-lg",
              chartType === "pie"
                ? "bg-slate-900 text-white hover:bg-slate-800"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            )}
            title="Pie chart"
          >
            <PieChart className="h-4 w-4" />
          </Button>
        </div>
        </div>
        {/* Context Indicator */}
        {contextKeywords.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Sparkles className="h-3 w-3 text-blue-600" />
            <span className="text-xs text-slate-600">Showing:</span>
            {contextKeywords.map((keyword) => (
              <span
                key={keyword}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 capitalize"
              >
                {keyword}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white to-slate-50/30 px-6 py-6">
        <div className={cn("space-y-4 transition-opacity duration-300", isUpdating && "opacity-70")}>
          {/* Metric Card */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 mb-4">Customer Churn Rate by Region</h3>

            {chartType === "table" && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Region</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Churn Rate</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Customers</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regionalData.map((row, idx) => (
                      <tr key={idx} className="border-b border-slate-100 last:border-0">
                        <td className="py-4 px-4 text-sm text-slate-700">{row.region}</td>
                        <td className="py-4 px-4 text-sm text-slate-700">{row.churnRate}%</td>
                        <td className="py-4 px-4 text-sm text-slate-700">{row.customers}</td>
                        <td className="py-4 px-4 text-sm text-slate-700">{row.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {chartType === "bar" && (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={churnData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fill: "#64748b" }} />
                  <YAxis tick={{ fill: "#64748b" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      padding: "12px",
                    }}
                  />
                  <Bar dataKey="rate" fill="#1e293b" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}

            {chartType === "line" && (
              <ResponsiveContainer width="100%" height={300}>
                <RechartsLineChart data={churnData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fill: "#64748b" }} />
                  <YAxis tick={{ fill: "#64748b" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      padding: "12px",
                    }}
                  />
                  <Line type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={3} dot={{ fill: "#3b82f6", r: 5 }} />
                </RechartsLineChart>
              </ResponsiveContainer>
            )}

            {chartType === "pie" && (
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Summary Card */}
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="text-4xl font-bold text-slate-900 mb-2">{avgChurn}%</div>
            <div className="text-sm text-slate-600">Avg Churn</div>
          </div>
        </div>
      </div>
    </div>
  )
}
