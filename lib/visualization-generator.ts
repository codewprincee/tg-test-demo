/**
 * Dynamic Visualization Generator
 * Extracts structured data from AI responses and generates appropriate visualizations
 */

export interface VisualizationData {
  id: string
  type: "bar" | "line" | "pie" | "area" | "table" | "metric"
  title: string
  data: any[]
  config?: {
    xKey?: string
    yKey?: string
    dataKey?: string
    colors?: string[]
    format?: string
  }
}

export interface ExtractedData {
  tables: { headers: string[]; rows: any[][] }[]
  metrics: { label: string; value: number | string; trend?: string }[]
  lists: { items: string[]; context: string }[]
  timeSeries: { date: string; value: number; label?: string }[]
}

/**
 * Extract structured data from AI response text
 */
export function extractDataFromResponse(text: string): ExtractedData {
  const extracted: ExtractedData = {
    tables: [],
    metrics: [],
    lists: [],
    timeSeries: [],
  }

  // Extract metrics (numbers with labels)
  const metricPatterns = [
    // Pattern: "Label: Value%" or "Label: Value"
    /([\w\s]+):\s*(\d+(?:,\d{3})*(?:\.\d+)?)%/gi,
    // Pattern: "Label: $Value"
    /([\w\s]+):\s*\$(\d+(?:,\d{3})*(?:\.\d+)?[KMB]?)/gi,
    // Pattern: "Label: Value units"
    /([\w\s]+):\s*(\d+(?:,\d{3})*(?:\.\d+)?)\s+(customers?|users?|accounts?|tickets?|MRR|ARR)/gi,
    // Pattern: standalone percentages
    /(\d+(?:\.\d+)?)%/g,
    // Pattern: standalone currency
    /\$(\d+(?:,\d{3})*(?:\.\d+)?[KMB]?)/g,
  ]

  const processedMetrics = new Set<string>() // Avoid duplicates

  // Pattern 1: Label: Value%
  const labelPercentPattern = /([\w\s]{3,30}):\s*(\d+(?:,\d{3})*(?:\.\d+)?)%/gi
  let match
  while ((match = labelPercentPattern.exec(text)) !== null) {
    const label = match[1].trim()
    const value = parseFloat(match[2].replace(/,/g, ""))
    const key = `${label}:${value}`
    if (!processedMetrics.has(key)) {
      extracted.metrics.push({ label, value })
      processedMetrics.add(key)
    }
  }

  // Pattern 2: Label: $Value
  const labelCurrencyPattern = /([\w\s]{3,30}):\s*\$(\d+(?:,\d{3})*(?:\.\d+)?[KMB]?)/gi
  while ((match = labelCurrencyPattern.exec(text)) !== null) {
    const label = match[1].trim()
    let value = match[2].replace(/,/g, "")
    // Convert K/M/B to numbers
    if (value.endsWith("K")) value = (parseFloat(value.slice(0, -1)) * 1000).toString()
    if (value.endsWith("M")) value = (parseFloat(value.slice(0, -1)) * 1000000).toString()
    if (value.endsWith("B")) value = (parseFloat(value.slice(0, -1)) * 1000000000).toString()
    const numValue = parseFloat(value)
    const key = `${label}:${numValue}`
    if (!processedMetrics.has(key)) {
      extracted.metrics.push({ label, value: numValue })
      processedMetrics.add(key)
    }
  }

  // Pattern 3: Label: Value units
  const labelValueUnitsPattern = /([\w\s]{3,30}):\s*(\d+(?:,\d{3})*(?:\.\d+)?)\s+([A-Za-z]+)/gi
  while ((match = labelValueUnitsPattern.exec(text)) !== null) {
    const label = match[1].trim()
    const value = parseFloat(match[2].replace(/,/g, ""))
    const unit = match[3]
    const fullLabel = `${label} (${unit})`
    const key = `${fullLabel}:${value}`
    if (!processedMetrics.has(key) && !isNaN(value)) {
      extracted.metrics.push({ label: fullLabel, value })
      processedMetrics.add(key)
    }
  }

  // Extract tables (markdown-style)
  const tableRegex = /\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.+\|\n?)+)/g
  let tableMatch
  while ((tableMatch = tableRegex.exec(text)) !== null) {
    const headers = tableMatch[1]
      .split("|")
      .map((h) => h.trim())
      .filter(Boolean)
    const rowsText = tableMatch[2]
    const rows = rowsText
      .split("\n")
      .filter(Boolean)
      .map((row) =>
        row
          .split("|")
          .map((cell) => cell.trim())
          .filter(Boolean)
      )
    extracted.tables.push({ headers, rows })
  }

  // Extract lists (numbered or bulleted)
  const listRegex = /(?:^|\n)((?:[-•*]\s+.+\n?)+|(?:\d+\.\s+.+\n?)+)/gm
  let listMatch
  while ((listMatch = listRegex.exec(text)) !== null) {
    const items = listMatch[1]
      .split("\n")
      .filter(Boolean)
      .map((item) => item.replace(/^[-•*]\s+|\d+\.\s+/, "").trim())
    if (items.length > 0) {
      extracted.lists.push({ items, context: "" })

      // Try to extract customer/entity data with percentages or values
      items.forEach((item) => {
        // Pattern: "Name (Churn: 35%)" or "Name (Value: $1K)"
        const entityPattern = /([A-Za-z\s&]+)\s*\((?:Churn|Risk|Score|Value):\s*(\d+(?:\.\d+)?)%?\s*(?:\$)?([KMB])?\)/gi
        const entityMatch = entityPattern.exec(item)
        if (entityMatch) {
          const entityName = entityMatch[1].trim()
          const value = parseFloat(entityMatch[2])
          extracted.metrics.push({
            label: entityName,
            value,
          })
        }
      })
    }
  }

  // Extract time series (month names with values)
  const monthRegex = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s:]+(\d+(?:,\d{3})*(?:\.\d+)?)/gi
  let monthMatch
  while ((monthMatch = monthRegex.exec(text)) !== null) {
    extracted.timeSeries.push({
      date: monthMatch[1],
      value: parseFloat(monthMatch[2].replace(/,/g, "")),
    })
  }

  return extracted
}

