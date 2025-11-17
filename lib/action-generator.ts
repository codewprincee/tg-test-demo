/**
 * Action Generator
 * Generates contextual actions based on AI response content
 */

import type { Action } from "@/components/action-cards"

/**
 * Extract actions from AI response based on context and keywords
 * Made more selective to only show when truly relevant
 */
export function generateActionsFromContext(
  aiResponse: string,
  conversationContext: string
): Action[] {
  const actions: Action[] = []
  const lowerResponse = aiResponse.toLowerCase()
  const lowerContext = conversationContext.toLowerCase()

  // Campaign-related actions - only show if explicitly discussing optimization or underperformance
  if (
    (lowerResponse.includes("campaign") && (lowerResponse.includes("optimize") || lowerResponse.includes("budget"))) ||
    (lowerResponse.includes("underperform") && lowerResponse.includes("ad"))
  ) {
    actions.push({
      id: "optimize-campaign",
      title: "Optimize Campaign Budget",
      description: "Automatically optimize your campaign budget allocation based on performance data and AI recommendations.",
      icon: "zap",
      category: "Campaign",
      estimatedTime: "2-3 minutes",
      inputs: [
        {
          name: "campaignId",
          label: "Campaign ID",
          type: "text",
          placeholder: "e.g., CAMP-2024-001",
          required: true,
        },
        {
          name: "budget",
          label: "Target Budget ($)",
          type: "number",
          placeholder: "e.g., 5000",
          required: true,
        },
        {
          name: "optimizationGoal",
          label: "Optimization Goal",
          type: "select",
          required: true,
          options: [
            { label: "Maximize Conversions", value: "conversions" },
            { label: "Maximize ROAS", value: "roas" },
            { label: "Maximize Reach", value: "reach" },
            { label: "Minimize Cost", value: "cost" },
          ],
        },
      ],
    })

    actions.push({
      id: "pause-underperforming",
      title: "Pause Underperforming Ads",
      description: "Automatically pause ads that are not meeting your performance thresholds to save budget.",
      icon: "settings",
      category: "Campaign",
      estimatedTime: "1 minute",
      inputs: [
        {
          name: "threshold",
          label: "Performance Threshold (%)",
          type: "number",
          placeholder: "e.g., 2.5",
          required: true,
        },
      ],
    })
  }

  // Churn and customer retention actions - only show if explicitly discussing churn or at-risk customers
  if (
    lowerResponse.includes("churn") ||
    (lowerResponse.includes("retention") && lowerResponse.includes("risk")) ||
    lowerResponse.includes("at-risk")
  ) {
    actions.push({
      id: "create-retention-campaign",
      title: "Create Retention Campaign",
      description: "Launch a targeted retention campaign for at-risk customers identified in the analysis.",
      icon: "send",
      category: "Retention",
      estimatedTime: "5 minutes",
      inputs: [
        {
          name: "segment",
          label: "Customer Segment",
          type: "select",
          required: true,
          options: [
            { label: "High Risk (>15% churn probability)", value: "high-risk" },
            { label: "Medium Risk (8-15%)", value: "medium-risk" },
            { label: "All At-Risk Customers", value: "all-risk" },
          ],
        },
        {
          name: "incentive",
          label: "Incentive Type",
          type: "select",
          required: true,
          options: [
            { label: "Discount (20% off)", value: "discount-20" },
            { label: "Free Month", value: "free-month" },
            { label: "Upgrade Offer", value: "upgrade" },
            { label: "Custom", value: "custom" },
          ],
        },
      ],
    })

    actions.push({
      id: "export-churn-list",
      title: "Export At-Risk Customers",
      description: "Download a detailed list of customers at risk of churning with their risk scores and recommended actions.",
      icon: "database",
      category: "Data",
      estimatedTime: "30 seconds",
      inputs: [],
    })
  }

  // Data and reporting actions - only show if explicitly discussing reports or data exports
  if (
    (lowerResponse.includes("report") && lowerResponse.includes("schedule")) ||
    (lowerResponse.includes("export") && lowerResponse.includes("data"))
  ) {
    actions.push({
      id: "schedule-report",
      title: "Schedule Automated Report",
      description: "Set up automated delivery of this report to your team on a recurring schedule.",
      icon: "refresh",
      category: "Reporting",
      estimatedTime: "1 minute",
      inputs: [
        {
          name: "frequency",
          label: "Frequency",
          type: "select",
          required: true,
          options: [
            { label: "Daily", value: "daily" },
            { label: "Weekly (Monday)", value: "weekly-mon" },
            { label: "Monthly (1st)", value: "monthly" },
          ],
        },
        {
          name: "email",
          label: "Email Recipients",
          type: "text",
          placeholder: "team@company.com, manager@company.com",
          required: true,
        },
      ],
    })

    actions.push({
      id: "sync-to-warehouse",
      title: "Sync to Data Warehouse",
      description: "Push this analysis and data to your data warehouse for further processing and integration.",
      icon: "database",
      category: "Integration",
      estimatedTime: "2 minutes",
      inputs: [
        {
          name: "warehouse",
          label: "Warehouse",
          type: "select",
          required: true,
          options: [
            { label: "Snowflake", value: "snowflake" },
            { label: "BigQuery", value: "bigquery" },
            { label: "Redshift", value: "redshift" },
          ],
        },
      ],
    })
  }

  // Only offer alerting if explicitly discussing alerts, thresholds, or monitoring
  if (
    (lowerResponse.includes("alert") || lowerResponse.includes("monitor") || lowerResponse.includes("threshold")) &&
    (lowerResponse.match(/\d+(?:\.\d+)?%/) || lowerResponse.match(/\$[\d,]+/))
  ) {
    actions.push({
      id: "create-alert",
      title: "Create Metric Alert",
      description: "Get notified when key metrics cross your defined thresholds.",
      icon: "zap",
      category: "Monitoring",
      estimatedTime: "1 minute",
      inputs: [
        {
          name: "metric",
          label: "Metric to Monitor",
          type: "select",
          required: true,
          options: [
            { label: "Churn Rate", value: "churn-rate" },
            { label: "Conversion Rate", value: "conversion-rate" },
            { label: "ROAS", value: "roas" },
            { label: "Ad Spend", value: "ad-spend" },
          ],
        },
        {
          name: "threshold",
          label: "Alert Threshold",
          type: "number",
          placeholder: "e.g., 10",
          required: true,
        },
        {
          name: "condition",
          label: "Condition",
          type: "select",
          required: true,
          options: [
            { label: "Greater than", value: "gt" },
            { label: "Less than", value: "lt" },
            { label: "Equal to", value: "eq" },
          ],
        },
      ],
    })
  }

  // Only offer export action if there's structured data in the response (tables, lists of accounts/customers)
  if (
    actions.length > 0 &&
    (lowerResponse.includes("account") || lowerResponse.includes("customer") || lowerResponse.includes("|"))
  ) {
    actions.push({
      id: "export-data",
      title: "Export Raw Data",
      description: "Download the underlying data from this analysis in CSV or JSON format.",
      icon: "database",
      category: "Data",
      estimatedTime: "30 seconds",
      inputs: [
        {
          name: "format",
          label: "Export Format",
          type: "select",
          required: true,
          options: [
            { label: "CSV", value: "csv" },
            { label: "JSON", value: "json" },
            { label: "Excel", value: "xlsx" },
          ],
        },
      ],
    })
  }

  return actions
}

