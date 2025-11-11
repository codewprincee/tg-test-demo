import {
  customers,
  supportTickets,
  getAtRiskCustomers,
  getHighValueCustomers,
  getTicketsByStatus,
  getTicketsByPriority,
  calculateAverageHealthScore,
  calculateTotalMRR,
  calculateAverageChurnRisk,
  regionalData,
  industryData,
  featureAdoptionData,
  usageDataByMonth,
  apiErrorTelemetry,
  getCustomerWithMostAPIErrors,
  productBugs,
  getBugsByComponent,
  customerUsageMetrics,
  getTopUsersByUsage,
  getLowestUsersByUsage,
  customerSentiment,
} from "./demo-data"
import { generateAIStreamFromBackend, generateAIResponseFromBackend } from "./api-client"

export interface AIResponse {
  text: string
  data?: any
}

// Generate context summary from mock data
function getDataContext(): string {
  const totalMRR = calculateTotalMRR()
  const avgHealth = calculateAverageHealthScore()
  const atRisk = getAtRiskCustomers()
  const openTickets = getTicketsByStatus("Open")
  const criticalTickets = getTicketsByPriority("Critical")
  const topAPIErrors = getCustomerWithMostAPIErrors()
  const bugsByComponent = getBugsByComponent()
  const topUsageCustomers = getTopUsersByUsage(5)
  const lowestUsageCustomers = getLowestUsersByUsage(5)

  return `You are an AI Customer Success Assistant for a SaaS platform. Here's the current state of the platform:

**Platform Overview:**
- Total Active Customers: ${customers.length}
- Total MRR: $${(totalMRR / 1000).toFixed(1)}K
- Projected ARR: $${((totalMRR * 12) / 1000000).toFixed(2)}M
- Average Health Score: ${avgHealth}/100
- Average Churn Risk: ${calculateAverageChurnRisk()}%

**Customer Segments:**
- At-Risk Customers: ${atRisk.length} (representing $${(atRisk.reduce((sum, c) => sum + c.mrr, 0) / 1000).toFixed(1)}K MRR)
- Enterprise: ${customers.filter((c) => c.tier === "Enterprise").length}, Mid-Market: ${customers.filter((c) => c.tier === "Mid-Market").length}, SMB: ${customers.filter((c) => c.tier === "SMB").length}

**Top 5 Customers by MRR:**
${customers.sort((a, b) => b.mrr - a.mrr).slice(0, 5).map((c, i) => `${i + 1}. ${c.name} - $${c.mrr.toLocaleString()}/mo (Health: ${c.healthScore}, Churn: ${c.churnRisk}%)`).join("\n")}

**API ERROR TELEMETRY:**
Total accounts experiencing errors: ${apiErrorTelemetry.length}
Top account by errors: ${topAPIErrors.customerName}
- Total Errors: ${topAPIErrors.totalErrors}
- Error Rate: ${topAPIErrors.errorRate}%
- Impact Score: ${topAPIErrors.impactScore}/100
- Trend: ${topAPIErrors.errorTrend}
- Top failing endpoint: ${topAPIErrors.errorsByEndpoint[0].endpoint} (${topAPIErrors.errorsByEndpoint[0].errorCount} errors, ${topAPIErrors.errorsByEndpoint[0].errorRate}% rate)
- Common errors: ${topAPIErrors.errorsByEndpoint[0].commonErrors.join(", ")}

All API error data by customer:
${apiErrorTelemetry.map((e) => `- ${e.customerName}: ${e.totalErrors} total errors (${e.errorRate}% rate), Impact: ${e.impactScore}/100, Trend: ${e.errorTrend}`).join("\n")}

**PRODUCT BUGS & COMPONENT HEALTH:**
Total Active Bugs: ${productBugs.length}
Critical Bugs: ${productBugs.filter((b) => b.severity === "Critical").length}

Bugs by Component (sorted by impact):
${bugsByComponent.map((bc) => `- ${bc.component}: ${bc.bugCount} bugs (${bc.criticalCount} critical)`).join("\n")}

Critical Bugs Details:
${productBugs.filter((b) => b.severity === "Critical").map((b) => `- ${b.component}: ${b.bugTitle} (${b.id})
  Affected: ${b.affectedCustomers.join(", ")}
  Root Cause: ${b.rootCause}
  Status: ${b.status}`).join("\n")}

**USAGE METRICS & ENGAGEMENT:**
Top 5 Customers by Engagement Score:
${topUsageCustomers.map((u, i) => `${i + 1}. ${u.customerName} (Score: ${u.engagementScore}/100)
   - DAU: ${u.dailyActiveUsers}/${u.totalLicenses} licenses (${u.licenseUtilization.toFixed(1)}% utilization)
   - API Calls/Day: ${u.apiCallsPerDay.toLocaleString()}
   - Avg Session: ${u.avgSessionDuration} min
   - Trend: ${u.usageTrend}`).join("\n")}

Lowest 5 Customers by Engagement Score:
${lowestUsageCustomers.map((u, i) => `${i + 1}. ${u.customerName} (Score: ${u.engagementScore}/100)
   - DAU: ${u.dailyActiveUsers}/${u.totalLicenses} licenses (${u.licenseUtilization.toFixed(1)}% utilization)
   - API Calls/Day: ${u.apiCallsPerDay.toLocaleString()}
   - Trend: ${u.usageTrend}`).join("\n")}

**CUSTOMER SENTIMENT:**
${customerSentiment.map((s) => `- ${s.customerName}: ${s.overallSentiment} (Score: ${s.sentimentScore}, NPS: ${s.npsScore})
  Trend: ${s.satisfactionTrend}, Champions: ${s.championUsers}, Detractors: ${s.detractors}
  Latest feedback: "${s.recentFeedback[0].comment}" (${s.recentFeedback[0].channel}, ${s.recentFeedback[0].date})`).join("\n")}

**Support Tickets:**
- Open: ${openTickets.length}, Critical: ${criticalTickets.length}
- Critical ticket customers: ${criticalTickets.map((t) => t.customerName).join(", ")}

**Regional Performance:**
${regionalData.map((r) => `- ${r.region}: ${r.customers} customers, ${r.revenue}, ${r.growth} growth`).join("\n")}

**Feature Adoption:**
${featureAdoptionData.map((f) => `- ${f.feature}: ${f.adoption}%`).join("\n")}

**Growth (6 months):**
- MRR: $${usageDataByMonth[0].mrr}K → $${usageDataByMonth[5].mrr}K (+${(((usageDataByMonth[5].mrr - usageDataByMonth[0].mrr) / usageDataByMonth[0].mrr) * 100).toFixed(1)}%)
- DAU: ${usageDataByMonth[0].dau} → ${usageDataByMonth[5].dau}

**Response Guidelines:**
1. Use actual data and customer names from above
2. Be specific with metrics and numbers
3. Provide actionable insights and recommendations
4. Use markdown formatting (**bold**, bullet points, sections with ALL CAPS headers)
5. Structure responses with clear sections (e.g., "OVERVIEW", "KEY METRICS", "RECOMMENDED ACTIONS")
6. Include specific customer names, dates, and ticket IDs when relevant
7. Provide root cause analysis when discussing issues
8. Always end with actionable next steps or recommendations
9. Use professional CS language (Health Score, MRR, Churn Risk, NPS, etc.)
10. Keep responses comprehensive but focused (200-300 words max)

**Example Response Format:**
"CUSTOMER HEALTH OVERVIEW

Current Status: [Brief summary]

KEY METRICS:
• Total MRR: $XXK
• Average Health Score: XX/100
• At-Risk Customers: X accounts

TOP PERFORMING ACCOUNTS:
1. [Customer Name] - Health: XX/100, MRR: $XX
   Key Factors: [Brief explanation]

AT-RISK ACCOUNTS:
1. [Customer Name] (Health: XX/100)
   Primary Concern: [Issue]
   Action Required: [Next step]

RECOMMENDED ACTIONS:
• [Specific action 1]
• [Specific action 2]"

Match this professional, structured style in all responses.`
}

