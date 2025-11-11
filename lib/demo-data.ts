export interface Customer {
  id: string
  name: string
  accountManager: string
  tier: "Enterprise" | "Mid-Market" | "SMB"
  status: "Active" | "At Risk" | "Churned" | "Onboarding"
  healthScore: number
  mrr: number
  totalRevenue: number
  employeeCount: number
  industry: string
  location: string
  contractStartDate: string
  contractEndDate: string
  lastActivityDate: string
  nps: number
  usageMetrics: {
    dailyActiveUsers: number
    monthlyActiveUsers: number
    apiCallsPerDay: number
    featureAdoption: number
  }
  supportTickets: {
    open: number
    closed: number
    avgResponseTime: number
  }
  churnRisk: number
  expansionOpportunity: number
}

export interface SupportTicket {
  id: string
  customerId: string
  customerName: string
  subject: string
  status: "Open" | "In Progress" | "Resolved" | "Closed"
  priority: "Critical" | "High" | "Medium" | "Low"
  category: "Technical" | "Billing" | "Feature Request" | "Bug" | "Question"
  createdAt: string
  updatedAt: string
  assignedTo: string
  responseTime: number
  resolutionTime?: number
}

export interface UsageData {
  date: string
  dailyActiveUsers: number
  apiCalls: number
  featureUsage: {
    analytics: number
    reports: number
    integrations: number
    automation: number
  }
}

