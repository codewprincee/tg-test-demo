/**
 * Mock API Service
 * Simulates real API calls with realistic delays, error handling, and HTTP status codes
 */

interface APIResponse<T> {
  data?: T
  error?: string
  status: number
  timestamp: string
}

interface APIOptions {
  delay?: number
  shouldFail?: boolean
  errorMessage?: string
  statusCode?: number
}

// Simulate network latency
const randomDelay = (min: number = 200, max: number = 800): Promise<void> => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min
  return new Promise((resolve) => setTimeout(resolve, delay))
}

// Generic API call wrapper
async function makeAPICall<T>(
  operation: () => T | Promise<T>,
  options: APIOptions = {}
): Promise<APIResponse<T>> {
  const {
    delay,
    shouldFail = false,
    errorMessage = "An error occurred",
    statusCode = shouldFail ? 500 : 200,
  } = options

  // Simulate network delay
  if (delay !== undefined) {
    await new Promise((resolve) => setTimeout(resolve, delay))
  } else {
    await randomDelay()
  }

  // Simulate random failures (5% chance)
  const randomFailure = Math.random() < 0.05

  if (shouldFail || randomFailure) {
    return {
      error: errorMessage,
      status: statusCode,
      timestamp: new Date().toISOString(),
    }
  }

  try {
    const data = await Promise.resolve(operation())
    return {
      data,
      status: 200,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred",
      status: 500,
      timestamp: new Date().toISOString(),
    }
  }
}

// Authentication APIs
export const authAPI = {
  login: async (
    email: string,
    password: string
  ): Promise<APIResponse<{ user: { email: string; name: string; role: string }; token: string }>> => {
    return makeAPICall(
      () => {
        if (email === "demo@trytouchbase.io" && password === "YCdemo2025") {
          return {
            user: {
              email: "demo@trytouchbase.io",
              name: "Demo User",
              role: "Admin",
            },
            token: "mock-jwt-token-" + Date.now(),
          }
        }
        throw new Error("Invalid credentials")
      },
      { delay: 800 }
    )
  },

  signup: async (
    email: string,
    password: string,
    name: string
  ): Promise<APIResponse<{ user: { email: string; name: string; role: string }; token: string }>> => {
    return makeAPICall(
      () => {
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters")
        }
        return {
          user: {
            email,
            name,
            role: "User",
          },
          token: "mock-jwt-token-" + Date.now(),
        }
      },
      { delay: 1000 }
    )
  },

  logout: async (): Promise<APIResponse<{ message: string }>> => {
    return makeAPICall(
      () => ({
        message: "Logged out successfully",
      }),
      { delay: 300 }
    )
  },

  verifyToken: async (token: string): Promise<APIResponse<{ valid: boolean }>> => {
    return makeAPICall(
      () => ({
        valid: token.startsWith("mock-jwt-token-"),
      }),
      { delay: 200 }
    )
  },
}

// Customer APIs
export const customerAPI = {
  getAll: async (): Promise<APIResponse<any[]>> => {
    const { customers } = await import("./demo-data")
    return makeAPICall(() => customers, { delay: 600 })
  },

  getById: async (id: string): Promise<APIResponse<any>> => {
    const { getCustomerById } = await import("./demo-data")
    return makeAPICall(() => {
      const customer = getCustomerById(id)
      if (!customer) {
        throw new Error("Customer not found")
      }
      return customer
    })
  },

  getAtRisk: async (): Promise<APIResponse<any[]>> => {
    const { getAtRiskCustomers } = await import("./demo-data")
    return makeAPICall(() => getAtRiskCustomers(), { delay: 700 })
  },
}

// Analytics APIs
export const analyticsAPI = {
  getMetrics: async (timeRange: string = "30d"): Promise<APIResponse<any>> => {
    const { calculateTotalMRR, calculateAverageHealthScore } = await import("./demo-data")
    return makeAPICall(
      () => ({
        totalMRR: calculateTotalMRR(),
        averageHealthScore: calculateAverageHealthScore(),
        timeRange,
      }),
      { delay: 500 }
    )
  },

  getRegionalData: async (): Promise<APIResponse<any[]>> => {
    const { regionalData } = await import("./demo-data")
    return makeAPICall(() => regionalData, { delay: 600 })
  },

  getIndustryData: async (): Promise<APIResponse<any[]>> => {
    const { industryData } = await import("./demo-data")
    return makeAPICall(() => industryData, { delay: 550 })
  },

  getUsageData: async (): Promise<APIResponse<any[]>> => {
    const { usageDataByMonth } = await import("./demo-data")
    return makeAPICall(() => usageDataByMonth, { delay: 650 })
  },

  exportData: async (format: "csv" | "pdf" | "xlsx"): Promise<APIResponse<{ downloadUrl: string }>> => {
    return makeAPICall(
      () => ({
        downloadUrl: `/api/exports/analytics-${Date.now()}.${format}`,
      }),
      { delay: 1200 }
    )
  },
}

// Support Ticket APIs
export const ticketAPI = {
  getAll: async (): Promise<APIResponse<any[]>> => {
    const { supportTickets } = await import("./demo-data")
    return makeAPICall(() => supportTickets, { delay: 500 })
  },

  getByStatus: async (status: string): Promise<APIResponse<any[]>> => {
    const { getTicketsByStatus } = await import("./demo-data")
    return makeAPICall(() => getTicketsByStatus(status as any), { delay: 450 })
  },

  getByPriority: async (priority: string): Promise<APIResponse<any[]>> => {
    const { getTicketsByPriority } = await import("./demo-data")
    return makeAPICall(() => getTicketsByPriority(priority as any), { delay: 450 })
  },

  update: async (id: string, updates: any): Promise<APIResponse<{ message: string }>> => {
    return makeAPICall(
      () => ({
        message: `Ticket ${id} updated successfully`,
      }),
      { delay: 700 }
    )
  },
}

// Retry mechanism
export async function withRetry<T>(
  apiCall: () => Promise<APIResponse<T>>,
  maxRetries: number = 3,
  retryDelay: number = 1000
): Promise<APIResponse<T>> {
  let lastError: APIResponse<T> | null = null

  for (let i = 0; i < maxRetries; i++) {
    const response = await apiCall()

    if (response.status === 200 && response.data) {
      return response
    }

    lastError = response

    // Don't retry on client errors (4xx)
    if (response.status >= 400 && response.status < 500) {
      return response
    }

    // Wait before retrying (exponential backoff)
    if (i < maxRetries - 1) {
      await new Promise((resolve) => setTimeout(resolve, retryDelay * Math.pow(2, i)))
    }
  }

  return (
    lastError || {
      error: "Max retries exceeded",
      status: 500,
      timestamp: new Date().toISOString(),
    }
  )
}

// Error handling helper
export function handleAPIError(response: APIResponse<any>): string {
  if (response.status >= 500) {
    return "Server error. Please try again later."
  } else if (response.status === 404) {
    return "Resource not found."
  } else if (response.status === 401) {
    return "Unauthorized. Please log in again."
  } else if (response.status === 403) {
    return "Access denied."
  }
  return response.error || "An error occurred."
}
