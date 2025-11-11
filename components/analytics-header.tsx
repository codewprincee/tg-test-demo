"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar, Download, Filter, ChevronDown, Loader2 } from "lucide-react"
import { useState } from "react"
import { analyticsAPI } from "@/lib/mock-api"
import { toast } from "sonner"

interface AnalyticsHeaderProps {
  activeTab: string
  activeFilter: string
  onTabChange: (tabId: string) => void
  onFilterChange: (filterId: string) => void
  filters: { id: string; label: string }[]
}

export function AnalyticsHeader({
  activeTab,
  activeFilter,
  onTabChange,
  onFilterChange,
  filters,
}: AnalyticsHeaderProps) {
  const [dateRange, setDateRange] = useState("7days")
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (format: "csv" | "pdf" | "xlsx") => {
    setIsExporting(true)
    try {
      const response = await analyticsAPI.exportData(format)
      if (response.data) {
        toast.success(`Export successful! File is ready for download.`)
        // In a real app, this would trigger a download
        console.log("Download URL:", response.data.downloadUrl)
      } else {
        toast.error(response.error || "Export failed")
      }
    } catch (error) {
      toast.error("An error occurred during export")
    } finally {
      setIsExporting(false)
    }
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "regional", label: "Regional" },
    { id: "customers", label: "Customers" },
    { id: "features", label: "Features" }
  ]


  const dateRangeOptions = [
    { value: "7days", label: "Last 7 Days" },
    { value: "14days", label: "Last 14 Days" },
    { value: "30days", label: "Last 30 Days" },
    { value: "90days", label: "Last 90 Days" },
    { value: "custom", label: "Custom Range" }
  ]


  return (
    <div className="border-b border-gray-200 bg-white">
      {/* Header Top Section */}
      <div className="px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-sm text-gray-600 mt-1">Track your business metrics and performance</p>
          </div>

          {/* Top Controls */}
          <div className="flex items-center gap-2">
            {/* Date Range Selector */}
            <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Calendar className="h-4 w-4 text-gray-600" />
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="border-0 h-auto p-0 gap-2 focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dateRangeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Grouping Selector */}
            <div className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Select defaultValue="weekly">
                <SelectTrigger className="border-0 h-auto p-0 gap-2 text-sm focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter Button */}
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-gray-200 bg-white hover:bg-gray-50 text-gray-900 h-9"
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>

            {/* Export Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-gray-200 bg-white hover:bg-gray-50 text-gray-900 h-9"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => handleExport("csv")} className="cursor-pointer">
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("pdf")} className="cursor-pointer">
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("xlsx")} className="cursor-pointer">
                  Export as Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="px-8 border-t border-gray-200">
        <div className="flex gap-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-slate-700 text-slate-900"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Pills Section */}
      <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide mr-2">Filter:</span>
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeFilter === filter.id
                  ? "bg-slate-700 text-white shadow-sm"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}