/**
 * Get suggested actions based on visualization data
 */
export function generateActionsFromVisualizations(visualizations: any[]): Action[] {
  const actions: Action[] = []

  // If we have visualizations, offer to export them
  if (visualizations.length > 0) {
    actions.push({
      id: "export-visualizations",
      title: "Export All Visualizations",
      description: "Download all charts and visualizations as high-resolution images.",
      icon: "database",
      category: "Export",
      estimatedTime: "1 minute",
      inputs: [
        {
          name: "format",
          label: "Image Format",
          type: "select",
          required: true,
          options: [
            { label: "PNG (Recommended)", value: "png" },
            { label: "JPEG", value: "jpeg" },
            { label: "SVG", value: "svg" },
          ],
        },
      ],
    })
  }

  return actions
}

/**
 * Execute an action (this would connect to your backend in production)
 */
export async function executeAction(
  actionId: string,
  inputs: Record<string, any>
): Promise<{ status: "success" | "error" | "running"; message?: string }> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // In a real app, this would call your backend API
  console.log(`Executing action: ${actionId}`, inputs)

  // Simulate success
  return {
    status: "success",
    message: getSuccessMessage(actionId, inputs),
  }
}

function getSuccessMessage(actionId: string, inputs: Record<string, any>): string {
  switch (actionId) {
    case "optimize-campaign":
      return `Campaign ${inputs.campaignId} has been optimized for ${inputs.optimizationGoal}. Budget allocation updated.`
    case "pause-underperforming":
      return `Paused 12 ads with performance below ${inputs.threshold}%. Estimated savings: $1,240/month.`
    case "create-retention-campaign":
      return `Retention campaign created for ${inputs.segment} segment with ${inputs.incentive} incentive. Targeting 450 customers.`
    case "export-churn-list":
      return "Customer list exported successfully. Download will begin shortly."
    case "schedule-report":
      return `Report scheduled to be sent ${inputs.frequency} to ${inputs.email}.`
    case "sync-to-warehouse":
      return `Data sync initiated to ${inputs.warehouse}. You'll receive a notification when complete.`
    case "create-alert":
      return `Alert created: You'll be notified when ${inputs.metric} ${inputs.condition} ${inputs.threshold}.`
    case "export-data":
      return `Data exported in ${inputs.format} format. Download will begin shortly.`
    case "export-visualizations":
      return `All visualizations exported in ${inputs.format} format.`
    default:
      return "Action completed successfully!"
  }
}