export const customers: Customer[] = [
  {
    id: "cust-001",
    name: "TechCorp Solutions",
    accountManager: "Sarah Johnson",
    tier: "Enterprise",
    status: "Active",
    healthScore: 92,
    mrr: 12500,
    totalRevenue: 150000,
    employeeCount: 850,
    industry: "Technology",
    location: "San Francisco, CA",
    contractStartDate: "2023-01-15",
    contractEndDate: "2025-01-14",
    lastActivityDate: "2025-11-10",
    nps: 85,
    usageMetrics: {
      dailyActiveUsers: 245,
      monthlyActiveUsers: 680,
      apiCallsPerDay: 15420,
      featureAdoption: 88,
    },
    supportTickets: {
      open: 2,
      closed: 45,
      avgResponseTime: 2.3,
    },
    churnRisk: 8,
    expansionOpportunity: 85,
  },
  {
    id: "cust-002",
    name: "Global Finance Corp",
    accountManager: "Michael Chen",
    tier: "Enterprise",
    status: "Active",
    healthScore: 78,
    mrr: 18900,
    totalRevenue: 227000,
    employeeCount: 1250,
    industry: "Financial Services",
    location: "New York, NY",
    contractStartDate: "2022-08-01",
    contractEndDate: "2024-12-31",
    lastActivityDate: "2025-11-09",
    nps: 72,
    usageMetrics: {
      dailyActiveUsers: 320,
      monthlyActiveUsers: 950,
      apiCallsPerDay: 22340,
      featureAdoption: 75,
    },
    supportTickets: {
      open: 5,
      closed: 78,
      avgResponseTime: 4.1,
    },
    churnRisk: 35,
    expansionOpportunity: 60,
  },
  {
    id: "cust-003",
    name: "HealthPlus Medical",
    accountManager: "Emily Rodriguez",
    tier: "Mid-Market",
    status: "At Risk",
    healthScore: 54,
    mrr: 4200,
    totalRevenue: 50400,
    employeeCount: 320,
    industry: "Healthcare",
    location: "Boston, MA",
    contractStartDate: "2023-06-10",
    contractEndDate: "2025-06-09",
    lastActivityDate: "2025-10-28",
    nps: 45,
    usageMetrics: {
      dailyActiveUsers: 45,
      monthlyActiveUsers: 180,
      apiCallsPerDay: 2150,
      featureAdoption: 42,
    },
    supportTickets: {
      open: 8,
      closed: 34,
      avgResponseTime: 8.5,
    },
    churnRisk: 72,
    expansionOpportunity: 25,
  },
  {
    id: "cust-004",
    name: "RetailMax Inc",
    accountManager: "David Kim",
    tier: "Mid-Market",
    status: "Active",
    healthScore: 88,
    mrr: 5800,
    totalRevenue: 69600,
    employeeCount: 450,
    industry: "Retail",
    location: "Chicago, IL",
    contractStartDate: "2023-03-20",
    contractEndDate: "2025-03-19",
    lastActivityDate: "2025-11-11",
    nps: 80,
    usageMetrics: {
      dailyActiveUsers: 125,
      monthlyActiveUsers: 380,
      apiCallsPerDay: 8920,
      featureAdoption: 82,
    },
    supportTickets: {
      open: 1,
      closed: 52,
      avgResponseTime: 2.8,
    },
    churnRisk: 12,
    expansionOpportunity: 78,
  },
  {
    id: "cust-005",
    name: "EduLearn Platform",
    accountManager: "Jessica Wang",
    tier: "SMB",
    status: "Active",
    healthScore: 95,
    mrr: 1200,
    totalRevenue: 14400,
    employeeCount: 85,
    industry: "Education",
    location: "Austin, TX",
    contractStartDate: "2024-01-05",
    contractEndDate: "2026-01-04",
    lastActivityDate: "2025-11-11",
    nps: 92,
    usageMetrics: {
      dailyActiveUsers: 68,
      monthlyActiveUsers: 75,
      apiCallsPerDay: 3450,
      featureAdoption: 95,
    },
    supportTickets: {
      open: 0,
      closed: 12,
      avgResponseTime: 1.5,
    },
    churnRisk: 5,
    expansionOpportunity: 90,
  },
  {
    id: "cust-006",
    name: "Manufacturing Pro",
    accountManager: "Robert Taylor",
    tier: "Enterprise",
    status: "Active",
    healthScore: 82,
    mrr: 15600,
    totalRevenue: 187200,
    employeeCount: 1800,
    industry: "Manufacturing",
    location: "Detroit, MI",
    contractStartDate: "2022-11-12",
    contractEndDate: "2025-11-11",
    lastActivityDate: "2025-11-10",
    nps: 78,
    usageMetrics: {
      dailyActiveUsers: 420,
      monthlyActiveUsers: 1450,
      apiCallsPerDay: 18760,
      featureAdoption: 78,
    },
    supportTickets: {
      open: 3,
      closed: 95,
      avgResponseTime: 3.2,
    },
    churnRisk: 18,
    expansionOpportunity: 72,
  },
  {
    id: "cust-007",
    name: "StartupGrow",
    accountManager: "Lisa Anderson",
    tier: "SMB",
    status: "Onboarding",
    healthScore: 68,
    mrr: 890,
    totalRevenue: 890,
    employeeCount: 35,
    industry: "Technology",
    location: "Seattle, WA",
    contractStartDate: "2025-10-01",
    contractEndDate: "2026-09-30",
    lastActivityDate: "2025-11-11",
    nps: 0,
    usageMetrics: {
      dailyActiveUsers: 12,
      monthlyActiveUsers: 28,
      apiCallsPerDay: 450,
      featureAdoption: 35,
    },
    supportTickets: {
      open: 4,
      closed: 2,
      avgResponseTime: 6.2,
    },
    churnRisk: 45,
    expansionOpportunity: 65,
  },
  {
    id: "cust-008",
    name: "Legal Partners LLP",
    accountManager: "Amanda Brooks",
    tier: "Mid-Market",
    status: "At Risk",
    healthScore: 48,
    mrr: 3400,
    totalRevenue: 40800,
    employeeCount: 180,
    industry: "Legal Services",
    location: "Washington, DC",
    contractStartDate: "2023-04-15",
    contractEndDate: "2025-04-14",
    lastActivityDate: "2025-10-15",
    nps: 38,
    usageMetrics: {
      dailyActiveUsers: 22,
      monthlyActiveUsers: 95,
      apiCallsPerDay: 980,
      featureAdoption: 38,
    },
    supportTickets: {
      open: 12,
      closed: 28,
      avgResponseTime: 12.5,
    },
    churnRisk: 85,
    expansionOpportunity: 15,
  },
  {
    id: "cust-009",
    name: "CloudSync Technologies",
    accountManager: "James Martinez",
    tier: "Enterprise",
    status: "Active",
    healthScore: 90,
    mrr: 22000,
    totalRevenue: 264000,
    employeeCount: 2200,
    industry: "Technology",
    location: "San Jose, CA",
    contractStartDate: "2022-05-20",
    contractEndDate: "2025-05-19",
    lastActivityDate: "2025-11-11",
    nps: 88,
    usageMetrics: {
      dailyActiveUsers: 580,
      monthlyActiveUsers: 1850,
      apiCallsPerDay: 32450,
      featureAdoption: 92,
    },
    supportTickets: {
      open: 2,
      closed: 128,
      avgResponseTime: 1.8,
    },
    churnRisk: 7,
    expansionOpportunity: 88,
  },
  {
    id: "cust-010",
    name: "ConsumerGoods Plus",
    accountManager: "Nina Patel",
    tier: "Mid-Market",
    status: "Active",
    healthScore: 75,
    mrr: 6200,
    totalRevenue: 74400,
    employeeCount: 520,
    industry: "Consumer Goods",
    location: "Los Angeles, CA",
    contractStartDate: "2023-09-01",
    contractEndDate: "2025-08-31",
    lastActivityDate: "2025-11-08",
    nps: 68,
    usageMetrics: {
      dailyActiveUsers: 145,
      monthlyActiveUsers: 420,
      apiCallsPerDay: 6840,
      featureAdoption: 72,
    },
    supportTickets: {
      open: 3,
      closed: 48,
      avgResponseTime: 4.5,
    },
    churnRisk: 28,
    expansionOpportunity: 55,
  },
]

