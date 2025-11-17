"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  customers,
  regionalData,
  industryData,
  usageDataByMonth,
  featureAdoptionData,
  npsData,
  customerHealthTrends,
} from "@/lib/demo-data"
import {
  Users,
  DollarSign,
  AlertTriangle,
  Activity,
  ArrowUpRight,
  Circle,
  BarChart3,
  PieChart,
  Building2,
  Plus,
  Globe,
  Zap,
  X,
  Filter,
  Info,
  ArrowRight,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
} from "lucide-react"
import { cn } from "@/lib/utils"

type WidgetType = "product-overview" | "active-sales" | "product-revenue" | "analytics" | "sales-performance" | "total-visits" | "top-products" | "mrr" | "customers" | "health" | "churn"

interface Widget {
  id: string
  type: WidgetType
  title: string
  enabled: boolean
}

const tabs = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "regional", label: "Regional", icon: Globe },
  { id: "customers", label: "Customers", icon: Users },
  { id: "features", label: "Features", icon: Zap },
]

const widgetCatalog: Record<WidgetType, { title: string; description: string }> = {
  "product-overview": { title: "Product overview", description: "Sales overview by product" },
  "active-sales": { title: "Active sales", description: "Current sales metrics" },
  "product-revenue": { title: "Product Revenue", description: "Revenue breakdown" },
  "analytics": { title: "Analytics", description: "Sales analytics" },
  "sales-performance": { title: "Sales Performance", description: "Performance metrics" },
  "total-visits": { title: "Total visits by hourly", description: "Hourly visit patterns" },
  "top-products": { title: "Top Products", description: "Best selling products" },
  mrr: { title: "Total MRR", description: "Monthly recurring revenue" },
  customers: { title: "Active Customers", description: "Total active customers" },
  health: { title: "Health Score", description: "Average customer health" },
  churn: { title: "Churn Risk", description: "At-risk customers" },
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isWidgetMenuOpen, setIsWidgetMenuOpen] = useState(false)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [timeRange, setTimeRange] = useState("This month")
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState({
    dateRange: "This month",
    productCategory: "All",
    status: "All",
    salesRange: "All"
  })

  // Simulate data loading when switching tabs
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [activeTab])

  const defaultWidgets: Record<string, Widget[]> = {
    overview: [
      { id: "1", type: "product-overview", title: "Product overview", enabled: true },
      { id: "2", type: "active-sales", title: "Active sales", enabled: true },
      { id: "3", type: "product-revenue", title: "Product Revenue", enabled: true },
      { id: "4", type: "analytics", title: "Analytics", enabled: true },
      { id: "5", type: "sales-performance", title: "Sales Performance", enabled: true },
      { id: "6", type: "total-visits", title: "Total visits", enabled: true },
      { id: "7", type: "top-products", title: "Top Products", enabled: true },
    ],
    regional: [
      { id: "r1", type: "analytics", title: "Regional Analytics", enabled: true },
    ],
    customers: [
      { id: "c1", type: "mrr", title: "Total MRR", enabled: true },
      { id: "c2", type: "customers", title: "Customers", enabled: true },
    ],
    features: [
      { id: "f1", type: "analytics", title: "Feature Analytics", enabled: true },
    ],
  }

  const [widgets, setWidgets] = useState<Record<string, Widget[]>>(defaultWidgets)

  const filteredCustomers = customers
  const totalMRR = customers.reduce((sum, c) => sum + c.mrr, 0)
  const avgHealth = Math.round(customers.reduce((sum, c) => sum + c.healthScore, 0) / customers.length)
  const atRiskCustomers = customers.filter((c) => c.churnRisk > 60 || c.status === "At Risk")

  const latestMonth = usageDataByMonth[usageDataByMonth.length - 1]
  const previousMonth = usageDataByMonth[usageDataByMonth.length - 2]
  const mrrGrowth = (((latestMonth.mrr - previousMonth.mrr) / previousMonth.mrr) * 100).toFixed(1)
  const customerGrowth = (((latestMonth.newCustomers - previousMonth.newCustomers) / previousMonth.newCustomers) * 100).toFixed(1)

  const activeWidgets = widgets[activeTab] || []

  const addWidget = (type: WidgetType) => {
    const timestamp = Date.now()
    const newWidget: Widget = {
      id: activeTab + "-" + timestamp,
      type,
      title: widgetCatalog[type].title,
      enabled: true,
    }
    setWidgets((prev) => ({
      ...prev,
      [activeTab]: [...prev[activeTab], newWidget],
    }))
    setIsWidgetMenuOpen(false)
  }

  const removeWidget = (widgetId: string) => {
    setWidgets((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].filter((w) => w.id !== widgetId),
    }))
  }

  const availableWidgetsToAdd = Object.entries(widgetCatalog).filter(
    ([type]) => !activeWidgets.some((w) => w.type === type)
  )

  const hasActiveFilters =
    filters.dateRange !== "This month" ||
    filters.productCategory !== "All" ||
    filters.status !== "All" ||
    filters.salesRange !== "All"

  return (
    <div className="min-h-screen bg-background">
      {/* Header matching screenshot */}
      <div className="border-b border-border bg-card">
        <div className="px-8 py-6">
          <div className="mx-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-4xl font-display font-bold text-foreground tracking-tight mb-1">
                  Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Track your sales and performance of your strategy
                </p>
              </div>
              <div className="flex items-center gap-3">
                <DropdownMenu open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="gap-2 h-10 px-4 border-border hover:bg-muted relative"
                    >
                      <Filter className="h-4 w-4" />
                      Filters
                      <ChevronDown className="h-4 w-4 ml-1" />
                      {hasActiveFilters && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#FF6B47] rounded-full"></span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wider">
                      Filter Options
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="p-3 space-y-4">
                      {/* Date Range Filter */}
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-2 block">Date Range</label>
                        <Select
                          value={filters.dateRange}
                          onValueChange={(value) => setFilters({...filters, dateRange: value})}
                        >
                          <SelectTrigger className="w-full h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Today">Today</SelectItem>
                            <SelectItem value="This week">This week</SelectItem>
                            <SelectItem value="This month">This month</SelectItem>
                            <SelectItem value="Last month">Last month</SelectItem>
                            <SelectItem value="This year">This year</SelectItem>
                            <SelectItem value="All time">All time</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Product Category Filter */}
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-2 block">Product Category</label>
                        <Select
                          value={filters.productCategory}
                          onValueChange={(value) => setFilters({...filters, productCategory: value})}
                        >
                          <SelectTrigger className="w-full h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="All">All Categories</SelectItem>
                            <SelectItem value="Cosmetics">Cosmetics</SelectItem>
                            <SelectItem value="Housewest">Housewest</SelectItem>
                            <SelectItem value="Electronics">Electronics</SelectItem>
                            <SelectItem value="Clothing">Clothing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Status Filter */}
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-2 block">Status</label>
                        <Select
                          value={filters.status}
                          onValueChange={(value) => setFilters({...filters, status: value})}
                        >
                          <SelectTrigger className="w-full h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="All">All Status</SelectItem>
                            <SelectItem value="In Stock">In Stock</SelectItem>
                            <SelectItem value="Low Stock">Low Stock</SelectItem>
                            <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Sales Range Filter */}
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-2 block">Sales Range</label>
                        <Select
                          value={filters.salesRange}
                          onValueChange={(value) => setFilters({...filters, salesRange: value})}
                        >
                          <SelectTrigger className="w-full h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="All">All Ranges</SelectItem>
                            <SelectItem value="0-1000">$0 - $1,000</SelectItem>
                            <SelectItem value="1000-10000">$1,000 - $10,000</SelectItem>
                            <SelectItem value="10000-50000">$10,000 - $50,000</SelectItem>
                            <SelectItem value="50000+">$50,000+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <div className="p-3 flex justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFilters({
                          dateRange: "This month",
                          productCategory: "All",
                          status: "All",
                          salesRange: "All"
                        })}
                      >
                        Reset
                      </Button>
                      <Button
                        size="sm"
                        className="bg-[#FF6B47] hover:bg-[#FF6B47]/90"
                        onClick={() => setIsFiltersOpen(false)}
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu open={isWidgetMenuOpen} onOpenChange={setIsWidgetMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button className="gap-2 h-10 px-4 bg-foreground hover:bg-foreground/90">
                      <Plus className="h-4 w-4" />
                      Add Widget
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-72">
                    <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wider">
                      Available Widgets
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {availableWidgetsToAdd.length === 0 ? (
                      <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                        All widgets added
                      </div>
                    ) : (
                      availableWidgetsToAdd.map(([type, info]) => (
                        <DropdownMenuItem key={type} onClick={() => addWidget(type as WidgetType)} className="py-3 cursor-pointer">
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-foreground">{info.title}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{info.description}</div>
                          </div>
                        </DropdownMenuItem>
                      ))
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Tab Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-4 bg-muted/50">
                <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
                <TabsTrigger value="regional" className="text-sm">Regional</TabsTrigger>
                <TabsTrigger value="customers" className="text-sm">Customers</TabsTrigger>
                <TabsTrigger value="features" className="text-sm">Features</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="border-b border-border bg-muted/30">
          <div className="px-8 py-3">
            <div className=" mx-auto flex items-center gap-3 flex-wrap">
              <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
              {filters.dateRange !== "This month" && (
                <span className="px-3 py-1 bg-card border border-border rounded-md text-sm flex items-center gap-2">
                  Date: {filters.dateRange}
                  <button
                    onClick={() => setFilters({ ...filters, dateRange: "This month" })}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.productCategory !== "All" && (
                <span className="px-3 py-1 bg-card border border-border rounded-md text-sm flex items-center gap-2">
                  Category: {filters.productCategory}
                  <button
                    onClick={() => setFilters({ ...filters, productCategory: "All" })}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.status !== "All" && (
                <span className="px-3 py-1 bg-card border border-border rounded-md text-sm flex items-center gap-2">
                  Status: {filters.status}
                  <button
                    onClick={() => setFilters({ ...filters, status: "All" })}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.salesRange !== "All" && (
                <span className="px-3 py-1 bg-card border border-border rounded-md text-sm flex items-center gap-2">
                  Sales: {filters.salesRange}
                  <button
                    onClick={() => setFilters({ ...filters, salesRange: "All" })}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              <button
                onClick={() =>
                  setFilters({
                    dateRange: "This month",
                    productCategory: "All",
                    status: "All",
                    salesRange: "All",
                  })
                }
                className="text-sm text-muted-foreground hover:text-foreground underline"
              >
                Clear all
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Content */}
      <div className="px-8 py-8">
        <div className="mx-auto">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Key Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border border-border bg-card hover:shadow-sm transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs font-bold text-foreground uppercase tracking-wide">Total MRR</CardTitle>
                      <div className="p-2 rounded-lg bg-[#10B981]">
                        <DollarSign className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">${(totalMRR / 1000).toFixed(1)}K</div>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="h-3 w-3 text-[#10B981]" />
                      <p className="text-xs text-[#10B981] font-semibold">
                        +{mrrGrowth}% from last month
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-border bg-card hover:shadow-sm transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs font-bold text-foreground uppercase tracking-wide">Active Customers</CardTitle>
                      <div className="p-2 rounded-lg bg-[#FF6B47]">
                        <Users className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{filteredCustomers.length}</div>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="h-3 w-3 text-[#10B981]" />
                      <p className="text-xs text-[#10B981] font-semibold">
                        +{customerGrowth}% growth
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-border bg-card hover:shadow-sm transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs font-bold text-foreground uppercase tracking-wide">Avg Health</CardTitle>
                      <div className="p-2 rounded-lg bg-[#7c3aed]">
                        <Activity className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{avgHealth}</div>
                    <p className="text-xs text-muted-foreground font-semibold mt-2">
                      {filteredCustomers.filter((c) => c.healthScore >= 80).length} customers healthy
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-border bg-card hover:shadow-sm transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs font-bold text-foreground uppercase tracking-wide">At Risk</CardTitle>
                      <div className="p-2 rounded-lg bg-[#EF4444]">
                        <AlertTriangle className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{atRiskCustomers.length}</div>
                    <p className="text-xs text-muted-foreground font-semibold mt-2">
                      ${(atRiskCustomers.reduce((sum, c) => sum + c.mrr, 0) / 1000).toFixed(1)}K MRR
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Revenue Trends - Line Chart Style */}
              <Card className="border border-border bg-card hover:shadow-sm transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-[#FF6B47]" />
                    Revenue Growth (Last 6 Months)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold text-foreground">${(totalMRR / 1000).toFixed(1)}K</div>
                        <div className="text-xs text-muted-foreground mt-1">Current MRR</div>
                      </div>
                      <div className="text-center p-3 bg-[#10B981]/10 rounded-lg">
                        <div className="text-2xl font-bold text-[#10B981]">+{mrrGrowth}%</div>
                        <div className="text-xs text-muted-foreground mt-1">Growth Rate</div>
                      </div>
                      <div className="text-center p-3 bg-[#FF6B47]/10 rounded-lg">
                        <div className="text-2xl font-bold text-[#FF6B47]">{usageDataByMonth[usageDataByMonth.length - 1].newCustomers}</div>
                        <div className="text-xs text-muted-foreground mt-1">New Customers</div>
                      </div>
                    </div>

                    {/* Line Chart Visualization */}
                    <div className="relative h-48">
                      <svg className="w-full h-full" preserveAspectRatio="none">
                        {/* Grid lines */}
                        {[0, 25, 50, 75, 100].map((percent) => (
                          <line
                            key={percent}
                            x1="0"
                            y1={`${percent}%`}
                            x2="100%"
                            y2={`${percent}%`}
                            stroke="currentColor"
                            strokeOpacity="0.1"
                            strokeWidth="1"
                          />
                        ))}

                        {/* Area fill */}
                        <defs>
                          <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#FF6B47" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#FF6B47" stopOpacity="0.05" />
                          </linearGradient>
                        </defs>
                        <path
                          d={(() => {
                            const maxMRR = Math.max(...usageDataByMonth.map((m) => m.mrr))
                            const points = usageDataByMonth.map((month, idx) => {
                              const x = (idx / (usageDataByMonth.length - 1)) * 100
                              const y = 100 - (month.mrr / maxMRR) * 100
                              return `${x},${y}`
                            })
                            return `M ${points.join(' L ')} L 100,100 L 0,100 Z`
                          })()}
                          fill="url(#revenueGradient)"
                        />

                        {/* Line */}
                        <polyline
                          points={usageDataByMonth.map((month, idx) => {
                            const maxMRR = Math.max(...usageDataByMonth.map((m) => m.mrr))
                            const x = (idx / (usageDataByMonth.length - 1)) * 100
                            const y = 100 - (month.mrr / maxMRR) * 100
                            return `${x},${y}`
                          }).join(' ')}
                          fill="none"
                          stroke="#FF6B47"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* Data points */}
                        {usageDataByMonth.map((month, idx) => {
                          const maxMRR = Math.max(...usageDataByMonth.map((m) => m.mrr))
                          const x = (idx / (usageDataByMonth.length - 1)) * 100
                          const y = 100 - (month.mrr / maxMRR) * 100
                          return (
                            <circle
                              key={idx}
                              cx={`${x}%`}
                              cy={`${y}%`}
                              r="4"
                              fill="#FF6B47"
                              className="hover:r-6 transition-all cursor-pointer"
                            >
                              <title>{month.month}: ${(month.mrr / 1000).toFixed(1)}K</title>
                            </circle>
                          )
                        })}
                      </svg>

                      {/* Month labels */}
                      <div className="flex justify-between mt-2">
                        {usageDataByMonth.map((month, idx) => (
                          <div key={idx} className="text-xs text-muted-foreground font-medium">
                            {month.month.substring(0, 3)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Health Trends */}
              <Card className="border border-border bg-card hover:shadow-sm transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Activity className="h-4 w-4 text-[#FF6B47]" />
                    Customer Health Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-[#10B981]/10 rounded-lg">
                        <div className="text-2xl font-bold text-[#10B981]">
                          {customerHealthTrends[customerHealthTrends.length - 1].healthy}%
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Healthy Customers</div>
                      </div>
                      <div className="text-center p-3 bg-[#F59E0B]/10 rounded-lg">
                        <div className="text-2xl font-bold text-[#F59E0B]">
                          {customerHealthTrends[customerHealthTrends.length - 1].atRisk}%
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">At Risk</div>
                      </div>
                      <div className="text-center p-3 bg-[#EF4444]/10 rounded-lg">
                        <div className="text-2xl font-bold text-[#EF4444]">
                          {customerHealthTrends[customerHealthTrends.length - 1].critical}%
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Critical</div>
                      </div>
                    </div>

                    {/* Multi-line Chart Visualization */}
                    <div className="relative h-48">
                      <svg className="w-full h-full" preserveAspectRatio="none">
                        {/* Grid lines */}
                        {[0, 25, 50, 75, 100].map((percent) => (
                          <line
                            key={percent}
                            x1="0"
                            y1={`${percent}%`}
                            x2="100%"
                            y2={`${percent}%`}
                            stroke="currentColor"
                            strokeOpacity="0.1"
                            strokeWidth="1"
                          />
                        ))}

                        {/* Healthy Line */}
                        <polyline
                          points={customerHealthTrends.map((week, idx) => {
                            const x = (idx / (customerHealthTrends.length - 1)) * 100
                            const y = 100 - week.healthy
                            return `${x},${y}`
                          }).join(' ')}
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* At Risk Line */}
                        <polyline
                          points={customerHealthTrends.map((week, idx) => {
                            const x = (idx / (customerHealthTrends.length - 1)) * 100
                            const y = 100 - week.atRisk
                            return `${x},${y}`
                          }).join(' ')}
                          fill="none"
                          stroke="#F59E0B"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* Critical Line */}
                        <polyline
                          points={customerHealthTrends.map((week, idx) => {
                            const x = (idx / (customerHealthTrends.length - 1)) * 100
                            const y = 100 - week.critical
                            return `${x},${y}`
                          }).join(' ')}
                          fill="none"
                          stroke="#EF4444"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* Data points for Healthy */}
                        {customerHealthTrends.map((week, idx) => {
                          const x = (idx / (customerHealthTrends.length - 1)) * 100
                          const y = 100 - week.healthy
                          return (
                            <circle
                              key={`healthy-${idx}`}
                              cx={`${x}%`}
                              cy={`${y}%`}
                              r="4"
                              fill="#10B981"
                              className="hover:r-6 transition-all cursor-pointer"
                            >
                              <title>{week.week}: {week.healthy}% Healthy</title>
                            </circle>
                          )
                        })}

                        {/* Data points for At Risk */}
                        {customerHealthTrends.map((week, idx) => {
                          const x = (idx / (customerHealthTrends.length - 1)) * 100
                          const y = 100 - week.atRisk
                          return (
                            <circle
                              key={`risk-${idx}`}
                              cx={`${x}%`}
                              cy={`${y}%`}
                              r="4"
                              fill="#F59E0B"
                              className="hover:r-6 transition-all cursor-pointer"
                            >
                              <title>{week.week}: {week.atRisk}% At Risk</title>
                            </circle>
                          )
                        })}

                        {/* Data points for Critical */}
                        {customerHealthTrends.map((week, idx) => {
                          const x = (idx / (customerHealthTrends.length - 1)) * 100
                          const y = 100 - week.critical
                          return (
                            <circle
                              key={`critical-${idx}`}
                              cx={`${x}%`}
                              cy={`${y}%`}
                              r="4"
                              fill="#EF4444"
                              className="hover:r-6 transition-all cursor-pointer"
                            >
                              <title>{week.week}: {week.critical}% Critical</title>
                            </circle>
                          )
                        })}
                      </svg>

                      {/* Week labels */}
                      <div className="flex justify-between mt-2">
                        {customerHealthTrends.map((week, idx) => (
                          <div key={idx} className="text-xs text-muted-foreground font-medium">
                            {week.week}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="flex justify-center gap-6">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#10B981] rounded-full" />
                        <span className="text-xs font-semibold text-foreground">Healthy</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#F59E0B] rounded-full" />
                        <span className="text-xs font-semibold text-foreground">At Risk</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#EF4444] rounded-full" />
                        <span className="text-xs font-semibold text-foreground">Critical</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Widget Grid (Optional - can be toggled) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeWidgets.filter((w) => w.enabled).map((widget) => {
                  const isLargeWidget = ["analytics", "top-products"].includes(widget.type)

                  return (
                    <div key={widget.id} className={isLargeWidget ? "lg:col-span-2" : ""}>
                      <Card className="border border-border bg-card hover:shadow-sm transition-shadow relative group">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-3 right-3 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      onClick={() => removeWidget(widget.id)}
                      title="Remove widget"
                    >
                      <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </Button>

                    {/* Product Overview Widget */}
                    {widget.type === "product-overview" && (
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-medium text-foreground">Product overview</h3>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <Select defaultValue="this-month">
                            <SelectTrigger className="w-[130px] h-9 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="this-month">This month</SelectItem>
                              <SelectItem value="last-month">Last month</SelectItem>
                              <SelectItem value="this-year">This year</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="mb-4">
                          <div className="text-3xl font-bold text-foreground mb-1">$43,630</div>
                          <div className="text-sm text-muted-foreground">Total sales</div>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-sm font-medium text-foreground">Select by product</div>
                          <div className="text-sm text-muted-foreground">New sales: 453 <ChevronDown className="h-4 w-4 inline ml-1" /></div>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-4 py-2 bg-[#FF6B47] text-white text-sm rounded-lg hover:bg-[#FF6B47]/90 transition-colors flex items-center gap-2">
                            Cosmetics
                            <Info className="h-3 w-3" />
                          </button>
                          <button className="px-4 py-2 bg-[#FF6B47]/70 text-white text-sm rounded-lg hover:bg-[#FF6B47]/80 transition-colors flex items-center gap-2">
                            Housewest
                            <Info className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Active Sales Widget */}
                    {widget.type === "active-sales" && (
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-6">
                          <h3 className="text-sm font-medium text-foreground">Active sales</h3>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="text-3xl font-bold text-foreground mb-2">$27,064</div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-muted-foreground">vs last month</span>
                              <span className="text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-md font-medium text-xs">
                                <TrendingUp className="h-3 w-3 inline mr-1" />
                                12%
                              </span>
                            </div>
                          </div>
                          <div className="flex items-end gap-1 h-16">
                            <div className="w-2 bg-[#FF6B47] rounded-sm h-[60%]"></div>
                            <div className="w-2 bg-[#FF6B47] rounded-sm h-[45%]"></div>
                            <div className="w-2 bg-[#FF6B47] rounded-sm h-[35%]"></div>
                          </div>
                        </div>
                        <button className="text-sm font-medium text-foreground hover:text-[#FF6B47] transition-colors flex items-center gap-1 mt-4">
                          See Details
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    {/* Product Revenue Widget */}
                    {widget.type === "product-revenue" && (
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-6">
                          <h3 className="text-sm font-medium text-foreground">Product Revenue</h3>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="text-3xl font-bold text-foreground mb-2">$16,568</div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-muted-foreground">vs last month</span>
                              <span className="text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-md font-medium text-xs">
                                <TrendingUp className="h-3 w-3 inline mr-1" />
                                7%
                              </span>
                            </div>
                          </div>
                          <div className="relative w-20 h-20">
                            <svg className="transform -rotate-90 w-20 h-20">
                              <circle
                                cx="40"
                                cy="40"
                                r="36"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="none"
                                className="text-muted/20"
                              />
                              <circle
                                cx="40"
                                cy="40"
                                r="36"
                                stroke="#FF6B47"
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray={`${2 * Math.PI * 36 * 0.7} ${2 * Math.PI * 36}`}
                                className="transition-all"
                              />
                            </svg>
                          </div>
                        </div>
                        <button className="text-sm font-medium text-foreground hover:text-[#FF6B47] transition-colors flex items-center gap-1 mt-4">
                          See Details
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    {/* Analytics Widget */}
                    {widget.type === "analytics" && (
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-6">
                          <h3 className="text-sm font-medium text-foreground">Analytics</h3>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-baseline gap-4">
                            <div>
                              <div className="text-2xl font-bold text-foreground">-$4.5430</div>
                              <div className="text-sm text-muted-foreground">sales</div>
                            </div>
                            <div className="text-[#EF4444] bg-[#EF4444]/10 px-2 py-0.5 rounded-md font-medium text-xs flex items-center gap-1">
                              <TrendingDown className="h-3 w-3" />
                              0.4%
                            </div>
                            <div className="flex items-baseline gap-4 ml-8">
                              <div className="text-2xl font-bold text-foreground">0.73%</div>
                              <div className="text-sm text-muted-foreground">Conv.rate</div>
                              <div className="text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-md font-medium text-xs flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                13%
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Select defaultValue="this-year">
                              <SelectTrigger className="w-[120px] h-9 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="this-year">This year</SelectItem>
                                <SelectItem value="last-year">Last year</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button variant="outline" size="sm" className="h-9">
                              <Filter className="h-4 w-4 mr-2" />
                              Filters
                            </Button>
                          </div>
                        </div>
                        {/* Chart placeholder */}
                        <div className="h-48 relative">
                          <div className="absolute inset-0 flex items-end">
                            {[3, 2.5, 3.5, 2.8, 4.2, 3.8, 3.2, 2.9].map((height, i) => (
                              <div key={i} className="flex-1 flex flex-col items-center justify-end px-2">
                                <div
                                  className="w-full bg-[#FF6B47]/20 relative rounded-t-sm"
                                  style={{ height: height * 10 + "%" }}
                                >
                                  <div className="absolute inset-0 bg-[#FF6B47]/10" style={{
                                    backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255, 107, 71, 0.1) 5px, rgba(255, 107, 71, 0.1) 10px)"
                                  }} />
                                  {i === 4 && (
                                    <>
                                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded">
                                        +19%
                                      </div>
                                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-full bg-[#FF6B47] opacity-80 rounded-full" />
                                    </>
                                  )}
                                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#FF6B47] rounded-full" />
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground pt-2">
                            <span>JAN</span>
                            <span>FEB</span>
                            <span>MAR</span>
                            <span>APR</span>
                            <span>MAY</span>
                            <span>JUN</span>
                            <span>JUL</span>
                            <span>AUG</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Sales Performance Widget */}
                    {widget.type === "sales-performance" && (
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-6">
                          <h3 className="text-sm font-medium text-foreground">Sales Performance</h3>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex items-center justify-center mb-6">
                          <div className="relative w-40 h-40">
                            <svg className="transform -rotate-90 w-40 h-40">
                              <circle
                                cx="80"
                                cy="80"
                                r="70"
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="none"
                                className="text-muted/10"
                              />
                              <circle
                                cx="80"
                                cy="80"
                                r="70"
                                stroke="#FF6B47"
                                strokeWidth="12"
                                fill="none"
                                strokeDasharray={2 * Math.PI * 70 * 0.179 + " " + 2 * Math.PI * 70}
                                strokeLinecap="round"
                              />
                              <circle
                                cx="80"
                                cy="80"
                                r="58"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="none"
                                className="text-muted/5"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                              <div className="text-3xl font-bold text-foreground">17.9%</div>
                              <div className="text-xs text-[#10B981] flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-center text-muted-foreground mb-6">Since yesterday</div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-[#FF6B47] rounded-sm" />
                              <span className="text-foreground">Total Sales per day</span>
                            </div>
                            <span className="text-muted-foreground">For week</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-[#FF6B47]/30 rounded-sm" />
                              <span className="text-foreground">Average Sales</span>
                            </div>
                            <span className="text-muted-foreground">For today</span>
                          </div>
                        </div>
                        <button className="text-sm font-medium text-foreground hover:text-[#FF6B47] transition-colors flex items-center gap-1 mt-6">
                          See Details
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    {/* Total Visits by Hourly Widget */}
                    {widget.type === "total-visits" && (
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-medium text-foreground">Total visits by hourly</h3>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                        <div className="flex items-baseline gap-2 mb-6">
                          <div className="text-3xl font-bold text-foreground">288,822</div>
                          <div className="text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-md font-medium text-xs flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            4%
                          </div>
                        </div>
                        {/* Heatmap */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-10 text-xs text-muted-foreground">MON</div>
                            <div className="flex gap-1">
                              {[0.8, 0.3, 0.2, 0.1, 0.1, 0.2, 0.4, 0.6, 0.9, 1, 0.7, 0.6, 0.5, 0.4, 0.5, 0.6, 0.7, 0.8, 0.6, 0.4, 0.5, 0.6, 0.7, 0.5].map((intensity, i) => (
                                <div
                                  key={i}
                                  className="w-3 h-8 rounded-sm"
                                  style={{ backgroundColor: `rgba(255, 107, 71, ${intensity})` }}
                                  title={`${i}:00`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-10 text-xs text-muted-foreground">TUE</div>
                            <div className="flex gap-1">
                              {[0.7, 0.4, 0.2, 0.1, 0.1, 0.3, 0.5, 0.7, 0.9, 0.95, 0.8, 0.7, 0.6, 0.5, 0.6, 0.7, 0.8, 0.9, 0.7, 0.5, 0.6, 0.7, 0.8, 0.6].map((intensity, i) => (
                                <div
                                  key={i}
                                  className="w-3 h-8 rounded-sm"
                                  style={{ backgroundColor: `rgba(255, 107, 71, ${intensity})` }}
                                  title={`${i}:00`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-10 text-xs text-muted-foreground">WED</div>
                            <div className="flex gap-1">
                              {[0.6, 0.3, 0.2, 0.1, 0.1, 0.2, 0.4, 0.6, 0.85, 1, 0.9, 0.7, 0.6, 0.5, 0.6, 0.7, 0.8, 0.85, 0.7, 0.5, 0.6, 0.7, 0.75, 0.6].map((intensity, i) => (
                                <div
                                  key={i}
                                  className="w-3 h-8 rounded-sm"
                                  style={{ backgroundColor: `rgba(255, 107, 71, ${intensity})` }}
                                  title={`${i}:00`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Top Products Widget */}
                    {widget.type === "top-products" && (
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-medium text-foreground">Top Products</h3>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <button className="text-sm font-medium text-foreground hover:text-[#FF6B47] transition-colors flex items-center gap-1">
                            See Details
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Product Card */}
                          <div className="bg-muted/30 rounded-lg p-4">
                            <div className="flex items-center gap-4">
                              <div className="w-20 h-20 bg-[#FF6B47]/10 rounded-lg flex items-center justify-center">
                                <div className="text-2xl">👕</div>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-foreground mb-1">Bild Shorts</h4>
                                <p className="text-xs text-muted-foreground mb-2">Premium cotton shorts</p>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-foreground">$49.99</span>
                                  <span className="text-xs text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-md font-medium">
                                    +24%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* Products Table */}
                          <div className="overflow-hidden">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-border">
                                  <th className="text-left font-medium text-muted-foreground pb-3">Product</th>
                                  <th className="text-left font-medium text-muted-foreground pb-3">Sales</th>
                                  <th className="text-left font-medium text-muted-foreground pb-3">Revenue</th>
                                  <th className="text-left font-medium text-muted-foreground pb-3">Stock</th>
                                  <th className="text-left font-medium text-muted-foreground pb-3">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border">
                                <tr>
                                  <td className="py-3 font-medium text-foreground">Biled Shorts</td>
                                  <td className="py-3 text-foreground">1,234</td>
                                  <td className="py-3 text-foreground">$61,700</td>
                                  <td className="py-3 text-foreground">89</td>
                                  <td className="py-3">
                                    <span className="px-2 py-1 bg-[#10B981]/10 text-[#10B981] text-xs rounded-md font-medium">
                                      In Stock
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-3 font-medium text-foreground">T Shirts _Mixi</td>
                                  <td className="py-3 text-foreground">987</td>
                                  <td className="py-3 text-foreground">$29,610</td>
                                  <td className="py-3 text-foreground">12</td>
                                  <td className="py-3">
                                    <span className="px-2 py-1 bg-[#F59E0B]/10 text-[#F59E0B] text-xs rounded-md font-medium">
                                      Low Stock
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Default widget */}
                    {!["product-overview", "active-sales", "product-revenue", "analytics", "sales-performance", "total-visits", "top-products"].includes(widget.type) && (
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <h3 className="text-sm font-medium text-foreground">{widget.title}</h3>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="text-sm text-muted-foreground">Widget content for {widget.type}</div>
                      </div>
                    )}
                  </Card>
                </div>
              )
            })}
            </div>
          </div>
        )}

        {/* Regional Tab */}
        {activeTab === "regional" && (
            <div className="space-y-6">
              {/* Regional Revenue Comparison Chart */}
              <Card className="border border-border bg-card hover:shadow-sm transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Globe className="h-4 w-4 text-[#FF6B47]" />
                    Revenue by Region
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Top performing regions */}
                    <div className="grid grid-cols-4 gap-4">
                      {regionalData.slice(0, 4).map((region, idx) => (
                        <div key={idx} className="text-center p-3 bg-muted/30 rounded-lg">
                          <div className="text-lg font-bold text-foreground">{region.revenue}</div>
                          <div className="text-xs text-muted-foreground mt-1">{region.region}</div>
                          <div className="text-xs text-[#10B981] font-medium mt-1">{region.growth}</div>
                        </div>
                      ))}
                    </div>

                    {/* Bar Chart Visualization */}
                    <div className="relative h-64">
                      <div className="absolute inset-0 flex items-end justify-between gap-3">
                        {regionalData.map((region, idx) => {
                          const maxRevenue = Math.max(...regionalData.map(r => parseInt(r.revenue.replace(/[$K,]/g, ''))))
                          const revenue = parseInt(region.revenue.replace(/[$K,]/g, ''))
                          const height = (revenue / maxRevenue) * 100

                          return (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                              <div className="w-full relative group">
                                <div
                                  className="w-full bg-[#FF6B47] rounded-t-lg hover:bg-[#FF6B47]/80 transition-all cursor-pointer relative"
                                  style={{ height: `${height * 2}px` }}
                                >
                                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap">
                                    {region.revenue}
                                  </div>
                                </div>
                              </div>
                              <div className="text-xs font-medium text-foreground text-center">{region.region}</div>
                              <div className="text-xs text-muted-foreground">{region.customers}</div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Regional Health Score Comparison */}
                <Card className="border border-border bg-card hover:shadow-sm transition-shadow">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-medium text-foreground">Regional Health Scores</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {regionalData.map((region, idx) => {
                        const healthScore = region.healthScore
                        const churnRate = parseFloat(region.churnRate)

                        return (
                          <div key={idx} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-foreground">{region.region}</span>
                              <div className="flex items-center gap-2">
                                <span className={`text-sm font-bold ${
                                  healthScore >= 80 ? 'text-[#10B981]' :
                                  healthScore >= 60 ? 'text-[#F59E0B]' : 'text-[#EF4444]'
                                }`}>
                                  {region.healthScore}
                                </span>
                                <span className="text-xs text-muted-foreground">Health</span>
                              </div>
                            </div>
                            <div className="relative h-3 bg-muted/30 rounded-full overflow-hidden">
                              <div
                                className={`absolute left-0 top-0 h-full rounded-full transition-all ${
                                  healthScore >= 80 ? 'bg-[#10B981]' :
                                  healthScore >= 60 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'
                                }`}
                                style={{ width: `${healthScore}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">{region.customers} customers</span>
                              <span className={`font-medium ${
                                churnRate < 3 ? 'text-[#10B981]' :
                                churnRate < 5 ? 'text-[#F59E0B]' : 'text-[#EF4444]'
                              }`}>
                                Churn: {region.churnRate}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Industry Distribution Chart */}
                <Card className="border border-border bg-card hover:shadow-sm transition-shadow">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-medium text-foreground">Industry Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {industryData.map((industry, idx) => {
                        const maxCustomers = Math.max(...industryData.map(i => i.customers))
                        const percentage = (industry.customers / maxCustomers) * 100

                        return (
                          <div key={idx} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-foreground">{industry.industry}</span>
                              <span className="text-xs text-[#10B981] font-medium">${(industry.avgMrr / 1000).toFixed(1)}K</span>
                            </div>
                            <div className="relative h-2.5 bg-muted/30 rounded-full overflow-hidden">
                              <div
                                className="absolute left-0 top-0 h-full bg-[#FF6B47] rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{industry.customers} customers</span>
                              <span className={`font-medium ${
                                industry.healthScore >= 80 ? 'text-[#10B981]' :
                                industry.healthScore >= 60 ? 'text-[#F59E0B]' : 'text-[#EF4444]'
                              }`}>
                                Health: {industry.healthScore}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Growth Trends by Region */}
              <Card className="border border-border bg-card hover:shadow-sm transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-[#FF6B47]" />
                    Regional Growth Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {regionalData.map((region, idx) => {
                      const growthValue = parseFloat(region.growth.replace('+', ''))
                      const isPositive = growthValue > 0

                      return (
                        <div key={idx} className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                          <div className="text-sm font-medium text-foreground mb-2">{region.region}</div>
                          <div className={`text-2xl font-bold mb-1 ${
                            isPositive ? 'text-[#10B981]' : 'text-[#EF4444]'
                          }`}>
                            {region.growth}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            {isPositive ? (
                              <TrendingUp className="h-3 w-3 text-[#10B981]" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-[#EF4444]" />
                            )}
                            <span>Growth rate</span>
                          </div>
                          <div className="mt-3 pt-3 border-t border-border">
                            <div className="text-xs text-muted-foreground">Revenue: {region.revenue}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
        )}

        {/* Customers Tab */}
        {activeTab === "customers" && (
            <div className="space-y-6">
              <Card className="border border-border bg-card hover:shadow-sm transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="text-sm font-medium text-foreground">Top Customers by Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {customers
                      .sort((a, b) => b.mrr - a.mrr)
                      .slice(0, 10)
                      .map((customer, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-[#FF6B47] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {idx + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm text-foreground truncate">{customer.name}</div>
                              <div className="text-xs text-muted-foreground truncate">
                                {customer.tier} • {customer.industry}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                            <div className="text-right">
                              <div className="text-sm font-semibold text-foreground">${customer.mrr.toLocaleString()}</div>
                              <div className="text-xs text-muted-foreground">/mo</div>
                            </div>
                            <div className="text-right">
                              <div
                                className={`text-sm font-semibold ${customer.healthScore >= 80 ? "text-[#10B981]" : customer.healthScore >= 60 ? "text-[#F59E0B]" : "text-[#EF4444]"}`}
                              >
                                {customer.healthScore}
                              </div>
                              <div className="text-xs text-muted-foreground">Score</div>
                            </div>
                            <div
                              className={`px-2 py-1 rounded-md text-xs font-medium flex-shrink-0 ${
                                customer.status === "Active"
                                  ? "bg-[#10B981]/10 text-[#10B981]"
                                  : customer.status === "At Risk"
                                    ? "bg-[#F59E0B]/10 text-[#F59E0B]"
                                    : customer.status === "Onboarding"
                                      ? "bg-muted text-muted-foreground"
                                      : "bg-[#EF4444]/10 text-[#EF4444]"
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
            </div>
        )}

        {/* Features Tab */}
        {activeTab === "features" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border border-border bg-card hover:shadow-sm transition-shadow">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-medium text-foreground">Feature Adoption</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {featureAdoptionData.map((feature, idx) => (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-foreground">{feature.feature}</span>
                          <span className="text-sm font-semibold text-foreground">{feature.adoption}%</span>
                        </div>
                        <div className="bg-muted/30 h-2 rounded-full overflow-hidden mb-1">
                          <div
                            className={`h-full rounded-full transition-all ${
                              feature.adoption >= 80
                                ? "bg-[#10B981]"
                                : feature.adoption >= 60
                                  ? "bg-[#FF6B47]"
                                  : "bg-[#F59E0B]"
                            }`}
                            style={{ width: `${feature.adoption}%` }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">{feature.users.toLocaleString()} active users</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border border-border bg-card hover:shadow-sm transition-shadow">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-medium text-foreground">Net Promoter Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-8">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-foreground mb-2">74</div>
                        <div className="text-xs text-muted-foreground">Overall NPS</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {npsData.map((segment, idx) => (
                        <div key={idx}>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-medium text-foreground">{segment.score}</span>
                            <span className="text-muted-foreground">
                              {segment.count.toLocaleString()} ({segment.percentage}%)
                            </span>
                          </div>
                          <div className="bg-muted/30 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                idx === 0 ? "bg-[#10B981]" : idx === 1 ? "bg-[#FF6B47]" : "bg-[#EF4444]"
                              }`}
                              style={{ width: `${segment.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
        )}
        </div>
      </div>
    </div>
  )
}
