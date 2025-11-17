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
import { Badge } from "@/components/ui/badge"
import {
  User,
  Users,
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
  Settings,
  Lock,
  Eye,
  Download,
  Upload,
  Trash2,
  LogOut,
  Crown,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
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
    salesforce: { connected: true, lastSync: "2 hours ago", status: "active" },
    zendesk: { connected: true, lastSync: "1 hour ago", status: "active" },
    slack: { connected: false, lastSync: "Never", status: "inactive" },
    gmail: { connected: false, lastSync: "Never", status: "inactive" },
    hubspot: { connected: false, lastSync: "Never", status: "inactive" },
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
        status: !integrations[integration as keyof typeof integrations].connected ? "active" : "inactive",
      },
    })
    setIsLoading(false)
    toast.success(`${integration.charAt(0).toUpperCase() + integration.slice(1)} integration ${integrations[integration as keyof typeof integrations].connected ? "disconnected" : "connected"}!`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header with Gradient */}
      <div className="relative border-b border-border bg-gradient-to-r from-[#FF6B47]/5 via-background to-[#10B981]/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative px-8 py-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-[#FF6B47]">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-display font-bold text-foreground tracking-tight">Settings</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage your account settings and preferences
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="profile" className="space-y-8">
            {/* Enhanced Tab Navigation */}
            <TabsList className="grid w-full grid-cols-6 h-auto bg-card border border-border p-1 rounded-xl shadow-sm">
              <TabsTrigger
                value="profile"
                className="data-[state=active]:bg-[#FF6B47] data-[state=active]:text-white data-[state=active]:shadow-md transition-all py-3 rounded-lg"
              >
                <User className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline font-medium">Profile</span>
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="data-[state=active]:bg-[#FF6B47] data-[state=active]:text-white data-[state=active]:shadow-md transition-all py-3 rounded-lg"
              >
                <Bell className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline font-medium">Notifications</span>
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="data-[state=active]:bg-[#FF6B47] data-[state=active]:text-white data-[state=active]:shadow-md transition-all py-3 rounded-lg"
              >
                <Shield className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline font-medium">Security</span>
              </TabsTrigger>
              <TabsTrigger
                value="integrations"
                className="data-[state=active]:bg-[#FF6B47] data-[state=active]:text-white data-[state=active]:shadow-md transition-all py-3 rounded-lg"
              >
                <Zap className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline font-medium">Integrations</span>
              </TabsTrigger>
              <TabsTrigger
                value="preferences"
                className="data-[state=active]:bg-[#FF6B47] data-[state=active]:text-white data-[state=active]:shadow-md transition-all py-3 rounded-lg"
              >
                <Globe className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline font-medium">Preferences</span>
              </TabsTrigger>
              <TabsTrigger
                value="billing"
                className="data-[state=active]:bg-[#FF6B47] data-[state=active]:text-white data-[state=active]:shadow-md transition-all py-3 rounded-lg"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline font-medium">Billing</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab - Enhanced */}
            <TabsContent value="profile" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Picture Card */}
                <Card className="border border-border bg-card shadow-sm hover:shadow-md transition-shadow lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="text-lg">Profile Picture</CardTitle>
                    <CardDescription>Update your profile image</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col items-center">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#FF6B47] to-[#10B981] flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                        {profileData.name.charAt(0) || "U"}
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button size="sm" variant="outline" className="border-border">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Profile Information Card */}
                <Card className="border border-border bg-card shadow-sm hover:shadow-md transition-shadow lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5 text-[#FF6B47]" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>Update your personal information and contact details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold">Full Name</Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          placeholder="John Doe"
                          className="border-border h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          placeholder="you@example.com"
                          className="border-border h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-semibold">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          placeholder="+1 (555) 000-0000"
                          className="border-border h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company" className="text-sm font-semibold">Company</Label>
                        <Input
                          id="company"
                          value={profileData.company}
                          onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                          placeholder="Company Name"
                          className="border-border h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role" className="text-sm font-semibold">Role</Label>
                        <Select value={profileData.role} onValueChange={(value) => setProfileData({ ...profileData, role: value })}>
                          <SelectTrigger className="border-border h-11">
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
                        <Label htmlFor="timezone" className="text-sm font-semibold">Timezone</Label>
                        <Select value={profileData.timezone} onValueChange={(value) => setProfileData({ ...profileData, timezone: value })}>
                          <SelectTrigger className="border-border h-11">
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
                      <Alert className="border-[#10B981] bg-[#10B981]/10">
                        <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                        <AlertDescription className="text-[#10B981] font-medium">Profile updated successfully!</AlertDescription>
                      </Alert>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                      <Button variant="outline" className="border-border">
                        Cancel
                      </Button>
                      <Button onClick={handleSaveProfile} disabled={isLoading} className="bg-[#FF6B47] hover:bg-[#FF6B47]/90">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Account Actions */}
              <Card className="border border-border bg-card shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
                  <CardDescription>Irreversible account actions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                    <div>
                      <h4 className="font-semibold text-foreground">Delete Account</h4>
                      <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <h4 className="font-semibold text-foreground">Export Data</h4>
                      <p className="text-sm text-muted-foreground">Download all your account data</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab - Enhanced */}
            <TabsContent value="notifications" className="space-y-6">
              <Card className="border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#FF6B47]/10">
                        <Bell className="h-5 w-5 text-[#FF6B47]" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Notification Channels</CardTitle>
                        <CardDescription>Choose how you want to receive notifications</CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-[#10B981]/10 text-[#10B981]">
                      {Object.values(notifications).filter(Boolean).length} Active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`p-4 border-2 rounded-lg transition-all ${notifications.emailNotifications ? 'border-[#FF6B47] bg-[#FF6B47]/5' : 'border-border'}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${notifications.emailNotifications ? 'bg-[#FF6B47]' : 'bg-muted'}`}>
                            <Mail className={`h-5 w-5 ${notifications.emailNotifications ? 'text-white' : 'text-muted-foreground'}`} />
                          </div>
                          <div>
                            <Label className="text-base font-semibold">Email</Label>
                            <p className="text-xs text-muted-foreground">Via email</p>
                          </div>
                        </div>
                        <Switch
                          checked={notifications.emailNotifications}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, emailNotifications: checked })
                          }
                        />
                      </div>
                      {notifications.emailNotifications && (
                        <div className="text-xs text-muted-foreground">
                          <Check className="h-3 w-3 inline mr-1 text-[#10B981]" />
                          Active
                        </div>
                      )}
                    </div>

                    <div className={`p-4 border-2 rounded-lg transition-all ${notifications.pushNotifications ? 'border-[#FF6B47] bg-[#FF6B47]/5' : 'border-border'}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${notifications.pushNotifications ? 'bg-[#FF6B47]' : 'bg-muted'}`}>
                            <Smartphone className={`h-5 w-5 ${notifications.pushNotifications ? 'text-white' : 'text-muted-foreground'}`} />
                          </div>
                          <div>
                            <Label className="text-base font-semibold">Push</Label>
                            <p className="text-xs text-muted-foreground">Mobile app</p>
                          </div>
                        </div>
                        <Switch
                          checked={notifications.pushNotifications}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, pushNotifications: checked })
                          }
                        />
                      </div>
                      {notifications.pushNotifications && (
                        <div className="text-xs text-muted-foreground">
                          <Check className="h-3 w-3 inline mr-1 text-[#10B981]" />
                          Active
                        </div>
                      )}
                    </div>

                    <div className={`p-4 border-2 rounded-lg transition-all ${notifications.slackNotifications ? 'border-[#FF6B47] bg-[#FF6B47]/5' : 'border-border'}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${notifications.slackNotifications ? 'bg-[#FF6B47]' : 'bg-muted'}`}>
                            <Zap className={`h-5 w-5 ${notifications.slackNotifications ? 'text-white' : 'text-muted-foreground'}`} />
                          </div>
                          <div>
                            <Label className="text-base font-semibold">Slack</Label>
                            <p className="text-xs text-muted-foreground">Workspace</p>
                          </div>
                        </div>
                        <Switch
                          checked={notifications.slackNotifications}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, slackNotifications: checked })
                          }
                        />
                      </div>
                      {!notifications.slackNotifications && (
                        <div className="text-xs text-muted-foreground">
                          <XCircle className="h-3 w-3 inline mr-1 text-muted-foreground" />
                          Inactive
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Bell className="h-4 w-4 text-[#FF6B47]" />
                      Alert Types
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { key: 'customerAlerts', label: 'Customer Alerts', desc: 'Health score changes and at-risk notifications', icon: AlertCircle },
                        { key: 'ticketUpdates', label: 'Ticket Updates', desc: 'Support ticket status changes', icon: CheckCircle2 },
                        { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Automated weekly performance summaries', icon: TrendingUp },
                        { key: 'churnWarnings', label: 'Churn Warnings', desc: 'Early warning for potential churn', icon: AlertCircle },
                        { key: 'expansionOpportunities', label: 'Expansion Opportunities', desc: 'Upsell and cross-sell suggestions', icon: Crown },
                      ].map(({ key, label, desc, icon: Icon }) => (
                        <div key={key} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                          <div className="flex items-start gap-3 flex-1">
                            <Icon className="h-5 w-5 text-[#FF6B47] mt-0.5" />
                            <div className="flex-1">
                              <Label className="font-semibold">{label}</Label>
                              <p className="text-xs text-muted-foreground mt-1">{desc}</p>
                            </div>
                          </div>
                          <Switch
                            checked={notifications[key as keyof typeof notifications]}
                            onCheckedChange={(checked) =>
                              setNotifications({ ...notifications, [key]: checked })
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button onClick={handleSaveNotifications} disabled={isLoading} className="bg-[#FF6B47] hover:bg-[#FF6B47]/90">
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab - Enhanced */}
            <TabsContent value="security" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#FF6B47]/10">
                        <Shield className="h-5 w-5 text-[#FF6B47]" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Authentication</CardTitle>
                        <CardDescription>Secure your account access</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border-2 border-border rounded-lg bg-gradient-to-r from-[#FF6B47]/5 to-[#10B981]/5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${security.twoFactorEnabled ? 'bg-[#10B981]' : 'bg-muted'}`}>
                            <Key className={`h-5 w-5 ${security.twoFactorEnabled ? 'text-white' : 'text-muted-foreground'}`} />
                          </div>
                          <div>
                            <Label className="font-semibold">Two-Factor Authentication</Label>
                            <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                          </div>
                        </div>
                        <Switch
                          checked={security.twoFactorEnabled}
                          onCheckedChange={(checked) => setSecurity({ ...security, twoFactorEnabled: checked })}
                        />
                      </div>
                      {security.twoFactorEnabled && (
                        <Alert className="border-[#10B981] bg-[#10B981]/10 mt-3">
                          <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                          <AlertDescription className="text-[#10B981] text-xs font-medium">
                            2FA is active and protecting your account
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="font-semibold flex items-center gap-2">
                        <Clock className="h-4 w-4 text-[#FF6B47]" />
                        Session Timeout
                      </Label>
                      <Select value={security.sessionTimeout} onValueChange={(value) => setSecurity({ ...security, sessionTimeout: value })}>
                        <SelectTrigger className="border-border h-11">
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
                      <p className="text-xs text-muted-foreground">Automatically log out after inactivity</p>
                    </div>

                    <div className="p-4 border-2 border-border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${security.ipWhitelist ? 'bg-[#10B981]' : 'bg-muted'}`}>
                            <Lock className={`h-5 w-5 ${security.ipWhitelist ? 'text-white' : 'text-muted-foreground'}`} />
                          </div>
                          <div>
                            <Label className="font-semibold">IP Whitelist</Label>
                            <p className="text-xs text-muted-foreground">Restrict access to specific IPs</p>
                          </div>
                        </div>
                        <Switch
                          checked={security.ipWhitelist}
                          onCheckedChange={(checked) => setSecurity({ ...security, ipWhitelist: checked })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#FF6B47]/10">
                        <Key className="h-5 w-5 text-[#FF6B47]" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Password & Access</CardTitle>
                        <CardDescription>Manage your credentials</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert className="border-[#F59E0B] bg-[#F59E0B]/10">
                      <AlertCircle className="h-4 w-4 text-[#F59E0B]" />
                      <AlertDescription className="text-[#F59E0B] text-sm font-medium">
                        Enabling 2FA requires a mobile device with an authenticator app.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start h-12" size="lg">
                        <Lock className="h-4 w-4 mr-3" />
                        Change Password
                      </Button>
                      <Button variant="outline" className="w-full justify-start h-12" size="lg">
                        <Eye className="h-4 w-4 mr-3" />
                        View Active Sessions
                      </Button>
                      <Button variant="outline" className="w-full justify-start h-12 border-destructive/20 text-destructive hover:bg-destructive/10">
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign Out All Devices
                      </Button>
                    </div>

                    <div className="pt-4">
                      <div className="flex justify-end">
                        <Button onClick={handleSaveSecurity} disabled={isLoading} className="bg-[#FF6B47] hover:bg-[#FF6B47]/90">
                          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Integrations Tab - Enhanced */}
            <TabsContent value="integrations" className="space-y-6">
              <Card className="border border-border bg-card shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#FF6B47]/10">
                        <Zap className="h-5 w-5 text-[#FF6B47]" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Connected Integrations</CardTitle>
                        <CardDescription>Connect your favorite tools and platforms</CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-[#10B981]/10 text-[#10B981]">
                      {Object.values(integrations).filter(i => i.connected).length} Connected
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(integrations).map(([key, value]) => (
                      <div
                        key={key}
                        className={`p-5 border-2 rounded-lg transition-all ${
                          value.connected
                            ? 'border-[#10B981] bg-[#10B981]/5'
                            : 'border-border hover:border-[#FF6B47]/30 hover:bg-muted/30'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              value.connected ? 'bg-[#10B981]' : 'bg-muted'
                            }`}>
                              <Zap className={`h-6 w-6 ${value.connected ? 'text-white' : 'text-muted-foreground'}`} />
                            </div>
                            <div>
                              <Label className="text-base font-semibold capitalize">{key}</Label>
                              <div className="flex items-center gap-2 mt-1">
                                {value.connected ? (
                                  <>
                                    <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
                                    <p className="text-xs text-muted-foreground">Active</p>
                                  </>
                                ) : (
                                  <>
                                    <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                                    <p className="text-xs text-muted-foreground">Not connected</p>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {value.connected && (
                          <div className="mb-3 p-2 bg-muted/50 rounded text-xs text-muted-foreground flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            Last sync: {value.lastSync}
                          </div>
                        )}

                        <Button
                          variant={value.connected ? "outline" : "default"}
                          size="sm"
                          onClick={() => handleConnectIntegration(key)}
                          disabled={isLoading}
                          className={`w-full ${
                            value.connected
                              ? "border-destructive/20 text-destructive hover:bg-destructive/10"
                              : "bg-[#FF6B47] hover:bg-[#FF6B47]/90 text-white"
                          }`}
                        >
                          {value.connected ? (
                            <>
                              <XCircle className="h-4 w-4 mr-2" />
                              Disconnect
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Connect
                            </>
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab - Enhanced */}
            <TabsContent value="preferences" className="space-y-6">
              <Card className="border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#FF6B47]/10">
                      <Globe className="h-5 w-5 text-[#FF6B47]" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Application Preferences</CardTitle>
                      <CardDescription>Customize your application experience</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-semibold">Language</Label>
                      <Select value={profileData.language} onValueChange={(value) => setProfileData({ ...profileData, language: value })}>
                        <SelectTrigger className="border-border h-11">
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
                      <Label className="font-semibold">Date Format</Label>
                      <Select defaultValue="mdy">
                        <SelectTrigger className="border-border h-11">
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
                      <Label className="font-semibold">Currency</Label>
                      <Select defaultValue="usd">
                        <SelectTrigger className="border-border h-11">
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

                    <div className="space-y-2">
                      <Label className="font-semibold">Time Format</Label>
                      <Select defaultValue="12h">
                        <SelectTrigger className="border-border h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12h">12-hour (2:30 PM)</SelectItem>
                          <SelectItem value="24h">24-hour (14:30)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button className="bg-[#FF6B47] hover:bg-[#FF6B47]/90">
                      Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Billing Tab - Enhanced */}
            <TabsContent value="billing" className="space-y-6">
              {/* Current Plan Card */}
              <Card className="border border-border bg-gradient-to-br from-[#FF6B47]/5 via-card to-[#10B981]/5 shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#FF6B47]">
                      <Crown className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Current Plan</CardTitle>
                      <CardDescription>Professional Plan - Active</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-card rounded-lg border border-border">
                      <div>
                        <h3 className="text-2xl font-bold text-foreground mb-1">Professional Plan</h3>
                        <p className="text-sm text-muted-foreground">Billed monthly • Next billing date: Dec 1, 2025</p>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-bold text-[#FF6B47]">$99</div>
                        <p className="text-sm text-muted-foreground">per month</p>
                      </div>
                    </div>

                    {/* Usage Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-card border border-border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-[#FF6B47]" />
                          <span className="text-xs font-semibold text-muted-foreground">TEAM MEMBERS</span>
                        </div>
                        <div className="text-2xl font-bold text-foreground">8 / 15</div>
                        <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-[#FF6B47] rounded-full" style={{ width: '53%' }}></div>
                        </div>
                      </div>
                      <div className="p-4 bg-card border border-border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="h-4 w-4 text-[#10B981]" />
                          <span className="text-xs font-semibold text-muted-foreground">API CALLS</span>
                        </div>
                        <div className="text-2xl font-bold text-foreground">42K / 100K</div>
                        <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-[#10B981] rounded-full" style={{ width: '42%' }}></div>
                        </div>
                      </div>
                      <div className="p-4 bg-card border border-border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Globe className="h-4 w-4 text-[#7c3aed]" />
                          <span className="text-xs font-semibold text-muted-foreground">STORAGE</span>
                        </div>
                        <div className="text-2xl font-bold text-foreground">24GB / 50GB</div>
                        <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-[#7c3aed] rounded-full" style={{ width: '48%' }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" size="sm" className="border-border">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Upgrade Plan
                      </Button>
                      <Button variant="outline" size="sm" className="border-destructive/20 text-destructive hover:bg-destructive/10">
                        Cancel Subscription
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="border border-border bg-card shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#FF6B47]/10">
                      <CreditCard className="h-5 w-5 text-[#FF6B47]" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Payment Method</CardTitle>
                      <CardDescription>Manage your payment information</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-5 border-2 border-border rounded-lg bg-gradient-to-r from-[#FF6B47]/5 to-[#10B981]/5 hover:border-[#FF6B47]/30 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#FF6B47] to-[#10B981] flex items-center justify-center">
                          <CreditCard className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-foreground">•••• •••• •••• 4242</p>
                          <p className="text-sm text-muted-foreground">Expires 12/2025 • Visa</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Update
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Billing History */}
              <Card className="border border-border bg-card shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#FF6B47]/10">
                        <Clock className="h-5 w-5 text-[#FF6B47]" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Billing History</CardTitle>
                        <CardDescription>Your recent invoices</CardDescription>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { date: "Nov 1, 2025", amount: "$99.00", status: "Paid", id: "INV-001" },
                      { date: "Oct 1, 2025", amount: "$99.00", status: "Paid", id: "INV-002" },
                      { date: "Sep 1, 2025", amount: "$99.00", status: "Paid", id: "INV-003" },
                    ].map((invoice, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-[#10B981]/10">
                            <CheckCircle2 className="h-5 w-5 text-[#10B981]" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{invoice.date}</p>
                            <p className="text-xs text-muted-foreground">{invoice.id} • {invoice.status}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="text-lg font-bold text-foreground">{invoice.amount}</p>
                          <Button variant="ghost" size="sm" className="text-xs">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
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