export const supportTickets: SupportTicket[] = [
  {
    id: "ticket-001",
    customerId: "cust-002",
    customerName: "Global Finance Corp",
    subject: "API rate limit errors during peak hours",
    status: "In Progress",
    priority: "High",
    category: "Technical",
    createdAt: "2025-11-09 09:30:00",
    updatedAt: "2025-11-10 14:22:00",
    assignedTo: "Tech Support - Alex",
    responseTime: 2.5,
  },
  {
    id: "ticket-002",
    customerId: "cust-003",
    customerName: "HealthPlus Medical",
    subject: "Integration with existing HIPAA-compliant systems",
    status: "Open",
    priority: "Critical",
    category: "Technical",
    createdAt: "2025-11-08 11:15:00",
    updatedAt: "2025-11-08 11:15:00",
    assignedTo: "Tech Support - Maria",
    responseTime: 0,
  },
  {
    id: "ticket-003",
    customerId: "cust-003",
    customerName: "HealthPlus Medical",
    subject: "Need training session for new team members",
    status: "Open",
    priority: "Medium",
    category: "Question",
    createdAt: "2025-11-07 10:20:00",
    updatedAt: "2025-11-07 15:40:00",
    assignedTo: "Customer Success - Tom",
    responseTime: 5.3,
  },
  {
    id: "ticket-004",
    customerId: "cust-007",
    customerName: "StartupGrow",
    subject: "How to set up automated workflows?",
    status: "In Progress",
    priority: "Medium",
    category: "Question",
    createdAt: "2025-11-10 08:00:00",
    updatedAt: "2025-11-10 10:30:00",
    assignedTo: "Onboarding - Sarah",
    responseTime: 2.5,
  },
  {
    id: "ticket-005",
    customerId: "cust-008",
    customerName: "Legal Partners LLP",
    subject: "Billing discrepancy on last invoice",
    status: "Open",
    priority: "High",
    category: "Billing",
    createdAt: "2025-11-11 07:45:00",
    updatedAt: "2025-11-11 07:45:00",
    assignedTo: "Billing - Rachel",
    responseTime: 0,
  },
  {
    id: "ticket-006",
    customerId: "cust-001",
    customerName: "TechCorp Solutions",
    subject: "Request for custom reporting feature",
    status: "In Progress",
    priority: "Low",
    category: "Feature Request",
    createdAt: "2025-11-05 14:20:00",
    updatedAt: "2025-11-09 16:10:00",
    assignedTo: "Product Team - Kevin",
    responseTime: 8.5,
  },
  {
    id: "ticket-007",
    customerId: "cust-008",
    customerName: "Legal Partners LLP",
    subject: "Dashboard not loading properly",
    status: "Open",
    priority: "Critical",
    category: "Bug",
    createdAt: "2025-11-10 16:30:00",
    updatedAt: "2025-11-10 16:30:00",
    assignedTo: "Tech Support - Lisa",
    responseTime: 0,
  },
]

export const usageDataByMonth = [
  { month: "May", dau: 1850, apiCalls: 89420, churnRate: 12.5, mrr: 185000, newCustomers: 12 },
  { month: "Jun", dau: 1920, apiCalls: 94230, churnRate: 11.8, mrr: 192000, newCustomers: 15 },
  { month: "Jul", dau: 2100, apiCalls: 102340, churnRate: 13.2, mrr: 198000, newCustomers: 18 },
  { month: "Aug", dau: 2250, apiCalls: 110250, churnRate: 10.5, mrr: 208000, newCustomers: 22 },
  { month: "Sep", dau: 2380, apiCalls: 118650, churnRate: 9.8, mrr: 225000, newCustomers: 25 },
  { month: "Oct", dau: 2520, apiCalls: 125840, churnRate: 8.3, mrr: 242000, newCustomers: 28 },
]

export const regionalData = [
  {
    region: "North America",
    churnRate: "8.5%",
    customers: 1450,
    revenue: "$3.2M",
    growth: "+12.5%",
    healthScore: 82,
  },
  { region: "Europe", churnRate: "10.2%", customers: 980, revenue: "$2.1M", growth: "+8.3%", healthScore: 78 },
  {
    region: "Asia Pacific",
    churnRate: "15.8%",
    customers: 720,
    revenue: "$1.5M",
    growth: "+18.2%",
    healthScore: 72,
  },
  {
    region: "Latin America",
    churnRate: "12.1%",
    customers: 450,
    revenue: "$920K",
    growth: "+15.7%",
    healthScore: 75,
  },
  { region: "Middle East", churnRate: "9.5%", customers: 280, revenue: "$680K", growth: "+22.1%", healthScore: 80 },
]

export const industryData = [
  { industry: "Technology", customers: 245, avgMrr: 15800, healthScore: 88, churnRisk: 8 },
  { industry: "Financial Services", customers: 182, avgMrr: 22400, healthScore: 82, churnRisk: 12 },
  { industry: "Healthcare", customers: 156, avgMrr: 12200, healthScore: 76, churnRisk: 18 },
  { industry: "Retail", customers: 198, avgMrr: 8900, healthScore: 85, churnRisk: 10 },
  { industry: "Manufacturing", customers: 134, avgMrr: 18600, healthScore: 80, churnRisk: 14 },
  { industry: "Education", customers: 89, avgMrr: 4200, healthScore: 92, churnRisk: 5 },
]

export const featureAdoptionData = [
  { feature: "Analytics Dashboard", adoption: 92, users: 2850 },
  { feature: "Custom Reports", adoption: 78, users: 2420 },
  { feature: "API Integration", adoption: 85, users: 2635 },
  { feature: "Automated Workflows", adoption: 68, users: 2108 },
  { feature: "Team Collaboration", adoption: 88, users: 2728 },
  { feature: "Mobile App", adoption: 45, users: 1395 },
]

export const npsData = [
  { score: "Promoters (9-10)", count: 1850, percentage: 58 },
  { score: "Passives (7-8)", count: 950, percentage: 30 },
  { score: "Detractors (0-6)", count: 380, percentage: 12 },
]

export const customerHealthTrends = [
  { week: "Week 1", healthy: 78, atRisk: 15, critical: 7 },
  { week: "Week 2", healthy: 80, atRisk: 13, critical: 7 },
  { week: "Week 3", healthy: 82, atRisk: 12, critical: 6 },
  { week: "Week 4", healthy: 85, atRisk: 10, critical: 5 },
]