// Generate AI response using backend API with streaming
async function* generateGeminiResponseStream(userQuery: string): AsyncGenerator<string> {
  try {
    const context = getDataContext()

    // Use backend API instead of direct Gemini call
    for await (const chunk of generateAIStreamFromBackend(userQuery, context)) {
      yield chunk
    }
  } catch (error) {
    console.error("Backend API Error:", error)
    yield ""
  }
}

// Generate AI response using backend API (non-streaming fallback)
async function generateGeminiResponse(userQuery: string): Promise<string> {
  try {
    const context = getDataContext()

    // Use backend API instead of direct Gemini call
    return await generateAIResponseFromBackend(userQuery, context)
  } catch (error) {
    console.error("Backend API Error:", error)
    return ""
  }
}

function detectQuery(input: string): string {
  const lower = input.toLowerCase()

  // Customer health queries
  if (lower.includes("health") && (lower.includes("score") || lower.includes("customer"))) {
    return "customer-health"
  }
  if (lower.includes("at risk") || lower.includes("churn")) {
    return "at-risk"
  }

  // Support ticket queries
  if (lower.includes("ticket") || lower.includes("support")) {
    return "support-tickets"
  }

  // Revenue queries
  if (lower.includes("revenue") || lower.includes("mrr") || lower.includes("income")) {
    return "revenue"
  }

  // Usage queries
  if (lower.includes("usage") || lower.includes("active user") || lower.includes("dau") || lower.includes("mau")) {
    return "usage"
  }

  // Regional queries
  if (lower.includes("region") || lower.includes("geographic") || lower.includes("location")) {
    return "regional"
  }

  // Industry queries
  if (lower.includes("industry") || lower.includes("sector") || lower.includes("vertical")) {
    return "industry"
  }

  // Feature adoption queries
  if (lower.includes("feature") || lower.includes("adoption")) {
    return "feature-adoption"
  }

  // High value customers
  if (lower.includes("high value") || lower.includes("enterprise") || lower.includes("top customer")) {
    return "high-value"
  }

  // Growth queries
  if (lower.includes("growth") || lower.includes("trend")) {
    return "growth"
  }

  return "general"
}

