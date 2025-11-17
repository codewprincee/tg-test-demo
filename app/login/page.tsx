"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Lock, Eye, EyeOff, Sparkles, BarChart3, Zap } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="w-1/2 bg-white flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-12">

            <img src="https://framerusercontent.com/images/0rzMKrHH7K3WJ8uEDEJCXL5lco.svg?width=317&height=68" alt="" />
          </div>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Log in to your Account</h1>
            <p className="text-slate-600">Welcome back! Enter your credentials to log in:</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-11 h-12 bg-slate-50 border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-11 pr-11 h-12 bg-slate-50 border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-900 text-sm">{error}</AlertDescription>
              </Alert>
            )}

            {/* Demo Credentials */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
              <p className="text-xs font-semibold text-blue-900 mb-1.5">Demo Credentials:</p>
              <div className="space-y-0.5 text-xs text-blue-800">
                <p><span className="font-medium">Email:</span> demo@trytouchbase.io</p>
                <p><span className="font-medium">Password:</span> YCdemo2025</p>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-slate-700 cursor-pointer select-none"
                >
                  Remember me
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log In"
              )}
            </Button>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-slate-600">
              Don't have an account?{" "}
              <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Marketing/Illustration */}
      <div className="w-1/2 bg-blue-600 flex items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-500 opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-blue-400 opacity-20"></div>

        <div className="relative z-10 text-center max-w-lg">
          {/* Illustration */}
          <div className="mb-16 relative">
            {/* Main illustration container */}
            <div className="relative mx-auto" style={{ width: '420px', height: '400px' }}>
              {/* Intelligence Dashboard Mockup */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 w-96 bg-white rounded-xl shadow-2xl overflow-hidden">
                {/* Browser header */}
                <div className="bg-slate-100 px-4 py-2.5 flex items-center gap-1.5 border-b border-slate-200">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                </div>

                {/* Dashboard Header */}
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-semibold text-slate-900">Customer Intelligence OS</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-xs text-slate-600">Live</span>
                    </div>
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-4 space-y-3">
                  {/* Churn Alert */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-red-900">High Churn Risk</span>
                          <span className="text-xs font-bold text-red-700">85%</span>
                        </div>
                        <p className="text-xs text-red-800">Acme Corp - Usage drop 40%</p>
                      </div>
                    </div>
                  </div>

                  {/* Warning Alert */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-orange-900">Action Required</span>
                          <span className="text-xs font-bold text-orange-700">62%</span>
                        </div>
                        <p className="text-xs text-orange-800">TechStart Inc - API errors ↑</p>
                      </div>
                    </div>
                  </div>

                  {/* Healthy Status */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-green-900">Healthy</span>
                          <span className="text-xs font-bold text-green-700">98%</span>
                        </div>
                        <p className="text-xs text-green-800">GlobalSoft - Strong engagement</p>
                      </div>
                    </div>
                  </div>

                  {/* AI Insight Box */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-blue-900 mb-1">AI Insight</p>
                        <p className="text-xs text-blue-800 leading-relaxed">
                          3 accounts showing early warning signals. Intervention recommended within 48h.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating metric cards */}
              <div className="absolute bottom-8 left-4 w-32 bg-white rounded-lg shadow-xl p-3 border border-slate-200">
                <div className="text-xs text-slate-600 mb-1">Churn Prevention</div>
                <div className="text-2xl font-bold text-green-600">94%</div>
                <div className="text-xs text-green-600 font-medium">↑ 12% this month</div>
              </div>

              <div className="absolute bottom-24 right-4 w-32 bg-white rounded-lg shadow-xl p-3 border border-slate-200">
                <div className="text-xs text-slate-600 mb-1">Active Signals</div>
                <div className="text-2xl font-bold text-blue-600">1,247</div>
                <div className="text-xs text-blue-600 font-medium">Real-time</div>
              </div>
            </div>
          </div>

          {/* Text content */}
          <div className="space-y-5 px-4">
            <h2 className="text-3xl font-bold text-white leading-tight">
              World's First Customer Intelligence OS. With AI.
            </h2>
            <p className="text-base text-blue-100 leading-relaxed">
              We are building the first real-time Customer Intelligence OS that unifies fragmented signals
              into actionable early warnings and guided interventions before your customers churn.
            </p>
          </div>

          {/* Pagination dots */}
          <div className="flex items-center justify-center gap-2 mt-10">
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <div className="w-2 h-2 rounded-full bg-white opacity-40"></div>
            <div className="w-2 h-2 rounded-full bg-white opacity-40"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