// Helper functions
export function getCustomerById(id: string): Customer | undefined {
  return customers.find((c) => c.id === id)
}

export function getCustomersByStatus(status: Customer["status"]): Customer[] {
  return customers.filter((c) => c.status === status)
}

export function getCustomersByTier(tier: Customer["tier"]): Customer[] {
  return customers.filter((c) => c.tier === tier)
}

export function getAtRiskCustomers(): Customer[] {
  return customers.filter((c) => c.churnRisk > 60 || c.status === "At Risk")
}

export function getHighValueCustomers(): Customer[] {
  return customers.filter((c) => c.mrr > 10000)
}

export function getTicketsByCustomer(customerId: string): SupportTicket[] {
  return supportTickets.filter((t) => t.customerId === customerId)
}

export function getTicketsByStatus(status: SupportTicket["status"]): SupportTicket[] {
  return supportTickets.filter((t) => t.status === status)
}

export function getTicketsByPriority(priority: SupportTicket["priority"]): SupportTicket[] {
  return supportTickets.filter((t) => t.priority === priority)
}

export function calculateAverageHealthScore(): number {
  const sum = customers.reduce((acc, c) => acc + c.healthScore, 0)
  return Math.round(sum / customers.length)
}

export function calculateTotalMRR(): number {
  return customers.reduce((acc, c) => acc + c.mrr, 0)
}

export function calculateAverageChurnRisk(): number {
  const sum = customers.reduce((acc, c) => acc + c.churnRisk, 0)
  return Math.round((sum / customers.length) * 10) / 10
}

// ===== ENHANCED TELEMETRY & ANALYTICS DATA =====

// API Error Telemetry by Customer
export interface APIErrorData {
  customerId: string
  customerName: string
  totalErrors: number
  errorRate: number // percentage
  errorsByEndpoint: {
    endpoint: string
    errorCount: number
    errorRate: number
    avgResponseTime: number
    commonErrors: string[]
  }[]
  errorTrend: "increasing" | "stable" | "decreasing"
  lastErrorTimestamp: string
  impactScore: number // 1-100
}

export const apiErrorTelemetry: APIErrorData[] = [
  {
    customerId: "3",
    customerName: "HealthPlus Medical",
    totalErrors: 1847,
    errorRate: 12.4,
    errorsByEndpoint: [
      {
        endpoint: "/api/v2/patient-records/sync",
        errorCount: 892,
        errorRate: 18.7,
        avgResponseTime: 4200,
        commonErrors: ["504 Gateway Timeout", "HIPAA Validation Failed", "Database Connection Lost"],
      },
      {
        endpoint: "/api/v2/integrations/ehr",
        errorCount: 634,
        errorRate: 15.2,
        avgResponseTime: 3800,
        commonErrors: ["Authentication Failed", "Rate Limit Exceeded", "Invalid Schema"],
      },
      {
        endpoint: "/api/v2/reports/compliance",
        errorCount: 321,
        errorRate: 8.1,
        avgResponseTime: 2100,
        commonErrors: ["Timeout", "Missing Required Fields"],
      },
    ],
    errorTrend: "increasing",
    lastErrorTimestamp: "2025-11-11T09:23:15Z",
    impactScore: 94,
  },
  {
    customerId: "8",
    customerName: "Legal Partners LLP",
    totalErrors: 1523,
    errorRate: 10.8,
    errorsByEndpoint: [
      {
        endpoint: "/api/v2/dashboard/load",
        errorCount: 1089,
        errorRate: 22.4,
        avgResponseTime: 8500,
        commonErrors: ["Load Timeout", "Memory Limit Exceeded", "Query Too Complex"],
      },
      {
        endpoint: "/api/v2/documents/search",
        errorCount: 287,
        errorRate: 6.2,
        avgResponseTime: 1900,
        commonErrors: ["Index Not Found", "Search Timeout"],
      },
      {
        endpoint: "/api/v2/billing/invoice",
        errorCount: 147,
        errorRate: 3.8,
        avgResponseTime: 1200,
        commonErrors: ["Calculation Error", "Tax Rate Invalid"],
      },
    ],
    errorTrend: "increasing",
    lastErrorTimestamp: "2025-11-11T08:45:32Z",
    impactScore: 91,
  },
  {
    customerId: "2",
    customerName: "Global Finance Corp",
    totalErrors: 687,
    errorRate: 4.2,
    errorsByEndpoint: [
      {
        endpoint: "/api/v2/transactions/batch",
        errorCount: 423,
        errorRate: 7.8,
        avgResponseTime: 2400,
        commonErrors: ["Validation Error", "Duplicate Transaction ID"],
      },
      {
        endpoint: "/api/v2/compliance/audit",
        errorCount: 264,
        errorRate: 5.1,
        avgResponseTime: 1800,
        commonErrors: ["Incomplete Audit Trail", "Missing Metadata"],
      },
    ],
    errorTrend: "stable",
    lastErrorTimestamp: "2025-11-11T07:12:08Z",
    impactScore: 62,
  },
  {
    customerId: "7",
    customerName: "StartupGrow",
    totalErrors: 412,
    errorRate: 8.9,
    errorsByEndpoint: [
      {
        endpoint: "/api/v2/onboarding/setup",
        errorCount: 234,
        errorRate: 12.3,
        avgResponseTime: 1500,
        commonErrors: ["Invalid Configuration", "Missing Required Step"],
      },
      {
        endpoint: "/api/v2/features/activate",
        errorCount: 178,
        errorRate: 6.7,
        avgResponseTime: 980,
        commonErrors: ["Feature Not Available", "License Limit Reached"],
      },
    ],
    errorTrend: "decreasing",
    lastErrorTimestamp: "2025-11-11T06:34:21Z",
    impactScore: 58,
  },
  {
    customerId: "1",
    customerName: "TechCorp Solutions",
    totalErrors: 156,
    errorRate: 1.2,
    errorsByEndpoint: [
      {
        endpoint: "/api/v2/analytics/export",
        errorCount: 89,
        errorRate: 2.1,
        avgResponseTime: 1100,
        commonErrors: ["Export Too Large", "Format Not Supported"],
      },
      {
        endpoint: "/api/v2/webhooks/trigger",
        errorCount: 67,
        errorRate: 1.8,
        avgResponseTime: 450,
        commonErrors: ["Webhook Endpoint Unreachable"],
      },
    ],
    errorTrend: "stable",
    lastErrorTimestamp: "2025-11-10T22:15:42Z",
    impactScore: 24,
  },
]