// Export streaming function
export { generateGeminiResponseStream }

export async function generateChatResponse(input: string): Promise<AIResponse> {
  // Try Gemini API first
  const geminiResponse = await generateGeminiResponse(input)
  if (geminiResponse) {
    return {
      text: geminiResponse,
      data: null,
    }
  }

  // Fallback to mock responses if Gemini fails
  const queryType = detectQuery(input)

  switch (queryType) {
    case "customer-health":
      const avgHealth = calculateAverageHealthScore()
      const healthyCount = customers.filter((c) => c.healthScore >= 80).length
      const needsAttention = customers.filter((c) => c.healthScore < 60).length
      return {
        text: `Based on the latest data across all ${customers.length} customers:\n\n**Overall Health: ${avgHealth}/100** 🟢\n\n• **${healthyCount} customers** have excellent health scores (80+)\n• **${needsAttention} customers** need immediate attention (below 60)\n• Average NPS score: **74**\n\nTop performing accounts:\n1. **${customers.find((c) => c.healthScore === Math.max(...customers.map((c) => c.healthScore)))?.name}** - Health Score: ${Math.max(...customers.map((c) => c.healthScore))}\n2. **EduLearn Platform** - Health Score: 95\n3. **TechCorp Solutions** - Health Score: 92\n\nWould you like me to dive deeper into any specific segment?`,
        data: { avgHealth, healthyCount, needsAttention },
      }

    case "at-risk":
      const atRisk = getAtRiskCustomers()
      const topRisks = atRisk.sort((a, b) => b.churnRisk - a.churnRisk).slice(0, 3)
      return {
        text: `**⚠️ Churn Risk Analysis**\n\nCurrently tracking **${atRisk.length} at-risk customers** representing **$${(atRisk.reduce((sum, c) => sum + c.mrr, 0) / 1000).toFixed(1)}K MRR**.\n\n**Critical attention needed:**\n${topRisks
          .map(
            (c, i) =>
              `${i + 1}. **${c.name}**\n   • Churn Risk: ${c.churnRisk}%\n   • Health Score: ${c.healthScore}\n   • MRR: $${c.mrr.toLocaleString()}\n   • Issue: ${c.supportTickets.open} open tickets, last activity ${new Date(c.lastActivityDate).toLocaleDateString()}`,
          )
          .join("\n\n")}\n\n**Recommended Actions:**\n• Schedule executive business reviews with top 3 at-risk accounts\n• Analyze feature adoption gaps\n• Review and expedite open support tickets`,
        data: { atRisk: topRisks },
      }

    case "support-tickets":
      const openTickets = getTicketsByStatus("Open")
      const criticalTickets = getTicketsByPriority("Critical")
      const highTickets = getTicketsByPriority("High")
      return {
        text: `**📋 Support Ticket Overview**\n\n• **${openTickets.length} open tickets** requiring attention\n• **${criticalTickets.length} critical** priority tickets\n• **${highTickets.length} high** priority tickets\n• Average response time: **3.8 hours**\n\n**Critical Tickets:**\n${criticalTickets
          .map(
            (t) =>
              `• **${t.customerName}**: ${t.subject}\n  Status: ${t.status} | Assigned to: ${t.assignedTo}`,
          )
          .join("\n")}\n\n**Recommendation:** Focus on resolving the 2 critical tickets from HealthPlus Medical and Legal Partners LLP to prevent escalation.`,
        data: { openTickets, criticalTickets },
      }

    case "revenue":
      const totalMRR = calculateTotalMRR()
      const topRevenue = customers.sort((a, b) => b.mrr - a.mrr).slice(0, 5)
      return {
        text: `**💰 Revenue Metrics**\n\n**Total MRR: $${(totalMRR / 1000).toFixed(1)}K**\n**Projected ARR: $${((totalMRR * 12) / 1000000).toFixed(2)}M**\n\n**Top 5 Revenue Contributors:**\n${topRevenue
          .map(
            (c, i) =>
              `${i + 1}. ${c.name} - $${c.mrr.toLocaleString()}/mo (${c.tier})`,
          )
          .join("\n")}\n\n**Month-over-Month Growth:**\n• May → Oct: **+30.8%** MRR growth\n• New customer acquisition: **120 customers** in last 6 months\n• Expansion revenue: **$47K** from upsells\n\nRevenue is trending positively with strong growth in Enterprise segment.`,
        data: { totalMRR, topRevenue },
      }

    case "usage":
      const latestUsage = usageDataByMonth[usageDataByMonth.length - 1]
      const previousUsage = usageDataByMonth[usageDataByMonth.length - 2]
      const growth = (((latestUsage.dau - previousUsage.dau) / previousUsage.dau) * 100).toFixed(1)
      return {
        text: `**📊 Usage Analytics (Last 30 Days)**\n\n• **Daily Active Users:** ${latestUsage.dau.toLocaleString()} (↑${growth}% from last month)\n• **API Calls:** ${latestUsage.apiCalls.toLocaleString()}/day\n• **Feature Adoption:** 76% average across all features\n\n**Trending Features:**\n${featureAdoptionData
          .sort((a, b) => b.adoption - a.adoption)
          .slice(0, 3)
          .map((f) => `• **${f.feature}**: ${f.adoption}% adoption (${f.users.toLocaleString()} users)`)
          .join("\n")}\n\n**Growth Opportunity:** Mobile App adoption is at 45% - consider a targeted campaign to increase mobile engagement.`,
        data: { latestUsage, featureAdoptionData },
      }

    case "regional":
      return {
        text: `**🌍 Regional Performance Analysis**\n\n${regionalData
          .map(
            (r) =>
              `**${r.region}**\n• Customers: ${r.customers}\n• Revenue: ${r.revenue}\n• Growth: ${r.growth}\n• Health Score: ${r.healthScore}\n• Churn Rate: ${r.churnRate}`,
          )
          .join("\n\n")}\n\n**Key Insights:**\n• Asia Pacific shows highest growth (+18.2%) but also highest churn (15.8%)\n• North America remains most stable with strong health scores\n• Middle East emerging market with exceptional growth (+22.1%)`,
        data: { regionalData },
      }

    case "industry":
      return {
        text: `**🏭 Industry Breakdown**\n\n${industryData
          .map(
            (i) =>
              `**${i.industry}**\n• Customers: ${i.customers}\n• Avg MRR: $${i.avgMrr.toLocaleString()}\n• Health Score: ${i.healthScore}\n• Churn Risk: ${i.churnRisk}%`,
          )
          .join("\n\n")}\n\n**Strategic Insights:**\n• Education sector has highest satisfaction (92 health score)\n• Financial Services commands highest ARPU ($22.4K)\n• Healthcare needs attention (18% churn risk)`,
        data: { industryData },
      }

    case "feature-adoption":
      return {
        text: `**🎯 Feature Adoption Analysis**\n\n${featureAdoptionData
          .map((f) => `• **${f.feature}**: ${f.adoption}% (${f.users.toLocaleString()} active users)`)
          .join("\n")}\n\n**Recommendations:**\n• **Mobile App** (45%) - Launch in-app tutorial campaign\n• **Automated Workflows** (68%) - Create video tutorials\n• Strong adoption on core features indicates good product-market fit`,
        data: { featureAdoptionData },
      }

    case "high-value":
      const highValue = getHighValueCustomers()
      return {
        text: `**⭐ High-Value Customer Analysis**\n\n**${highValue.length} Enterprise accounts** contributing **$${(highValue.reduce((sum, c) => sum + c.mrr, 0) / 1000).toFixed(1)}K MRR** (${((highValue.reduce((sum, c) => sum + c.mrr, 0) / calculateTotalMRR()) * 100).toFixed(1)}% of total)\n\n**Top Accounts:**\n${highValue
          .sort((a, b) => b.mrr - a.mrr)
          .slice(0, 5)
          .map(
            (c, i) =>
              `${i + 1}. **${c.name}**\n   • MRR: $${c.mrr.toLocaleString()}\n   • Health: ${c.healthScore}/100\n   • Expansion Opportunity: ${c.expansionOpportunity}%`,
          )
          .join("\n\n")}\n\nThese accounts represent significant expansion opportunities worth pursuing with dedicated CSM engagement.`,
        data: { highValue },
      }

    case "growth":
      const revenueGrowth =
        ((usageDataByMonth[5].mrr - usageDataByMonth[0].mrr) / usageDataByMonth[0].mrr) * 100
      return {
        text: `**📈 Growth Trends (Last 6 Months)**\n\n**Revenue Growth:**\n• MRR: **+${revenueGrowth.toFixed(1)}%** ($185K → $242K)\n• New Customers: **${usageDataByMonth.reduce((sum, m) => sum + m.newCustomers, 0)}** total\n• Customer Growth: **+27.4%**\n\n**User Engagement:**\n• DAU Growth: **+36.2%** (1,850 → 2,520)\n• API Usage: **+40.8%**\n\n**Churn Improvement:**\n• Reduced from 12.5% to 8.3% (-33.6% improvement)\n\n**Forecast:** At current growth rate, projected to reach $300K MRR by Q1 2026.`,
        data: { usageDataByMonth },
      }

    default:
      return {
        text: `I'm analyzing your customer success data across ${customers.length} accounts with **$${(calculateTotalMRR() / 1000).toFixed(1)}K MRR**.\n\nI can help you with:\n• Customer health scores and at-risk analysis\n• Support ticket management and priorities\n• Revenue metrics and growth trends\n• Usage analytics and feature adoption\n• Regional and industry performance\n• Actionable insights and recommendations\n\nWhat specific insights would you like to explore?`,
      }
  }
}

