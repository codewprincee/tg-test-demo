"use client"

import { useState, useEffect } from "react"
import { AnalyticsHeader } from "@/components/analytics-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  customers,
  regionalData,
  industryData,
  usageDataByMonth,
  featureAdoptionData,
  npsData,
  customerHealthTrends,
  calculateTotalMRR,
  calculateAverageHealthScore,
  getAtRiskCustomers,
  supportTickets,
} from "@/lib/demo-data"
import { TrendingUp, TrendingDown, Users, DollarSign, AlertTriangle, Target, Activity, Star } from "lucide-react"

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

// Metric Card Skeleton
const MetricCardSkeleton = () => (
  <Card className="border border-gray-200 shadow-none">
    <CardHeader className="pb-3">
      <ShimmerSkeleton className="h-4 w-24 mb-2" />
    </CardHeader>
    <CardContent>
      <ShimmerSkeleton className="h-8 w-32 mb-3" />
      <ShimmerSkeleton className="h-4 w-40" />
    </CardContent>
  </Card>
)

// Revenue Chart Skeleton
const RevenueChartSkeleton = () => (
  <Card className="border border-gray-200 shadow-none">
    <CardHeader className="pb-4 border-b border-gray-200">
      <ShimmerSkeleton className="h-5 w-48" />
    </CardHeader>
    <CardContent className="pt-6">
      <div className="h-64 flex items-end justify-between gap-3">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <ShimmerSkeleton className="w-full h-40" />
            <ShimmerSkeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)

// Table Row Skeleton
const TableRowSkeleton = () => (
  <div className="flex items-center justify-between p-3 border border-gray-100 rounded">
    <ShimmerSkeleton className="h-4 w-32" />
    <div className="flex gap-4">
      <ShimmerSkeleton className="h-4 w-24" />
      <ShimmerSkeleton className="h-4 w-20" />
    </div>
  </div>
)