// Product Component Bug Tracking
export interface ProductBug {
  id: string
  component: string
  bugTitle: string
  severity: "Critical" | "High" | "Medium" | "Low"
  affectedCustomers: string[]
  reportedDate: string
  status: "Open" | "In Progress" | "Fixed" | "Deployed"
  rootCause: string
  impactDescription: string
}

export const productBugs: ProductBug[] = [
  {
    id: "BUG-2024-089",
    component: "Dashboard Rendering Engine",
    bugTitle: "Dashboard loading timeout for complex queries",
    severity: "Critical",
    affectedCustomers: ["Legal Partners LLP", "Global Finance Corp", "Manufacturing Pro"],
    reportedDate: "2024-10-15",
    status: "In Progress",
    rootCause: "Inefficient query optimization causing memory overflow on large datasets",
    impactDescription: "Dashboard becomes unresponsive for users with >50K records, affecting 3 enterprise accounts",
  },
  {
    id: "BUG-2024-112",
    component: "HIPAA Integration Module",
    bugTitle: "Patient record sync failures",
    severity: "Critical",
    affectedCustomers: ["HealthPlus Medical"],
    reportedDate: "2024-10-28",
    status: "In Progress",
    rootCause: "Race condition in async batch processing causing validation errors",
    impactDescription: "Prevents healthcare customers from syncing patient data, compliance violation risk",
  },
  {
    id: "BUG-2024-098",
    component: "Billing Calculation Engine",
    bugTitle: "Invoice calculation discrepancies",
    severity: "High",
    affectedCustomers: ["Legal Partners LLP", "ConsumerGoods Plus"],
    reportedDate: "2024-10-20",
    status: "Fixed",
    rootCause: "Floating point precision error in tax calculation for multi-currency accounts",
    impactDescription: "Invoices showing incorrect amounts, causing customer trust issues",
  },
  {
    id: "BUG-2024-134",
    component: "Mobile App - Push Notifications",
    bugTitle: "Notifications not delivered on iOS",
    severity: "Medium",
    affectedCustomers: ["StartupGrow", "RetailMax Inc", "EduLearn Platform"],
    reportedDate: "2024-11-05",
    status: "Fixed",
    rootCause: "iOS APNs certificate expiration not handled gracefully",
    impactDescription: "Mobile users missing critical alerts, affecting user engagement",
  },
  {
    id: "BUG-2024-145",
    component: "API Gateway - Rate Limiting",
    bugTitle: "Rate limits incorrectly applied to enterprise accounts",
    severity: "High",
    affectedCustomers: ["CloudSync Technologies", "TechCorp Solutions", "Global Finance Corp"],
    reportedDate: "2024-11-08",
    status: "Deployed",
    rootCause: "Tier-based rate limiting logic not recognizing enterprise override flags",
    impactDescription: "Enterprise customers experiencing API throttling despite unlimited tier",
  },
  {
    id: "BUG-2024-078",
    component: "Analytics Export Module",
    bugTitle: "CSV exports contain malformed data",
    severity: "Medium",
    affectedCustomers: ["Manufacturing Pro", "RetailMax Inc"],
    reportedDate: "2024-10-12",
    status: "Fixed",
    rootCause: "UTF-8 encoding issue with special characters in customer data",
    impactDescription: "Exported reports unusable, requiring manual data cleanup",
  },
  {
    id: "BUG-2024-156",
    component: "Search Indexing Service",
    bugTitle: "Search results incomplete or missing",
    severity: "Medium",
    affectedCustomers: ["Legal Partners LLP", "EduLearn Platform"],
    reportedDate: "2024-11-09",
    status: "In Progress",
    rootCause: "ElasticSearch index fragmentation under heavy load",
    impactDescription: "Users unable to find documents, productivity impact",
  },
]

// Detailed Usage Metrics by Customer
export interface CustomerUsageMetrics {
  customerId: string
  customerName: string
  dailyActiveUsers: number
  monthlyActiveUsers: number
  totalLicenses: number
  licenseUtilization: number // percentage
  avgSessionDuration: number // minutes
  apiCallsPerDay: number
  dataStorageGB: number
  topFeatures: {
    feature: string
    usageCount: number
    uniqueUsers: number
    adoptionRate: number
  }[]
  usageTrend: "increasing" | "stable" | "decreasing"
  peakUsageHours: string[]
  engagementScore: number // 1-100
}