export function generateVisualizationResponse(input: string): AIResponse {
  const lower = input.toLowerCase()

  if (lower.includes("churn") || lower.includes("region")) {
    return {
      text: "I've created a Customer Churn Rate by Region visualization. The data shows:\n\n• **Asia Pacific** has the highest churn at 15.8% but also shows strong growth potential\n• **North America** maintains healthy 8.5% churn with largest customer base\n• **Middle East** emerging market with lowest churn at 9.5%\n\nYou can toggle between table, line, bar, and pie chart views to explore different perspectives of this data.",
      data: regionalData,
    }
  }

  if (lower.includes("revenue") || lower.includes("growth")) {
    return {
      text: "I've generated a Revenue Growth Over Time visualization showing:\n\n• **30.8% MRR growth** over the last 6 months\n• Steady upward trajectory from $185K to $242K\n• New customer acquisition accelerating (12 → 28 per month)\n\nThe visualization supports multiple chart types for different analytical views.",
      data: usageDataByMonth,
    }
  }

  if (lower.includes("industry") || lower.includes("sector")) {
    return {
      text: "I've created an Industry Performance Dashboard showing:\n\n• **Technology** leads with 245 customers\n• **Financial Services** highest ARPU at $22.4K\n• **Education** best health scores (92 average)\n• **Healthcare** needs attention (18% churn risk)\n\nSwitch between visualization types to identify trends and opportunities.",
      data: industryData,
    }
  }

  if (lower.includes("feature") || lower.includes("adoption")) {
    return {
      text: "I've visualized Feature Adoption Rates across your platform:\n\n• **Analytics Dashboard** leads at 92% adoption\n• **Mobile App** represents growth opportunity at 45%\n• **API Integration** strong at 85%\n\nThe data helps identify which features drive engagement and where training may be needed.",
      data: featureAdoptionData,
    }
  }

  return {
    text: "I've created the metric visualization based on your request. You can switch between different chart types (table, line, bar, pie) using the visualization selector on the right panel to find the most insightful view for your analysis.",
    data: regionalData,
  }
}

