"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useChatContext } from "@/lib/chat-context"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Loader2 } from "lucide-react"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const { isLoading, isAuthenticated } = useAuth()
  const { currentConversationId, setCurrentConversationId } = useChatContext()
  const pathname = usePathname()
  const router = useRouter()

  // Public routes that don't need layout
  const publicRoutes = ["/login", "/signup"]
  const isPublicRoute = publicRoutes.includes(pathname)

  // Close sidebar on mobile by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-slate-700 mx-auto mb-4" />
          <p className="text-slate-600 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  // Render public pages without layout
  if (isPublicRoute) {
    return <>{children}</>
  }

  // Render authenticated pages with layout
  if (isAuthenticated) {
    const handleSelectConversation = (conversationId: string) => {
      // Navigate to chat page with conversation ID in URL
      router.push(`/?chat=${conversationId}`)
      setCurrentConversationId(conversationId)
      // On mobile, close sidebar after selection
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false)
      }
    }

    const handleNewChat = () => {
      // Navigate to chat page without conversation ID (new chat)
      router.push("/")
      setCurrentConversationId(null)
      // On mobile, close sidebar after selection
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false)
      }
    }

    return (
      <div className="flex h-screen overflow-hidden bg-white">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onSelectConversation={handleSelectConversation}
          onNewChat={handleNewChat}
          currentConversationId={currentConversationId}
        />
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    )
  }

  // Fallback for edge cases
  return <>{children}</>
}