export const customerUsageMetrics: CustomerUsageMetrics[] = [
  {
    customerId: "1",
    customerName: "TechCorp Solutions",
    dailyActiveUsers: 284,
    monthlyActiveUsers: 320,
    totalLicenses: 350,
    licenseUtilization: 91.4,
    avgSessionDuration: 45,
    apiCallsPerDay: 18500,
    dataStorageGB: 245,
    topFeatures: [
      { feature: "Analytics Dashboard", usageCount: 1840, uniqueUsers: 280, adoptionRate: 98.6 },
      { feature: "API Integration", usageCount: 18500, uniqueUsers: 145, adoptionRate: 51.0 },
      { feature: "Custom Reports", usageCount: 892, uniqueUsers: 198, adoptionRate: 69.7 },
      { feature: "Team Collaboration", usageCount: 2340, uniqueUsers: 267, adoptionRate: 94.0 },
    ],
    usageTrend: "increasing",
    peakUsageHours: ["09:00-11:00", "14:00-16:00"],
    engagementScore: 94,
  },
  {
    customerId: "4",
    customerName: "CloudSync Technologies",
    dailyActiveUsers: 456,
    monthlyActiveUsers: 520,
    totalLicenses: 600,
    licenseUtilization: 86.7,
    avgSessionDuration: 52,
    apiCallsPerDay: 42000,
    dataStorageGB: 1200,
    topFeatures: [
      { feature: "API Integration", usageCount: 42000, uniqueUsers: 380, adoptionRate: 83.3 },
      { feature: "Analytics Dashboard", usageCount: 3200, uniqueUsers: 445, adoptionRate: 97.5 },
      { feature: "Automated Workflows", usageCount: 1580, uniqueUsers: 298, adoptionRate: 65.4 },
      { feature: "Data Sync", usageCount: 8900, uniqueUsers: 412, adoptionRate: 90.4 },
    ],
    usageTrend: "increasing",
    peakUsageHours: ["08:00-10:00", "13:00-15:00", "18:00-20:00"],
    engagementScore: 96,
  },
  {
    customerId: "3",
    customerName: "HealthPlus Medical",
    dailyActiveUsers: 78,
    monthlyActiveUsers: 142,
    totalLicenses: 250,
    licenseUtilization: 31.2,
    avgSessionDuration: 18,
    apiCallsPerDay: 8200,
    dataStorageGB: 450,
    topFeatures: [
      { feature: "Patient Records Sync", usageCount: 4100, uniqueUsers: 62, adoptionRate: 43.7 },
      { feature: "Compliance Reports", usageCount: 680, uniqueUsers: 45, adoptionRate: 31.7 },
      { feature: "Analytics Dashboard", usageCount: 420, uniqueUsers: 58, adoptionRate: 40.8 },
    ],
    usageTrend: "decreasing",
    peakUsageHours: ["09:00-12:00"],
    engagementScore: 38,
  },
  {
    customerId: "8",
    customerName: "Legal Partners LLP",
    dailyActiveUsers: 22,
    monthlyActiveUsers: 67,
    totalLicenses: 95,
    licenseUtilization: 23.2,
    avgSessionDuration: 12,
    apiCallsPerDay: 1200,
    dataStorageGB: 180,
    topFeatures: [
      { feature: "Document Search", usageCount: 340, uniqueUsers: 18, adoptionRate: 26.9 },
      { feature: "Analytics Dashboard", usageCount: 45, uniqueUsers: 12, adoptionRate: 17.9 },
      { feature: "Billing Portal", usageCount: 28, uniqueUsers: 8, adoptionRate: 11.9 },
    ],
    usageTrend: "decreasing",
    peakUsageHours: ["10:00-11:00"],
    engagementScore: 22,
  },
  {
    customerId: "7",
    customerName: "StartupGrow",
    dailyActiveUsers: 12,
    monthlyActiveUsers: 18,
    totalLicenses: 25,
    licenseUtilization: 48.0,
    avgSessionDuration: 28,
    apiCallsPerDay: 890,
    dataStorageGB: 15,
    topFeatures: [
      { feature: "Onboarding Wizard", usageCount: 45, uniqueUsers: 12, adoptionRate: 66.7 },
      { feature: "Analytics Dashboard", usageCount: 120, uniqueUsers: 11, adoptionRate: 61.1 },
      { feature: "Team Collaboration", usageCount: 89, uniqueUsers: 9, adoptionRate: 50.0 },
    ],
    usageTrend: "stable",
    peakUsageHours: ["11:00-13:00", "15:00-17:00"],
    engagementScore: 62,
  },
  {
    customerId: "2",
    customerName: "Global Finance Corp",
    dailyActiveUsers: 198,
    monthlyActiveUsers: 245,
    totalLicenses: 280,
    licenseUtilization: 70.7,
    avgSessionDuration: 38,
    apiCallsPerDay: 12800,
    dataStorageGB: 680,
    topFeatures: [
      { feature: "Compliance Audit", usageCount: 2400, uniqueUsers: 145, adoptionRate: 73.2 },
      { feature: "Transaction Processing", usageCount: 8900, uniqueUsers: 178, adoptionRate: 89.9 },
      { feature: "Analytics Dashboard", usageCount: 1560, uniqueUsers: 189, adoptionRate: 95.5 },
    ],
    usageTrend: "increasing",
    peakUsageHours: ["07:00-09:00", "13:00-15:00"],
    engagementScore: 87,
  },
  {
    customerId: "6",
    customerName: "Manufacturing Pro",
    dailyActiveUsers: 156,
    monthlyActiveUsers: 189,
    totalLicenses: 220,
    licenseUtilization: 70.9,
    avgSessionDuration: 42,
    apiCallsPerDay: 9800,
    dataStorageGB: 520,
    topFeatures: [
      { feature: "Production Analytics", usageCount: 3200, uniqueUsers: 142, adoptionRate: 90.4 },
      { feature: "Supply Chain Tracking", usageCount: 1890, uniqueUsers: 128, adoptionRate: 81.5 },
      { feature: "Quality Metrics", usageCount: 2100, uniqueUsers: 134, adoptionRate: 85.4 },
    ],
    usageTrend: "increasing",
    peakUsageHours: ["06:00-08:00", "14:00-16:00"],
    engagementScore: 89,
  },
  {
    customerId: "5",
    customerName: "RetailMax Inc",
    dailyActiveUsers: 98,
    monthlyActiveUsers: 124,
    totalLicenses: 145,
    licenseUtilization: 67.6,
    avgSessionDuration: 35,
    apiCallsPerDay: 6400,
    dataStorageGB: 290,
    topFeatures: [
      { feature: "Inventory Management", usageCount: 2800, uniqueUsers: 89, adoptionRate: 90.8 },
      { feature: "Sales Analytics", usageCount: 1450, uniqueUsers: 92, adoptionRate: 94.0 },
      { feature: "POS Integration", usageCount: 3200, uniqueUsers: 87, adoptionRate: 88.8 },
    ],
    usageTrend: "stable",
    peakUsageHours: ["08:00-10:00", "16:00-18:00"],
    engagementScore: 84,
  },
  {
    customerId: "9",
    customerName: "EduLearn Platform",
    dailyActiveUsers: 167,
    monthlyActiveUsers: 198,
    totalLicenses: 210,
    licenseUtilization: 79.5,
    avgSessionDuration: 48,
    apiCallsPerDay: 5600,
    dataStorageGB: 180,
    topFeatures: [
      { feature: "Student Analytics", usageCount: 2100, uniqueUsers: 156, adoptionRate: 93.4 },
      { feature: "Course Management", usageCount: 1890, uniqueUsers: 145, adoptionRate: 86.8 },
      { feature: "Progress Tracking", usageCount: 2400, uniqueUsers: 162, adoptionRate: 97.0 },
    ],
    usageTrend: "increasing",
    peakUsageHours: ["09:00-11:00", "14:00-16:00"],
    engagementScore: 93,
  },
  {
    customerId: "10",
    customerName: "ConsumerGoods Plus",
    dailyActiveUsers: 112,
    monthlyActiveUsers: 145,
    totalLicenses: 180,
    licenseUtilization: 62.2,
    avgSessionDuration: 32,
    apiCallsPerDay: 7200,
    dataStorageGB: 340,
    topFeatures: [
      { feature: "Distribution Analytics", usageCount: 1680, uniqueUsers: 98, adoptionRate: 87.5 },
      { feature: "Demand Forecasting", usageCount: 890, uniqueUsers: 76, adoptionRate: 67.9 },
      { feature: "Supplier Management", usageCount: 1240, uniqueUsers: 89, adoptionRate: 79.5 },
    ],
    usageTrend: "stable",
    peakUsageHours: ["08:00-10:00", "13:00-15:00"],
    engagementScore: 79,
  },
]