// Tab Data Definitions
const tabsConfig = [
  {
    id: "overview",
    label: "Overview",
    description: "Key metrics and performance overview"
  },
  {
    id: "regional",
    label: "Regional",
    description: "Performance by geographic region"
  },
  {
    id: "customers",
    label: "Customers",
    description: "Customer health and revenue analysis"
  },
  {
    id: "features",
    label: "Features",
    description: "Feature adoption and engagement"
  }
]

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [activeFilter, setActiveFilter] = useState("overall")
  const [isLoading, setIsLoading] = useState(false)
  const [tabData, setTabData] = useState(null)

  // Simulate data loading when switching tabs or filters
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
      setTabData({
        timestamp: new Date(),
        tab: activeTab,
        filter: activeFilter
      })
    }, 800)
    return () => clearTimeout(timer)
  }, [activeTab, activeFilter])

  const handleTabSwitch = (tabId: string) => {
    setActiveTab(tabId)
    // Reset filter when switching tabs
    const firstFilter = getFiltersForTab(tabId)[0]?.id || "overall"
    setActiveFilter(firstFilter)
  }

  const getFiltersForTab = (tab: string) => {
    const filtersByTab: Record<string, { id: string; label: string }[]> = {
      overview: [
        { id: "overall", label: "Overall" },
        { id: "revenue", label: "Revenue" },
        { id: "growth", label: "Growth" },
        { id: "retention", label: "Retention" },
        { id: "engagement", label: "Engagement" },
        { id: "health", label: "Health" },
        { id: "trends", label: "Trends" }
      ],
      regional: [
        { id: "all-regions", label: "All Regions" },
        { id: "north-america", label: "North America" },
        { id: "europe", label: "Europe" },
        { id: "asia-pacific", label: "Asia Pacific" },
        { id: "latin-america", label: "Latin America" },
        { id: "middle-east", label: "Middle East" }
      ],
      customers: [
        { id: "all", label: "All Customers" },
        { id: "enterprise", label: "Enterprise" },
        { id: "mid-market", label: "Mid-Market" },
        { id: "smb", label: "SMB" },
        { id: "at-risk", label: "At Risk" },
        { id: "healthy", label: "Healthy" }
      ],
      features: [
        { id: "all-features", label: "All Features" },
        { id: "analytics", label: "Analytics" },
        { id: "reports", label: "Reports" },
        { id: "api", label: "API" },
        { id: "workflows", label: "Workflows" },
        { id: "collaboration", label: "Collaboration" }
      ]
    }
    return filtersByTab[tab] || filtersByTab.overview
  }

  const getFilteredCustomers = () => {
    switch (activeFilter) {
      case "enterprise":
        return customers.filter(c => c.tier === "Enterprise")
      case "mid-market":
        return customers.filter(c => c.tier === "Mid-Market")
      case "smb":
        return customers.filter(c => c.tier === "SMB")
      case "at-risk":
        return customers.filter(c => c.status === "At Risk" || c.churnRisk > 60)
      case "healthy":
        return customers.filter(c => c.healthScore >= 80)
      default:
        return customers
    }
  }

  const getFilteredRegionalData = () => {
    if (activeFilter === "all-regions") return regionalData

    const regionMap: Record<string, string> = {
      "north-america": "North America",
      "europe": "Europe",
      "asia-pacific": "Asia Pacific",
      "latin-america": "Latin America",
      "middle-east": "Middle East"
    }

    const regionName = regionMap[activeFilter]
    return regionName ? regionalData.filter(r => r.region === regionName) : regionalData
  }

  const getFilteredFeatureData = () => {
    if (activeFilter === "all-features") return featureAdoptionData

    const featureMap: Record<string, string> = {
      "analytics": "Analytics Dashboard",
      "reports": "Custom Reports",
      "api": "API Integration",
      "workflows": "Automated Workflows",
      "collaboration": "Team Collaboration"
    }

    const featureName = featureMap[activeFilter]
    return featureName ? featureAdoptionData.filter(f => f.feature === featureName) : featureAdoptionData
  }

  const getFilteredMetrics = () => {
    const filteredCustomers = getFilteredCustomers()
    const totalMRR = filteredCustomers.reduce((sum, c) => sum + c.mrr, 0)
    const avgHealth = Math.round(filteredCustomers.reduce((sum, c) => sum + c.healthScore, 0) / filteredCustomers.length) || 0
    const atRisk = filteredCustomers.filter(c => c.churnRisk > 60 || c.status === "At Risk")

    return { filteredCustomers, totalMRR, avgHealth, atRisk }
  }

  const { filteredCustomers, totalMRR, avgHealth, atRisk: atRiskCustomers } = getFilteredMetrics()
  const latestUsage = usageDataByMonth[usageDataByMonth.length - 1]
  const previousUsage = usageDataByMonth[usageDataByMonth.length - 2]
  const mrrGrowth = (((latestUsage.mrr - previousUsage.mrr) / previousUsage.mrr) * 100).toFixed(1)
  const customerGrowth = (((latestUsage.newCustomers - previousUsage.newCustomers) / previousUsage.newCustomers) * 100).toFixed(1)

  const displayedCustomers = activeTab === "customers" ? getFilteredCustomers() : customers
  const displayedRegionalData = activeTab === "regional" ? getFilteredRegionalData() : regionalData
  const displayedFeatureData = activeTab === "features" ? getFilteredFeatureData() : featureAdoptionData

  return (
    <div>
      <style>{shimmerStyle}</style>
      <AnalyticsHeader
        activeTab={activeTab}
        activeFilter={activeFilter}
        onTabChange={handleTabSwitch}
        onFilterChange={setActiveFilter}
        filters={getFiltersForTab(activeTab)}
      />
      <div className="p-8 bg-white">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Tab Content - Overview */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-fadeIn">
              {/* Key Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {isLoading ? (
                  <>
                    <MetricCardSkeleton />
                    <MetricCardSkeleton />
                    <MetricCardSkeleton />
                    <MetricCardSkeleton />
                  </>
                ) : (
                  <>
                    <Card className="border border-green-200 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-green-50 to-white">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xs font-bold text-gray-700 uppercase tracking-wide">Total MRR</CardTitle>
                          <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-green-600 shadow-md">
                            <DollarSign className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold bg-gradient-to-br from-green-700 to-green-600 bg-clip-text text-transparent">${(totalMRR / 1000).toFixed(1)}K</div>
                        <div className="flex items-center gap-1 mt-2">
                          <TrendingUp className="h-3 w-3 text-green-600" />
                          <p className="text-xs text-green-700 font-semibold">
                            +{mrrGrowth}% from last month
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border border-blue-200 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-blue-50 to-white">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xs font-bold text-gray-700 uppercase tracking-wide">Active Customers</CardTitle>
                          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
                            <Users className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold bg-gradient-to-br from-blue-700 to-blue-600 bg-clip-text text-transparent">{filteredCustomers.length}</div>
                        <div className="flex items-center gap-1 mt-2">
                          <TrendingUp className="h-3 w-3 text-blue-600" />
                          <p className="text-xs text-blue-700 font-semibold">
                            +{customerGrowth}% growth
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border border-purple-200 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-purple-50 to-white">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xs font-bold text-gray-700 uppercase tracking-wide">Avg Health</CardTitle>
                          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-md">
                            <Activity className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold bg-gradient-to-br from-purple-700 to-purple-600 bg-clip-text text-transparent">{avgHealth}</div>
                        <p className="text-xs text-purple-700 font-semibold mt-2">
                          {filteredCustomers.filter((c) => c.healthScore >= 80).length} customers healthy
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border border-red-200 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-red-50 to-white">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xs font-bold text-gray-700 uppercase tracking-wide">At Risk</CardTitle>
                          <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-red-600 shadow-md">
                            <AlertTriangle className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold bg-gradient-to-br from-red-700 to-red-600 bg-clip-text text-transparent">{atRiskCustomers.length}</div>
                        <p className="text-xs text-red-700 font-semibold mt-2">
                          ${(atRiskCustomers.reduce((sum, c) => sum + c.mrr, 0) / 1000).toFixed(1)}K MRR
                        </p>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>

              {/* Revenue Trends */}
              {isLoading ? (
                <RevenueChartSkeleton />
              ) : (
                <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="pb-4 border-b border-gray-200">
                    <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      Revenue Growth (Last 6 Months)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="h-64 flex items-end justify-between gap-3">
                      {usageDataByMonth.map((month, idx) => {
                        const maxMRR = Math.max(...usageDataByMonth.map((m) => m.mrr))
                        const heightPercent = (month.mrr / maxMRR) * 100
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full relative" style={{ height: "220px" }}>
                              <div
                                className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 transition-all cursor-pointer rounded-t-lg shadow-lg"
                                style={{ height: `${heightPercent}%` }}
                                title={`${month.month}: $${(month.mrr / 1000).toFixed(0)}K`}
                              />
                            </div>
                            <div className="text-center">
                              <div className="text-xs font-semibold text-gray-900">{month.month}</div>
                              <div className="text-xs text-gray-600">{month.newCustomers} new</div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Customer Health Trends */}
              {isLoading ? (
                <Card className="border border-gray-200 shadow-none">
                  <CardHeader className="pb-4 border-b border-gray-200">
                    <ShimmerSkeleton className="h-5 w-48" />
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="h-56 flex items-end justify-between gap-2">
                      {Array(8).fill(0).map((_, i) => (
                        <ShimmerSkeleton key={i} className="flex-1 h-40" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="pb-4 border-b border-gray-200">
                    <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <Activity className="h-4 w-4 text-blue-600" />
                      Customer Health Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="h-56 flex items-end justify-between gap-2 mb-6">
                      {customerHealthTrends.map((week, idx) => (
                        <div key={idx} className="flex-1 flex flex-col gap-1">
                          <div className="relative h-40 flex flex-col justify-end gap-px">
                            <div
                              className="bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                              style={{ height: `${(week.healthy / 100) * 100}%` }}
                              title={`Healthy: ${week.healthy}%`}
                            />
                            <div
                              className="bg-gradient-to-t from-amber-600 to-amber-400 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                              style={{ height: `${(week.atRisk / 100) * 100}%` }}
                              title={`At Risk: ${week.atRisk}%`}
                            />
                            <div
                              className="bg-gradient-to-t from-red-600 to-red-400 rounded-b-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                              style={{ height: `${(week.critical / 100) * 100}%` }}
                              title={`Critical: ${week.critical}%`}
                            />
                          </div>
                          <div className="text-center text-xs font-semibold text-gray-900">{week.week}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center gap-6">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gradient-to-br from-green-600 to-green-400 rounded-full shadow-sm" />
                        <span className="text-xs font-semibold text-gray-700">Healthy</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gradient-to-br from-amber-600 to-amber-400 rounded-full shadow-sm" />
                        <span className="text-xs font-semibold text-gray-700">At Risk</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gradient-to-br from-red-600 to-red-400 rounded-full shadow-sm" />
                        <span className="text-xs font-semibold text-gray-700">Critical</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Tab Content - Regional */}
          {activeTab === "regional" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {isLoading ? (
                  <>
                    <Card className="border border-gray-200 shadow-none">
                      <CardHeader className="pb-4 border-b border-gray-200">
                        <ShimmerSkeleton className="h-5 w-40" />
                      </CardHeader>
                      <CardContent className="pt-6 space-y-5">
                        {Array(4).fill(0).map((_, i) => (
                          <div key={i}>
                            <ShimmerSkeleton className="h-4 w-48 mb-2" />
                            <ShimmerSkeleton className="h-3 w-full mb-2" />
                            <ShimmerSkeleton className="h-4 w-64" />
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                    <Card className="border border-gray-200 shadow-none">
                      <CardHeader className="pb-4 border-b border-gray-200">
                        <ShimmerSkeleton className="h-5 w-40" />
                      </CardHeader>
                      <CardContent className="pt-6 space-y-3">
                        {Array(4).fill(0).map((_, i) => (
                          <ShimmerSkeleton key={i} className="h-20 w-full" />
                        ))}
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <>
                    <Card className="border border-gray-200 shadow-none">
                      <CardHeader className="pb-4 border-b border-gray-200">
                        <CardTitle className="text-sm font-semibold text-gray-900">Regional Performance</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-5">
                        {displayedRegionalData.map((region, idx) => (
                          <div key={idx}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-900">{region.region}</span>
                              <span className="text-xs font-medium text-green-700">{region.growth}</span>
                            </div>
                            <div className="flex items-center gap-3 mb-2">
                              <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                                <div
                                  className="bg-slate-700 h-full rounded-full"
                                  style={{
                                    width: `${(region.customers / Math.max(...displayedRegionalData.map((r) => r.customers))) * 100}%`,
                                  }}
                                />
                              </div>
                              <span className="text-xs text-gray-600 w-16 text-right font-medium">
                                {region.customers} cust.
                              </span>
                            </div>
                            <div className="flex gap-4 text-xs text-gray-600">
                              <span>{region.revenue}</span>
                              <span>Churn: {region.churnRate}</span>
                              <span>Health: {region.healthScore}</span>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-none">
                      <CardHeader className="pb-4 border-b border-gray-200">
                        <CardTitle className="text-sm font-semibold text-gray-900">Industry Performance</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          {industryData.map((industry, idx) => (
                            <div key={idx} className="flex items-center justify-between py-3 px-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="flex-1">
                                <div className="font-medium text-sm text-gray-900">{industry.industry}</div>
                                <div className="text-xs text-gray-600 mt-1">
                                  {industry.customers} customers • ${(industry.avgMrr / 1000).toFixed(1)}K avg MRR
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-bold text-gray-900">{industry.healthScore}</div>
                                <div className="text-xs text-gray-600">Score</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Tab Content - Customers */}
          {activeTab === "customers" && (
            <div className="space-y-6 animate-fadeIn">
              {isLoading ? (
                <Card className="border border-gray-200 shadow-none">
                  <CardHeader className="pb-4 border-b border-gray-200">
                    <ShimmerSkeleton className="h-5 w-48" />
                  </CardHeader>
                  <CardContent className="pt-6 space-y-2">
                    {Array(8).fill(0).map((_, i) => (
                      <TableRowSkeleton key={i} />
                    ))}
                  </CardContent>
                </Card>
              ) : (
                <Card className="border border-gray-200 shadow-none">
                  <CardHeader className="pb-4 border-b border-gray-200">
                    <CardTitle className="text-sm font-semibold text-gray-900">Top Customers by Revenue</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      {displayedCustomers
                        .sort((a, b) => b.mrr - a.mrr)
                        .slice(0, 8)
                        .map((customer, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 rounded border border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {idx + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm text-gray-900 truncate">{customer.name}</div>
                                <div className="text-xs text-gray-600 truncate">
                                  {customer.tier} • {customer.industry}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                              <div className="text-right">
                                <div className="text-sm font-semibold text-gray-900">${customer.mrr.toLocaleString()}</div>
                                <div className="text-xs text-gray-600">/mo</div>
                              </div>
                              <div className="text-right">
                                <div
                                  className={`text-sm font-semibold ${customer.healthScore >= 80 ? "text-green-700" : customer.healthScore >= 60 ? "text-amber-700" : "text-red-700"}`}
                                >
                                  {customer.healthScore}
                                </div>
                                <div className="text-xs text-gray-600">Score</div>
                              </div>
                              <div
                                className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${
                                  customer.status === "Active"
                                    ? "bg-green-50 text-green-700 border border-green-200"
                                    : customer.status === "At Risk"
                                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                                      : customer.status === "Onboarding"
                                        ? "bg-slate-100 text-slate-700 border border-slate-200"
                                        : "bg-red-50 text-red-700 border border-red-200"
                                }`}
                              >
                                {customer.status}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Tab Content - Features */}
          {activeTab === "features" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {isLoading ? (
                  <>
                    <Card className="border border-gray-200 shadow-none">
                      <CardHeader className="pb-4 border-b border-gray-200">
                        <ShimmerSkeleton className="h-5 w-40" />
                      </CardHeader>
                      <CardContent className="pt-6 space-y-4">
                        {Array(5).fill(0).map((_, i) => (
                          <div key={i}>
                            <ShimmerSkeleton className="h-4 w-48 mb-2" />
                            <ShimmerSkeleton className="h-3 w-full mb-2" />
                            <ShimmerSkeleton className="h-4 w-32" />
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                    <Card className="border border-gray-200 shadow-none">
                      <CardHeader className="pb-4 border-b border-gray-200">
                        <ShimmerSkeleton className="h-5 w-40" />
                      </CardHeader>
                      <CardContent className="pt-6">
                        <ShimmerSkeleton className="h-20 w-32 mx-auto mb-6" />
                        <div className="space-y-3">
                          {Array(3).fill(0).map((_, i) => (
                            <ShimmerSkeleton key={i} className="h-8 w-full" />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <>
                    <Card className="border border-gray-200 shadow-none">
                      <CardHeader className="pb-4 border-b border-gray-200">
                        <CardTitle className="text-sm font-semibold text-gray-900">Feature Adoption</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-4">
                        {displayedFeatureData.map((feature, idx) => (
                          <div key={idx}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-900">{feature.feature}</span>
                              <span className="text-sm font-semibold text-gray-900">{feature.adoption}%</span>
                            </div>
                            <div className="bg-gray-200 h-2 rounded-full overflow-hidden mb-1">
                              <div
                                className={`h-full rounded-full ${
                                  feature.adoption >= 80
                                    ? "bg-green-600"
                                    : feature.adoption >= 60
                                      ? "bg-slate-700"
                                      : "bg-amber-600"
                                }`}
                                style={{ width: `${feature.adoption}%` }}
                              />
                            </div>
                            <div className="text-xs text-gray-600">{feature.users.toLocaleString()} active</div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-none">
                      <CardHeader className="pb-4 border-b border-gray-200">
                        <CardTitle className="text-sm font-semibold text-gray-900">Net Promoter Score</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="mb-8">
                          <div className="text-center">
                            <div className="text-5xl font-bold text-gray-900">74</div>
                            <div className="text-xs text-gray-600 mt-2">Overall NPS</div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {npsData.map((segment, idx) => (
                            <div key={idx}>
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="font-medium text-gray-900">{segment.score}</span>
                                <span className="text-gray-600">
                                  {segment.count.toLocaleString()} ({segment.percentage}%)
                                </span>
                              </div>
                              <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    idx === 0 ? "bg-green-600" : idx === 1 ? "bg-slate-700" : "bg-red-600"
                                  }`}
                                  style={{ width: `${segment.percentage}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}