export function generateAgentResponse(input: string): AIResponse {
  const lower = input.toLowerCase()

  if (lower.includes("email") || lower.includes("follow up") || lower.includes("contact")) {
    const atRisk = getAtRiskCustomers()
    return {
      text: `**✅ Agent Task: Customer Outreach Campaign**\n\nI'll execute the following workflow:\n\n**Phase 1: Identify Recipients** ✓\n• Found **${atRisk.length} at-risk customers**\n• Segmented by risk level and last contact date\n\n**Phase 2: Personalized Email Generation** (In Progress)\n• Creating custom messages for each account\n• Including specific health metrics and action items\n• Highlighting unused features and value opportunities\n\n**Phase 3: Schedule & Send** (Pending)\n• Queue emails for optimal send times\n• Set up automated follow-up sequences\n• Track open rates and responses\n\n**Draft Preview (HealthPlus Medical):**\n"Hi [Contact], I noticed your team's usage has decreased by 35% over the past month. I'd love to schedule a quick call to discuss how we can better support your workflows and explore our new HIPAA-compliant features that might help..."\n\nWould you like me to proceed with sending these emails?`,
      data: { recipients: atRisk.length, type: "email-campaign" },
    }
  }

  if (lower.includes("ticket") || lower.includes("prioritize") || lower.includes("support")) {
    const critical = getTicketsByPriority("Critical")
    const high = getTicketsByPriority("High")
    return {
      text: `**✅ Agent Task: Support Ticket Prioritization & Assignment**\n\n**Analysis Complete:**\n• **${critical.length} Critical** tickets requiring immediate attention\n• **${high.length} High** priority tickets\n• Identified **2 customers** at risk due to slow response times\n\n**Automated Actions Taken:**\n\n1. **Escalated to Senior Support:**\n   • Legal Partners LLP - Dashboard loading bug\n   • HealthPlus Medical - HIPAA integration issue\n\n2. **Assigned Additional Resources:**\n   • Added technical specialist to Global Finance Corp API issue\n   • Scheduled customer success manager check-in for all critical tickets\n\n3. **Created Response Templates:**\n   • Generated personalized responses for each ticket\n   • Set up automated status updates\n\n**Next Actions:**\n• Monitor resolution progress\n• Schedule follow-up calls within 24 hours\n• Update customers on expected resolution timelines\n\nSupport team has been notified and tickets are being actively worked on.`,
      data: { critical: critical.length, high: high.length, type: "ticket-management" },
    }
  }

  if (lower.includes("report") || lower.includes("dashboard") || lower.includes("executive")) {
    return {
      text: `**✅ Agent Task: Executive Report Generation**\n\n**Creating Comprehensive Executive Summary...**\n\n**Report Sections Generated:**\n\n📊 **Executive Summary** ✓\n• Current MRR: $${(calculateTotalMRR() / 1000).toFixed(1)}K (+30.8% growth)\n• Customer Health: ${calculateAverageHealthScore()}/100 average\n• Churn Rate: ${calculateAverageChurnRisk()}% (improving trend)\n\n⚠️ **Risk Assessment** ✓\n• ${getAtRiskCustomers().length} accounts requiring immediate attention\n• At-risk revenue: $${(getAtRiskCustomers().reduce((sum, c) => sum + c.mrr, 0) / 1000).toFixed(1)}K MRR\n\n💡 **Opportunities** ✓\n• $${(getHighValueCustomers().filter((c) => c.expansionOpportunity > 70).reduce((sum, c) => sum + c.mrr, 0) * 0.3 / 1000).toFixed(1)}K expansion revenue potential\n• 5 accounts ready for upsell conversations\n\n📈 **Growth Metrics** ✓\n• User engagement up 36.2%\n• Feature adoption improving across all segments\n• NPS score: 74 (industry leading)\n\n**Report Status:** Ready for distribution\n**Format:** PDF + Interactive Dashboard\n**Recipients:** Executive team, CS leadership\n\nWould you like me to schedule this report for weekly automated delivery?`,
      data: { type: "executive-report" },
    }
  }

  if (lower.includes("onboard") || lower.includes("training") || lower.includes("setup")) {
    return {
      text: `**✅ Agent Task: Automated Onboarding Workflow**\n\n**Analyzing New Customer: StartupGrow** ✓\n\n**Onboarding Plan Created:**\n\n**Week 1: Foundation** (Current)\n• ✓ Welcome email sent\n• ✓ Initial setup call scheduled (Nov 12)\n• ⏳ Platform walkthrough video assigned\n• ⏳ Feature activation checklist sent\n\n**Week 2: Engagement**\n• Schedule hands-on training session\n• Introduce account manager (Lisa Anderson)\n• Enable key integrations\n• Set up first automated workflow\n\n**Week 3: Optimization**\n• Review usage analytics\n• Identify power users\n• Custom dashboard configuration\n• Schedule stakeholder check-in\n\n**Week 4: Success Milestone**\n• Measure initial ROI\n• Gather feedback (NPS survey)\n• Plan expansion opportunities\n• Transition to ongoing support\n\n**Automated Triggers Set:**\n• Daily usage monitoring\n• Feature adoption tracking\n• Early warning for disengagement\n• Automated tip emails based on behavior\n\nOnboarding success rate typically 87% with this workflow.`,
      data: { customer: "StartupGrow", type: "onboarding" },
    }
  }

  if (lower.includes("integrate") || lower.includes("sync") || lower.includes("connect")) {
    return {
      text: `**✅ Agent Task: Data Integration & Sync**\n\n**Scanning Connected Systems...** ✓\n\n**Active Integrations:**\n• ✅ **Salesforce** - 2,840 customer records synced\n• ✅ **Zendesk** - ${supportTickets.length} support tickets imported\n• ⚠️ **Gmail** - Pending configuration\n\n**Automated Actions:**\n\n1. **Data Synchronization** (Every 15 minutes)\n   • Customer records updated\n   • Support tickets refreshed\n   • Usage metrics aggregated\n\n2. **Smart Enrichment**\n   • Added firmographic data from LinkedIn\n   • Updated contact information\n   • Identified decision makers\n\n3. **Workflow Automation**\n   • New tickets → Auto-assign by priority\n   • Health score changes → Alert account manager\n   • Contract renewals → Create task 60 days out\n\n**Integration Health:**\n• API calls: 125,840/day (within limits)\n• Sync latency: 1.2 minutes average\n• Error rate: 0.03% (excellent)\n\n**Recommendation:** Enable Gmail integration to capture email engagement metrics and automate outreach tracking.`,
      data: { integrations: 2, active: true, type: "integration" },
    }
  }

  return {
    text: `**✅ Agent Mode Activated**\n\nI can execute automated workflows and take action across your customer success platform:\n\n**Available Actions:**\n• 📧 **Customer Outreach** - Send personalized follow-up emails\n• 🎫 **Ticket Management** - Prioritize and assign support tickets\n• 📊 **Report Generation** - Create executive summaries and dashboards\n• 🎯 **Onboarding Automation** - Set up new customer workflows\n• 🔄 **Data Integration** - Sync across Salesforce, Zendesk, and more\n• ⚠️ **Risk Mitigation** - Automated interventions for at-risk accounts\n• 💰 **Upsell Identification** - Find expansion opportunities\n\nWhat workflow would you like me to execute? Just describe what you need done, and I'll handle the automation.`,
  }
}