// Customer Sentiment Analysis
export interface CustomerSentiment {
  customerId: string
  customerName: string
  overallSentiment: "Positive" | "Neutral" | "Negative"
  sentimentScore: number // -100 to 100
  npsScore: number
  recentFeedback: {
    date: string
    channel: "Survey" | "Support Ticket" | "Email" | "Call" | "Product Review"
    sentiment: "Positive" | "Neutral" | "Negative"
    comment: string
    category: string
  }[]
  satisfactionTrend: "improving" | "stable" | "declining"
  championUsers: number // number of power users advocating for product
  detractors: number
}

export const customerSentiment: CustomerSentiment[] = [
  {
    customerId: "3",
    customerName: "HealthPlus Medical",
    overallSentiment: "Negative",
    sentimentScore: -42,
    npsScore: 3,
    recentFeedback: [
      {
        date: "2025-11-10",
        channel: "Support Ticket",
        sentiment: "Negative",
        comment: "HIPAA sync has been failing for 2 weeks. This is unacceptable for healthcare operations.",
        category: "Technical Issue",
      },
      {
        date: "2025-11-08",
        channel: "Email",
        sentiment: "Negative",
        comment: "Response times are too slow. We need immediate escalation for critical issues.",
        category: "Support Quality",
      },
      {
        date: "2025-11-05",
        channel: "Call",
        sentiment: "Neutral",
        comment: "Training materials are helpful but implementation is taking longer than expected.",
        category: "Onboarding",
      },
    ],
    satisfactionTrend: "declining",
    championUsers: 2,
    detractors: 8,
  },
  {
    customerId: "8",
    customerName: "Legal Partners LLP",
    overallSentiment: "Negative",
    sentimentScore: -38,
    npsScore: 4,
    recentFeedback: [
      {
        date: "2025-11-11",
        channel: "Support Ticket",
        sentiment: "Negative",
        comment: "Dashboard has been unusable for our entire team. Considering alternatives.",
        category: "Technical Issue",
      },
      {
        date: "2025-11-10",
        channel: "Email",
        sentiment: "Negative",
        comment: "Billing discrepancy still not resolved. Losing confidence in platform accuracy.",
        category: "Billing",
      },
      {
        date: "2025-11-06",
        channel: "Survey",
        sentiment: "Neutral",
        comment: "Good features when working, but reliability has been poor lately.",
        category: "Product Quality",
      },
    ],
    satisfactionTrend: "declining",
    championUsers: 1,
    detractors: 12,
  },
  {
    customerId: "1",
    customerName: "TechCorp Solutions",
    overallSentiment: "Positive",
    sentimentScore: 78,
    npsScore: 9,
    recentFeedback: [
      {
        date: "2025-11-09",
        channel: "Product Review",
        sentiment: "Positive",
        comment: "Best-in-class analytics. API integration is rock solid. Highly recommend.",
        category: "Product Features",
      },
      {
        date: "2025-11-05",
        channel: "Survey",
        sentiment: "Positive",
        comment: "Customer success team is exceptional. They truly understand our needs.",
        category: "Support Quality",
      },
      {
        date: "2025-11-01",
        channel: "Email",
        sentiment: "Positive",
        comment: "New features released last month are exactly what we needed. Great roadmap alignment.",
        category: "Product Development",
      },
    ],
    satisfactionTrend: "improving",
    championUsers: 24,
    detractors: 1,
  },
  {
    customerId: "4",
    customerName: "CloudSync Technologies",
    overallSentiment: "Positive",
    sentimentScore: 82,
    npsScore: 9,
    recentFeedback: [
      {
        date: "2025-11-10",
        channel: "Call",
        sentiment: "Positive",
        comment: "Platform scalability has exceeded expectations. Handling our growth seamlessly.",
        category: "Performance",
      },
      {
        date: "2025-11-07",
        channel: "Email",
        sentiment: "Positive",
        comment: "API documentation is comprehensive. Developer experience is top-notch.",
        category: "Developer Experience",
      },
      {
        date: "2025-11-03",
        channel: "Survey",
        sentiment: "Positive",
        comment: "ROI is clear. Platform has become mission-critical for our operations.",
        category: "Value",
      },
    ],
    satisfactionTrend: "stable",
    championUsers: 38,
    detractors: 2,
  },
  {
    customerId: "9",
    customerName: "EduLearn Platform",
    overallSentiment: "Positive",
    sentimentScore: 88,
    npsScore: 10,
    recentFeedback: [
      {
        date: "2025-11-11",
        channel: "Product Review",
        sentiment: "Positive",
        comment: "Perfect for education sector. Student analytics have transformed our approach.",
        category: "Product Fit",
      },
      {
        date: "2025-11-08",
        channel: "Survey",
        sentiment: "Positive",
        comment: "Support team responds quickly and provides thoughtful solutions.",
        category: "Support Quality",
      },
      {
        date: "2025-11-04",
        channel: "Email",
        sentiment: "Positive",
        comment: "Platform reliability is exceptional. Zero downtime in 6 months.",
        category: "Reliability",
      },
    ],
    satisfactionTrend: "improving",
    championUsers: 18,
    detractors: 0,
  },
]

