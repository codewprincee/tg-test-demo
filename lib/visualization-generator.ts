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

  // Extract time series data with multiple patterns

  // Pattern 1: Month names with values (Jan: 100, February 200)
  const monthRegex = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s:]+(\d+(?:,\d{3})*(?:\.\d+)?)/gi
  let monthMatch
  while ((monthMatch = monthRegex.exec(text)) !== null) {
    extracted.timeSeries.push({
      date: monthMatch[1],
      value: parseFloat(monthMatch[2].replace(/,/g, "")),
    })
  }

  // Pattern 2: Month-Year format (Jan 2024: 100, January 2024: 200)
  const monthYearRegex = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4})[\s:]+(\d+(?:,\d{3})*(?:\.\d+)?)/gi
  let monthYearMatch
  while ((monthYearMatch = monthYearRegex.exec(text)) !== null) {
    extracted.timeSeries.push({
      date: `${monthYearMatch[1]} ${monthYearMatch[2]}`,
      value: parseFloat(monthYearMatch[3].replace(/,/g, "")),
    })
  }

  // Pattern 3: Quarter patterns (Q1 2024: 100, Quarter 1: 200)
  const quarterRegex = /(?:Q|Quarter\s*)(\d)(?:\s+(\d{4}))?[\s:]+(\d+(?:,\d{3})*(?:\.\d+)?)/gi
  let quarterMatch
  while ((quarterMatch = quarterRegex.exec(text)) !== null) {
    const quarter = `Q${quarterMatch[1]}${quarterMatch[2] ? ` ${quarterMatch[2]}` : ""}`
    extracted.timeSeries.push({
      date: quarter,
      value: parseFloat(quarterMatch[3].replace(/,/g, "")),
    })
  }

  // Pattern 4: Week patterns (Week 1: 100, W1: 200)
  const weekRegex = /(?:Week\s*|W)(\d+)[\s:]+(\d+(?:,\d{3})*(?:\.\d+)?)/gi
  let weekMatch
  while ((weekMatch = weekRegex.exec(text)) !== null) {
    extracted.timeSeries.push({
      date: `Week ${weekMatch[1]}`,
      value: parseFloat(weekMatch[2].replace(/,/g, "")),
    })
  }

  // Pattern 5: Day of week (Monday: 100, Mon: 200)
  const dayRegex = /(Mon|Tue|Wed|Thu|Fri|Sat|Sun)[a-z]*[\s:]+(\d+(?:,\d{3})*(?:\.\d+)?)/gi
  let dayMatch
  while ((dayMatch = dayRegex.exec(text)) !== null) {
    extracted.timeSeries.push({
      date: dayMatch[1],
      value: parseFloat(dayMatch[2].replace(/,/g, "")),
    })
  }

  // Pattern 6: Year patterns (2024: 100, 2023: 200)
  const yearRegex = /\b(20\d{2})[\s:]+(\d+(?:,\d{3})*(?:\.\d+)?)/gi
  let yearMatch
  while ((yearMatch = yearRegex.exec(text)) !== null) {
    extracted.timeSeries.push({
      date: yearMatch[1],
      value: parseFloat(yearMatch[2].replace(/,/g, "")),
    })
  }

  // Pattern 7: Full dates (2024-01-15, 01/15/2024, 15-01-2024)
  const dateValueRegex = /(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}|\d{2}-\d{2}-\d{4})[\s:]+(\d+(?:,\d{3})*(?:\.\d+)?)/gi
  let dateValueMatch
  while ((dateValueMatch = dateValueRegex.exec(text)) !== null) {
    extracted.timeSeries.push({
      date: dateValueMatch[1],
      value: parseFloat(dateValueMatch[2].replace(/,/g, "")),
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

        // Check if first column contains time-based data
        const firstColumnSample = table.rows.map(row => row[0]).join(" ")
        const isTimeSeries =
          /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i.test(firstColumnSample) ||
          /\b(Q|Quarter)\s*[1-4]/i.test(firstColumnSample) ||
          /\b(Week|W)\s*\d+/i.test(firstColumnSample) ||
          /\b(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/i.test(firstColumnSample) ||
          /\b20\d{2}\b/.test(firstColumnSample) ||
          /\d{4}-\d{2}-\d{2}/.test(firstColumnSample) ||
          /\d{2}\/\d{2}\/\d{4}/.test(firstColumnSample)

        if (isTimeSeries) {
          // For time series, create area and line charts
          visualizations.push({
            id: `table-area-${idx}-${Date.now()}`,
            type: "area",
            title: `${table.headers[1]} Over Time (Area Chart)`,
            data,
            config: {
              xKey: table.headers[0],
              yKey: table.headers[1],
              colors: ["#8b5cf6", "#ec4899", "#f59e0b"],
            },
          })

          visualizations.push({
            id: `table-line-${idx}-${Date.now()}`,
            type: "line",
            title: `${table.headers[1]} Trend (Line Chart)`,
            data,
            config: {
              xKey: table.headers[0],
              yKey: table.headers[1],
              colors: ["#10b981", "#06b6d4", "#8b5cf6"],
            },
          })
        } else {
          // For non-time series, create bar chart
          visualizations.push({
            id: `table-bar-${idx}-${Date.now()}`,
            type: "bar",
            title: `${table.headers[1]} by ${table.headers[0]} (Bar Chart)`,
            data,
            config: {
              xKey: table.headers[0],
              yKey: table.headers[1],
              colors: ["#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4"],
            },
          })
        }

        // Pie chart (if not too many items, data is balanced, and NOT time series)
        if (!isTimeSeries && table.rows.length <= 8) {
          // Check if data is too imbalanced (one value dominates >80%)
          const total = table.rows.reduce((sum, row) => {
            const val = parseFloat(row[1])
            return sum + (isNaN(val) ? 0 : val)
          }, 0)
          const maxValue = Math.max(...table.rows.map(row => parseFloat(row[1]) || 0))
          const maxPercentage = total > 0 ? (maxValue / total) * 100 : 0

          // Only create pie chart if no single value dominates more than 80%
          if (maxPercentage < 80) {
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

  // Generate time series charts (both area and line for better visualization)
  if (extracted.timeSeries.length > 1) {
    // Remove duplicates based on date
    const uniqueTimeSeries = extracted.timeSeries.reduce((acc, curr) => {
      if (!acc.find((item: any) => item.date === curr.date)) {
        acc.push(curr)
      }
      return acc
    }, [] as typeof extracted.timeSeries)

    if (uniqueTimeSeries.length > 1) {
      // Area chart for overall trend
      visualizations.push({
        id: `timeseries-area-${Date.now()}`,
        type: "area",
        title: "Time Series Overview (Area Chart)",
        data: uniqueTimeSeries,
        config: {
          xKey: "date",
          yKey: "value",
          colors: ["#8b5cf6", "#ec4899", "#f59e0b"],
        },
      })

      // Line chart for precise trends
      visualizations.push({
        id: `timeseries-line-${Date.now()}`,
        type: "line",
        title: "Time Series Trend (Line Chart)",
        data: uniqueTimeSeries,
        config: {
          xKey: "date",
          yKey: "value",
          colors: ["#10b981", "#06b6d4", "#8b5cf6"],
        },
      })
    }
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
      // Create bar chart
      visualizations.push({
        id: `list-bar-${idx}-${Date.now()}`,
        type: "bar",
        title: "Data Breakdown (Bar Chart)",
        data: numericItems,
        config: {
          dataKey: "value",
          colors: ["#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4"],
        },
      })

      // Pie chart only if data is balanced
      const total = numericItems.reduce((sum, item) => sum + item.value, 0)
      const maxValue = Math.max(...numericItems.map(item => item.value))
      const maxPercentage = total > 0 ? (maxValue / total) * 100 : 0

      // Only create pie chart if no single value dominates more than 80%
      if (maxPercentage < 80) {
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
