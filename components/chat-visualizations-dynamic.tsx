"use client"

import { useState, useEffect, useRef } from "react"
import { Download, Sparkles, TrendingUp, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DynamicVisualization } from "@/components/dynamic-visualization"
import type { VisualizationData } from "@/lib/visualization-generator"

interface ChatVisualizationsDynamicProps {
  messageCount: number
  conversationContext?: string
  visualizations?: VisualizationData[]
  isLoading?: boolean
}

// Shimmer Skeleton Component
const ShimmerSkeleton = ({ className = "" }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="h-full w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer" />
  </div>
)

// Shimmer CSS
const shimmerStyle = `
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
  background-size: 1000px 100%;
}
`

// Chart Skeleton
const ChartSkeleton = () => (
  <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-lg">
    <ShimmerSkeleton className="h-5 w-48 mb-4" />
    <div className="h-64 flex items-end justify-between gap-3">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <ShimmerSkeleton className="w-full" style={{ height: `${Math.random() * 150 + 50}px` }} />
            <ShimmerSkeleton className="h-4 w-16" />
          </div>
        ))}
    </div>
  </div>
)

// Metric Card Skeleton
const MetricCardSkeleton = () => (
  <div className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 shadow-sm">
    <ShimmerSkeleton className="h-4 w-20 mb-2" />
    <ShimmerSkeleton className="h-8 w-24 mb-2" />
    <ShimmerSkeleton className="h-3 w-16" />
  </div>
)

export function ChatVisualizationsDynamic({
  messageCount,
  conversationContext,
  visualizations,
  isLoading = false,
}: ChatVisualizationsDynamicProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const chartRef = useRef<HTMLDivElement>(null)

  // Show updating animation when visualizations change
  useEffect(() => {
    if (visualizations && visualizations.length > 0) {
      setIsUpdating(true)
      setTimeout(() => {
        setIsUpdating(false)
      }, 500)
    }
  }, [visualizations])

  const downloadChart = async () => {
    if (!chartRef.current) return

    try {
      const html2canvas = (await import("html2canvas")).default

      // Clone the element to avoid modifying the original
      const clone = chartRef.current.cloneNode(true) as HTMLElement

      // Apply to document temporarily for rendering
      clone.style.position = 'absolute'
      clone.style.left = '-9999px'
      clone.style.backgroundColor = '#ffffff'
      document.body.appendChild(clone)

      try {
        const canvas = await html2canvas(clone, {
          backgroundColor: "#ffffff",
          scale: 2,
          logging: false,
          useCORS: true,
          allowTaint: true,
          foreignObjectRendering: false,
          removeContainer: true,
        })

        const link = document.createElement("a")
        link.download = `insights-${Date.now()}.png`
        link.href = canvas.toDataURL("image/png")
        link.click()

        console.log("Chart exported successfully!")
      } finally {
        // Clean up clone
        document.body.removeChild(clone)
      }
    } catch (error) {
      console.error("Error downloading chart:", error)
      // Fallback: Try with original element and basic options
      try {
        const html2canvas = (await import("html2canvas")).default
        const canvas = await html2canvas(chartRef.current, {
          backgroundColor: "#ffffff",
          scale: 1,
          logging: true,
          foreignObjectRendering: false,
        })
        const link = document.createElement("a")
        link.download = `insights-${Date.now()}.png`
        link.href = canvas.toDataURL("image/png")
        link.click()
        console.log("Chart exported with fallback method")
      } catch (fallbackError) {
        console.error("Fallback export also failed:", fallbackError)
        alert("Export feature is temporarily unavailable. Please take a screenshot instead.\n\nTip: Use Cmd+Shift+4 (Mac) or Win+Shift+S (Windows)")
      }
    }
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <style>{shimmerStyle}</style>

      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200/80 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Dynamic Insights</h2>
              <p className="text-xs text-slate-500">AI-generated visualizations from conversation</p>
            </div>
            {(isUpdating || isLoading) && (
              <div className="flex items-center gap-1.5 text-xs text-blue-600 ml-3">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span className="font-medium">Generating...</span>
              </div>
            )}
          </div>
          {visualizations && visualizations.length > 0 && !isLoading && (
            <Button
              onClick={downloadChart}
              size="sm"
              variant="outline"
              className="flex items-center gap-2 h-8 text-xs"
            >
              <Download className="h-3 w-3" />
              Export
            </Button>
          )}
        </div>
        {visualizations && visualizations.length > 0 && (
          <div className="flex items-center gap-2">
            <Sparkles className="h-3 w-3 text-blue-600" />
            <span className="text-xs text-slate-600">
              {visualizations.length} visualization{visualizations.length > 1 ? "s" : ""} generated
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6" ref={chartRef}>
        {isLoading || isUpdating ? (
          // Show shimmer loading state while AI is responding
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <MetricCardSkeleton />
              <MetricCardSkeleton />
              <MetricCardSkeleton />
            </div>
            <ChartSkeleton />
            <ChartSkeleton />
            <div className="text-center py-4">
              <p className="text-sm text-blue-600 font-medium animate-pulse">
                Analyzing data and generating visualizations...
              </p>
            </div>
          </div>
        ) : visualizations && visualizations.length > 0 ? (
          // Show dynamic visualizations
          <div className="space-y-6 animate-fadeIn">
            {visualizations.map((viz) => (
              <DynamicVisualization key={viz.id} visualization={viz} />
            ))}
          </div>
        ) : (
          // Show empty state only when not loading and no visualizations
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="p-4 rounded-full bg-blue-50 mb-4">
              <Sparkles className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No visualizations yet</h3>
            <p className="text-sm text-slate-600 max-w-md">
              Start a conversation with data-rich questions. I'll automatically generate charts,
              graphs, and insights based on the discussion.
            </p>
            <div className="mt-6 text-xs text-slate-500">
              <p className="font-medium mb-2">Try asking about:</p>
              <ul className="text-left space-y-1">
                <li>• Customer metrics and trends</li>
                <li>• Regional performance comparisons</li>
                <li>• API error analysis</li>
                <li>• Feature adoption rates</li>
              </ul>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  )
}
