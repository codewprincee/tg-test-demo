"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  User,
  Bell,
  Shield,
  Globe,
  Zap,
  CreditCard,
  Key,
  Mail,
  Smartphone,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { toast } from "sonner"

export default function SettingsPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  // Profile settings
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    company: "Acme Inc.",
    role: user?.role || "User",
    timezone: "America/New_York",
    language: "en",
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    slackNotifications: false,
    customerAlerts: true,
    ticketUpdates: true,
    weeklyReports: true,
    churnWarnings: true,
    expansionOpportunities: false,
  })

  // Security settings
  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    sessionTimeout: "30",
    ipWhitelist: false,
  })

  // Integration settings
  const [integrations, setIntegrations] = useState({
    salesforce: { connected: true, lastSync: "2 hours ago" },
    zendesk: { connected: true, lastSync: "1 hour ago" },
    slack: { connected: false, lastSync: "Never" },
    gmail: { connected: false, lastSync: "Never" },
    hubspot: { connected: false, lastSync: "Never" },
  })

  const handleSaveProfile = async () => {
    setIsLoading(true)
    setIsSaved(false)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    setIsLoading(false)
    setIsSaved(true)
    toast.success("Profile updated successfully!")

    setTimeout(() => setIsSaved(false), 3000)
  }

  const handleSaveNotifications = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 600))
    setIsLoading(false)
    toast.success("Notification preferences updated!")
  }

  const handleSaveSecurity = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsLoading(false)
    toast.success("Security settings updated!")
  }

  const handleConnectIntegration = async (integration: string) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIntegrations({
      ...integrations,
      [integration]: {
        connected: !integrations[integration as keyof typeof integrations].connected,
        lastSync: "Just now",
      },
    })
    setIsLoading(false)
    toast.success(`${integration.charAt(0).toUpperCase() + integration.slice(1)} integration ${integrations[integration as keyof typeof integrations].connected ? "disconnected" : "connected"}!`)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="px-8 py-6">
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-sm text-slate-600 mt-1">Manage your account settings and preferences</p>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 bg-white border border-gray-200 p-1">
              <TabsTrigger value="profile" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">
                <User className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">
                <Bell className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">
                <Shield className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger value="integrations" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">
                <Zap className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Integrations</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">
                <Globe className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Preferences</span>
              </TabsTrigger>
              <TabsTrigger value="billing" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">
                <CreditCard className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Billing</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information and contact details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        placeholder="John Doe"
                        className="border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        placeholder="you@example.com"
                        className="border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={profileData.company}
                        onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                        placeholder="Company Name"
                        className="border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select value={profileData.role} onValueChange={(value) => setProfileData({ ...profileData, role: value })}>
                        <SelectTrigger className="border-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="User">User</SelectItem>
                          <SelectItem value="Manager">Manager</SelectItem>
                          <SelectItem value="Viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select value={profileData.timezone} onValueChange={(value) => setProfileData({ ...profileData, timezone: value })}>
                        <SelectTrigger className="border-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                          <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                          <SelectItem value="Europe/London">London (GMT)</SelectItem>
                          <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {isSaved && (
                    <Alert className="border-green-200 bg-green-50">
                      <Check className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-900">Profile updated successfully!</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex justify-end">
                    <Button onClick={handleSaveProfile} disabled={isLoading} className="bg-slate-700 hover:bg-slate-800">
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose how you want to be notified about updates and alerts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-4">Notification Channels</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-slate-600" />
                            <div>
                              <Label>Email Notifications</Label>
                              <p className="text-xs text-slate-500">Receive updates via email</p>
                            </div>
                          </div>
                          <Switch
                            checked={notifications.emailNotifications}
                            onCheckedChange={(checked) =>
                              setNotifications({ ...notifications, emailNotifications: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Smartphone className="h-5 w-5 text-slate-600" />
                            <div>
                              <Label>Push Notifications</Label>
                              <p className="text-xs text-slate-500">Receive push notifications</p>
                            </div>
                          </div>
                          <Switch
                            checked={notifications.pushNotifications}
                            onCheckedChange={(checked) =>
                              setNotifications({ ...notifications, pushNotifications: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Zap className="h-5 w-5 text-slate-600" />
                            <div>
                              <Label>Slack Notifications</Label>
                              <p className="text-xs text-slate-500">Send alerts to Slack</p>
                            </div>
                          </div>
                          <Switch
                            checked={notifications.slackNotifications}
                            onCheckedChange={(checked) =>
                              setNotifications({ ...notifications, slackNotifications: checked })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-4">Alert Types</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Customer Alerts</Label>
                            <p className="text-xs text-slate-500">Health score changes and at-risk notifications</p>
                          </div>
                          <Switch
                            checked={notifications.customerAlerts}
                            onCheckedChange={(checked) =>
                              setNotifications({ ...notifications, customerAlerts: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Ticket Updates</Label>
                            <p className="text-xs text-slate-500">Support ticket status changes</p>
                          </div>
                          <Switch
                            checked={notifications.ticketUpdates}
                            onCheckedChange={(checked) =>
                              setNotifications({ ...notifications, ticketUpdates: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Weekly Reports</Label>
                            <p className="text-xs text-slate-500">Automated weekly performance summaries</p>
                          </div>
                          <Switch
                            checked={notifications.weeklyReports}
                            onCheckedChange={(checked) =>
                              setNotifications({ ...notifications, weeklyReports: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Churn Warnings</Label>
                            <p className="text-xs text-slate-500">Early warning for potential churn</p>
                          </div>
                          <Switch
                            checked={notifications.churnWarnings}
                            onCheckedChange={(checked) =>
                              setNotifications({ ...notifications, churnWarnings: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Expansion Opportunities</Label>
                            <p className="text-xs text-slate-500">Upsell and cross-sell suggestions</p>
                          </div>
                          <Switch
                            checked={notifications.expansionOpportunities}
                            onCheckedChange={(checked) =>
                              setNotifications({ ...notifications, expansionOpportunities: checked })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSaveNotifications} disabled={isLoading} className="bg-slate-700 hover:bg-slate-800">
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security and authentication methods</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Key className="h-5 w-5 text-slate-600" />
                        <div>
                          <Label>Two-Factor Authentication</Label>
                          <p className="text-xs text-slate-500">Add an extra layer of security</p>
                        </div>
                      </div>
                      <Switch
                        checked={security.twoFactorEnabled}
                        onCheckedChange={(checked) => setSecurity({ ...security, twoFactorEnabled: checked })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Session Timeout</Label>
                      <Select value={security.sessionTimeout} onValueChange={(value) => setSecurity({ ...security, sessionTimeout: value })}>
                        <SelectTrigger className="border-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-slate-500">Automatically log out after inactivity</p>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-slate-600" />
                        <div>
                          <Label>IP Whitelist</Label>
                          <p className="text-xs text-slate-500">Restrict access to specific IP addresses</p>
                        </div>
                      </div>
                      <Switch
                        checked={security.ipWhitelist}
                        onCheckedChange={(checked) => setSecurity({ ...security, ipWhitelist: checked })}
                      />
                    </div>
                  </div>

                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-900 text-sm">
                      Enabling two-factor authentication requires a mobile device with an authenticator app.
                    </AlertDescription>
                  </Alert>

                  <div className="flex justify-between">
                    <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50">
                      Change Password
                    </Button>
                    <Button onClick={handleSaveSecurity} disabled={isLoading} className="bg-slate-700 hover:bg-slate-800">
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Integrations Tab */}
            <TabsContent value="integrations" className="space-y-6">
              <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Integrations</CardTitle>
                  <CardDescription>Connect your favorite tools and platforms</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(integrations).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                            <Zap className="h-5 w-5 text-slate-700" />
                          </div>
                          <div>
                            <Label className="text-base capitalize">{key}</Label>
                            <p className="text-xs text-slate-500">
                              {value.connected ? `Connected • Last sync: ${value.lastSync}` : "Not connected"}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant={value.connected ? "outline" : "default"}
                          size="sm"
                          onClick={() => handleConnectIntegration(key)}
                          disabled={isLoading}
                          className={value.connected ? "border-red-200 text-red-700 hover:bg-red-50" : "bg-slate-700 hover:bg-slate-800"}
                        >
                          {value.connected ? "Disconnect" : "Connect"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6">
              <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Application Preferences</CardTitle>
                  <CardDescription>Customize your application experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Select value={profileData.language} onValueChange={(value) => setProfileData({ ...profileData, language: value })}>
                        <SelectTrigger className="border-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                          <SelectItem value="ja">日本語</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Date Format</Label>
                      <Select defaultValue="mdy">
                        <SelectTrigger className="border-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                          <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                          <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select defaultValue="usd">
                        <SelectTrigger className="border-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usd">USD ($)</SelectItem>
                          <SelectItem value="eur">EUR (€)</SelectItem>
                          <SelectItem value="gbp">GBP (£)</SelectItem>
                          <SelectItem value="jpy">JPY (¥)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button className="bg-slate-700 hover:bg-slate-800">Save Preferences</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Billing Tab */}
            <TabsContent value="billing" className="space-y-6">
              <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Billing & Subscription</CardTitle>
                  <CardDescription>Manage your subscription and payment methods</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">Professional Plan</h3>
                        <p className="text-sm text-slate-600">$99/month • Billed monthly</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900">$99</div>
                        <p className="text-xs text-slate-500">per month</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm" className="border-slate-300">
                        Change Plan
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-200 text-red-700 hover:bg-red-50">
                        Cancel Subscription
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-4">Payment Method</h3>
                    <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-slate-600" />
                        <div>
                          <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                          <p className="text-xs text-slate-500">Expires 12/2025</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Update
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-4">Billing History</h3>
                    <div className="space-y-2">
                      {[
                        { date: "Nov 1, 2025", amount: "$99.00", status: "Paid" },
                        { date: "Oct 1, 2025", amount: "$99.00", status: "Paid" },
                        { date: "Sep 1, 2025", amount: "$99.00", status: "Paid" },
                      ].map((invoice, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-slate-900">{invoice.date}</p>
                            <p className="text-xs text-slate-500">{invoice.status}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <p className="text-sm font-semibold text-slate-900">{invoice.amount}</p>
                            <Button variant="ghost" size="sm" className="text-xs">
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
