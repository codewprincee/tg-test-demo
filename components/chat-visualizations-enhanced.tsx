"use client"

import { useState, useEffect, useRef } from "react"
import { Download, Sparkles, TrendingUp, Users, DollarSign, AlertTriangle } from "lucide-react"
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
  Area,
  AreaChart,
} from "recharts"

interface ChatVisualizationsProps {
  messageCount: number
  conversationContext?: string
}

// Enhanced data with more metrics
const churnData = [
  { month: "Jan", rate: 12.5, customers: 125, revenue: 250000 },
  { month: "Feb", rate: 11.8, customers: 118, revenue: 236000 },
  { month: "Mar", rate: 13.2, customers: 132, revenue: 264000 },
  { month: "Apr", rate: 10.5, customers: 105, revenue: 210000 },
  { month: "May", rate: 9.8, customers: 98, revenue: 196000 },
  { month: "Jun", rate: 8.3, customers: 83, revenue: 166000 },
]

const regionalData = [
  { region: "North America", churnRate: 12.5, customers: 1250, revenue: 2500000 },
  { region: "Europe", churnRate: 8.3, customers: 890, revenue: 1800000 },
  { region: "Asia Pacific", churnRate: 15.2, customers: 650, revenue: 1200000 },
  { region: "Latin America", churnRate: 10.1, customers: 420, revenue: 850000 },
]

const pieData = [
  { name: "North America", value: 1250, color: "#3b82f6" },
  { name: "Europe", value: 890, color: "#8b5cf6" },
  { name: "Asia Pacific", value: 650, color: "#ec4899" },
  { name: "Latin America", value: 420, color: "#f59e0b" },
]

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  }
  return `$${(value / 1000).toFixed(0)}K`
}

export function ChatVisualizationsEnhanced({ messageCount, conversationContext }: ChatVisualizationsProps) {
  const [contextKeywords, setContextKeywords] = useState<string[]>([])
  const [isUpdating, setIsUpdating] = useState(false)
  const chartRef = useRef<HTMLDivElement>(null)

  const avgChurn = (churnData.reduce((sum, d) => sum + d.rate, 0) / churnData.length).toFixed(1)
  const totalCustomers = regionalData.reduce((sum, d) => sum + d.customers, 0)
  const totalRevenue = regionalData.reduce((sum, d) => sum + d.revenue, 0)

  // Update visualization based on conversation context
  useEffect(() => {
    if (conversationContext) {
      setIsUpdating(true)

      const keywords: string[] = []
      const lowerContext = conversationContext.toLowerCase()

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

      setContextKeywords(keywords)

      setTimeout(() => {
        setIsUpdating(false)
      }, 500)
    }
  }, [conversationContext])

  const downloadChart = async () => {
    if (!chartRef.current) return

    try {
      const html2canvas = (await import("html2canvas")).default
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
      })

      const link = document.createElement("a")
      link.download = `customer-insights-${Date.now()}.png`
      link.href = canvas.toDataURL()
      link.click()
    } catch (error) {
      console.error("Error downloading chart:", error)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200/80 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Data Insights</h2>
              <p className="text-xs text-slate-500">Real-time analytics from conversation</p>
            </div>
            {isUpdating && (
              <div className="flex items-center gap-1.5 text-xs text-blue-600 ml-3">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                <span className="font-medium">Updating...</span>
              </div>
            )}
          </div>
          <Button
            onClick={downloadChart}
            size="sm"
            variant="outline"
            className="flex items-center gap-2 h-8 text-xs"
          >
            <Download className="h-3 w-3" />
            Export
          </Button>
        </div>
        {contextKeywords.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Sparkles className="h-3 w-3 text-blue-600" />
            <span className="text-xs text-slate-600">Topics:</span>
            {contextKeywords.map((keyword) => (
              <span
                key={keyword}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 capitalize border border-blue-200"
              >
                {keyword}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6" ref={chartRef}>
        <div className={cn("space-y-6 transition-all duration-500", isUpdating && "opacity-70 scale-[0.99]")}>
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-blue-100">
                  <AlertTriangle className="h-3.5 w-3.5 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-slate-600">Avg Churn</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">{avgChurn}%</div>
              <div className="text-xs text-slate-500 mt-1">Last 6 months</div>
            </div>

            <div className="p-4 bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-green-100">
                  <Users className="h-3.5 w-3.5 text-green-600" />
                </div>
                <span className="text-xs font-medium text-slate-600">Customers</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">{totalCustomers.toLocaleString()}</div>
              <div className="text-xs text-slate-500 mt-1">Active accounts</div>
            </div>

            <div className="p-4 bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-purple-100">
                  <DollarSign className="h-3.5 w-3.5 text-purple-600" />
                </div>
                <span className="text-xs font-medium text-slate-600">Revenue</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">{formatCurrency(totalRevenue)}</div>
              <div className="text-xs text-slate-500 mt-1">Total MRR</div>
            </div>
          </div>

          {/* Main Chart - Churn Trend */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              Churn Rate Trend
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={churnData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorChurn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  labelStyle={{ color: "#1e293b", fontWeight: 600, marginBottom: "4px" }}
                />
                <Area type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={3} fill="url(#colorChurn)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Regional Breakdown - Bar Chart */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              Regional Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={regionalData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#1e40af" stopOpacity={0.9} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="region" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  cursor={{ fill: "#f1f5f9" }}
                />
                <Bar dataKey="customers" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Regional Pie Chart */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-600" />
              Customer Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
