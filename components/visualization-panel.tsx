"use client"

import { useState, useRef } from "react"
import { Download, FileText, Share2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DynamicVisualization } from "@/components/dynamic-visualization"
import { generateAndDownloadReport, extractReportSections, type ReportSection } from "@/lib/report-generator"
import type { VisualizationData } from "@/lib/visualization-generator"
import { cn } from "@/lib/utils"

interface VisualizationPanelProps {
  visualizations: VisualizationData[]
  messages?: any[]
  onClose?: () => void
  className?: string
}

export function VisualizationPanel({
  visualizations,
  messages = [],
  onClose,
  className = "",
}: VisualizationPanelProps) {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const visualizationRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true)
    try {
      // Extract text-based sections from messages
      const textSections = extractReportSections(messages, visualizations)

      // Add visualization sections
      const vizSections: ReportSection[] = visualizations.map((viz, idx) => ({
        title: viz.title || `Visualization ${idx + 1}`,
        content: `<p>This visualization shows ${viz.type} chart with ${viz.data.length} data points.</p>`,
        visualizationElement: visualizationRefs.current.get(viz.id),
      }))

      const allSections = [...textSections, ...vizSections]

      await generateAndDownloadReport(
        allSections,
        {
          title: "Data Insights Report",
          description: "Comprehensive analysis from your AI conversation",
          includeTimestamp: true,
          includeMetadata: true,
        },
        `insights-report-${Date.now()}.png`
      )
    } catch (error) {
      console.error("Error generating report:", error)
      alert("Failed to generate report. Please try again.")
    } finally {
      setIsGeneratingReport(false)
    }
  }

  const handleDownloadVisualization = async (vizId: string, title: string) => {
    const element = visualizationRefs.current.get(vizId)
    if (!element) return

    try {
      const html2canvas = (await import("html2canvas")).default
      const canvas = await html2canvas(element, {
        backgroundColor: "#ffffff",
        scale: 2,
      })

      const link = document.createElement("a")
      link.download = `${title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.png`
      link.href = canvas.toDataURL()
      link.click()
    } catch (error) {
      console.error("Error downloading visualization:", error)
    }
  }

  if (visualizations.length === 0) {
    return null
  }

  return (
    <div className={cn("flex flex-col h-full bg-gradient-to-br from-slate-50 via-white to-blue-50/30", className)}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200/80 bg-white/80 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Data Visualizations</h2>
              <p className="text-xs text-slate-500">{visualizations.length} visualization{visualizations.length !== 1 ? "s" : ""} generated</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleGenerateReport}
              disabled={isGeneratingReport}
              size="sm"
              variant="outline"
              className="flex items-center gap-2 h-8 text-xs border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              {isGeneratingReport ? (
                <>
                  <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="h-3 w-3" />
                  Generate Report
                </>
              )}
            </Button>
            {onClose && (
              <Button
                onClick={onClose}
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-6">
          {visualizations.map((viz, idx) => (
            <div
              key={viz.id}
              ref={(el) => {
                if (el) visualizationRefs.current.set(viz.id, el)
              }}
              className="relative group"
            >
              <DynamicVisualization visualization={viz} />

              {/* Quick actions overlay */}
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1 shadow-lg">
                  <Button
                    onClick={() => handleDownloadVisualization(viz.id, viz.title)}
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0"
                    title="Download this visualization"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0"
                    title="Share"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-slate-200 bg-white/50 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-slate-600 font-medium">Live data</span>
          </div>
        </div>
      </div>
    </div>
  )
}