/**
 * Generate appropriate visualizations based on extracted data
 */
export function generateVisualizations(
  extracted: ExtractedData,
  conversationContext: string
): VisualizationData[] {
  const visualizations: VisualizationData[] = []

  // Generate metric cards
  if (extracted.metrics.length > 0) {
    // Group similar metrics together
    const uniqueMetrics = extracted.metrics.slice(0, 6) // Top 6 metrics
    visualizations.push({
      id: `metrics-${Date.now()}`,
      type: "metric",
      title: "Key Metrics",
      data: uniqueMetrics,
    })
  }

  // Generate charts from tables
  extracted.tables.forEach((table, idx) => {
    if (table.rows.length > 0) {
      // Try to determine the best chart type
      const hasNumericColumn = table.rows.some((row) =>
        row.some((cell) => !isNaN(parseFloat(cell)))
      )

      if (hasNumericColumn) {
        // Create a structured data array
        const data = table.rows.map((row) => {
          const obj: any = {}
          table.headers.forEach((header, i) => {
            obj[header] = row[i]
          })
          return obj
        })

        // Create both bar and pie charts for table data
        // Bar chart
        visualizations.push({
          id: `table-bar-${idx}-${Date.now()}`,
          type: "bar",
          title: `${table.headers[1]} by ${table.headers[0]} (Bar Chart)`,
          data,
          config: {
            xKey: table.headers[0],
            yKey: table.headers[1],
            colors: ["#3b82f6"],
          },
        })

        // Pie chart (if not too many items)
        if (table.rows.length <= 8) {
          visualizations.push({
            id: `table-pie-${idx}-${Date.now()}`,
            type: "pie",
            title: `${table.headers[1]} by ${table.headers[0]} (Pie Chart)`,
            data,
            config: {
              dataKey: table.headers[1],
              colors: ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4"],
            },
          })
        }
      }

      // Also provide table view
      visualizations.push({
        id: `table-${idx}-${Date.now()}`,
        type: "table",
        title: "Detailed Data",
        data: table.rows.map((row) => {
          const obj: any = {}
          table.headers.forEach((header, i) => {
            obj[header] = row[i]
          })
          return obj
        }),
        config: {
          format: "table",
        },
      })
    }
  })

  // Generate time series charts
  if (extracted.timeSeries.length > 1) {
    visualizations.push({
      id: `timeseries-${Date.now()}`,
      type: "line",
      title: "Trend Over Time",
      data: extracted.timeSeries,
      config: {
        xKey: "date",
        yKey: "value",
        colors: ["#3b82f6"],
      },
    })
  }

  // Generate charts from lists (if they contain numeric data)
  extracted.lists.forEach((list, idx) => {
    const numericItems = list.items
      .map((item) => {
        // Try multiple patterns to extract label and value
        // Pattern 1: "Label: Value" or "Label - Value"
        const colonPattern = /^(.+?)[:|-]\s*(\d+(?:,\d{3})*(?:\.\d+)?)(?:%|\s|$)/
        const colonMatch = item.match(colonPattern)
        if (colonMatch) {
          return {
            name: colonMatch[1].trim(),
            value: parseFloat(colonMatch[2].replace(/,/g, "")),
          }
        }

        // Pattern 2: "Value Label" or "Label (Value)"
        const parenthesesPattern = /(.+?)\s*\((\d+(?:,\d{3})*(?:\.\d+)?)\)/
        const parenthesesMatch = item.match(parenthesesPattern)
        if (parenthesesMatch) {
          return {
            name: parenthesesMatch[1].trim(),
            value: parseFloat(parenthesesMatch[2].replace(/,/g, "")),
          }
        }

        // Pattern 3: Just a number somewhere in the string
        const numberPattern = /(\d+(?:,\d{3})*(?:\.\d+)?)/
        const numberMatch = item.match(numberPattern)
        if (numberMatch) {
          const label = item.replace(numberMatch[0], "").trim() || `Item ${idx + 1}`
          return {
            name: label.length > 30 ? label.substring(0, 30) + "..." : label,
            value: parseFloat(numberMatch[0].replace(/,/g, "")),
          }
        }
        return null
      })
      .filter(Boolean) as { name: string; value: number }[]

    if (numericItems.length > 0 && numericItems.length < 10) {
      // Create both bar and pie charts for comprehensive visualization
      // Bar chart
      visualizations.push({
        id: `list-bar-${idx}-${Date.now()}`,
        type: "bar",
        title: "Data Breakdown (Bar Chart)",
        data: numericItems,
        config: {
          dataKey: "value",
          colors: ["#3b82f6"],
        },
      })

      // Pie chart
      visualizations.push({
        id: `list-pie-${idx}-${Date.now()}`,
        type: "pie",
        title: "Data Breakdown (Pie Chart)",
        data: numericItems,
        config: {
          dataKey: "value",
          colors: ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4"],
        },
      })
    }
  })

  return visualizations
}

/**
 * Parse AI response and generate visualizations
 */
export function parseResponseForVisualizations(
  aiResponse: string,
  conversationContext: string
): VisualizationData[] {
  const extracted = extractDataFromResponse(aiResponse)
  const visualizations = generateVisualizations(extracted, conversationContext)
  return visualizations
}

/**
 * Get visualization component props from visualization data
 */
export function getVisualizationProps(viz: VisualizationData) {
  switch (viz.type) {
    case "bar":
    case "line":
    case "area":
      return {
        chartType: viz.type,
        data: viz.data,
        xKey: viz.config?.xKey || "label",
        yKey: viz.config?.yKey || "value",
        colors: viz.config?.colors || ["#3b82f6"],
      }
    case "pie":
      return {
        chartType: "pie",
        data: viz.data,
        dataKey: viz.config?.dataKey || "value",
        colors: viz.config?.colors || ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"],
      }
    case "table":
      return {
        chartType: "table",
        data: viz.data,
      }
    case "metric":
      return {
        chartType: "metric",
        data: viz.data,
      }
    default:
      return null
  }
}