// Helper functions for new data
export function getAPIErrorsByCustomer(customerId: string): APIErrorData | undefined {
  return apiErrorTelemetry.find((e) => e.customerId === customerId)
}

export function getCustomerWithMostAPIErrors(): APIErrorData {
  return apiErrorTelemetry.reduce((max, current) => (current.totalErrors > max.totalErrors ? current : max))
}

export function getBugsByComponent(): { component: string; bugCount: number; criticalCount: number }[] {
  const componentMap = new Map<string, { total: number; critical: number }>()

  productBugs.forEach((bug) => {
    const existing = componentMap.get(bug.component) || { total: 0, critical: 0 }
    existing.total += 1
    if (bug.severity === "Critical") existing.critical += 1
    componentMap.set(bug.component, existing)
  })

  return Array.from(componentMap.entries())
    .map(([component, counts]) => ({
      component,
      bugCount: counts.total,
      criticalCount: counts.critical,
    }))
    .sort((a, b) => b.bugCount - a.bugCount)
}

export function getUsageMetricsByCustomer(customerId: string): CustomerUsageMetrics | undefined {
  return customerUsageMetrics.find((m) => m.customerId === customerId)
}

export function getTopUsersByUsage(limit: number = 10): CustomerUsageMetrics[] {
  return [...customerUsageMetrics].sort((a, b) => b.engagementScore - a.engagementScore).slice(0, limit)
}

export function getLowestUsersByUsage(limit: number = 10): CustomerUsageMetrics[] {
  return [...customerUsageMetrics].sort((a, b) => a.engagementScore - b.engagementScore).slice(0, limit)
}

export function getSentimentByCustomer(customerId: string): CustomerSentiment | undefined {
  return customerSentiment.find((s) => s.customerId === customerId)
}
