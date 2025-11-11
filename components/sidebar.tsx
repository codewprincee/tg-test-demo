"use client"

import { Button } from "@/components/ui/button"
import { Sparkles, Settings, BarChart3, ChevronLeft, MessageSquare, PanelLeftClose, PanelLeft } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

const mainNavItems = [
  { name: "AI Chat", icon: Sparkles, href: "/" },
  { name: "Analytics", icon: BarChart3, href: "/analytics" },
  { name: "Settings", icon: Settings, href: "/settings" },
]

interface Conversation {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
}

function getRecentConversations(): Conversation[] {
  if (typeof window === "undefined") return []
  const saved = localStorage.getItem("chat_conversations")
  if (!saved) return []
  const conversations = JSON.parse(saved, (key, value) => {
    if (key === "createdAt" || key === "updatedAt") {
      return new Date(value)
    }
    return value
  })
  return conversations.slice(0, 10) // Show last 10 conversations
}

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  isCollapsed: boolean
  onToggleCollapse: () => void
  onSelectConversation?: (conversationId: string) => void
  onNewChat?: () => void
  currentConversationId?: string | null
}

export function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse, onSelectConversation, onNewChat, currentConversationId }: SidebarProps) {
  const pathname = usePathname()
  const [recentConversations, setRecentConversations] = useState<Conversation[]>([])

  // Load conversations on mount and when sidebar opens
  useEffect(() => {
    if (isOpen) {
      setRecentConversations(getRecentConversations())
    }
  }, [isOpen])

  // Reload conversations when localStorage changes (from chat page)
  useEffect(() => {
    const handleStorageChange = () => {
      setRecentConversations(getRecentConversations())
    }

    window.addEventListener("storage", handleStorageChange)
    // Also check periodically in case of same-tab updates
    const interval = setInterval(handleStorageChange, 1000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300",
          isOpen && !isCollapsed ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:relative inset-y-0 left-0 z-50 bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64",
          // On mobile, hide sidebar when not open; on desktop, always visible
          "lg:translate-x-0",
          !isOpen && "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Toggle Button */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          {!isCollapsed && <span className="text-sm font-semibold text-slate-900">TouchBase IO</span>}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className={cn(
              "h-8 w-8 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50",
              isCollapsed && "mx-auto"
            )}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
        </div>

        {/* Main Navigation */}
        <nav className="px-3 py-4 space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full h-10 px-3 font-normal text-sm transition-all",
                    isCollapsed ? "justify-center" : "justify-start gap-3",
                    isActive
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* Recent Conversations */}
        {!isCollapsed && (
          <div className="px-3 py-4 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between px-3 mb-3">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recent Chats</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={onNewChat}
                className="h-7 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                New Chat
              </Button>
            </div>
            <div className="space-y-1">
              {recentConversations.length === 0 ? (
                <p className="px-3 py-2 text-xs text-slate-400 text-center">No conversations yet</p>
              ) : (
                recentConversations.map((conversation) => {
                  const isActive = currentConversationId === conversation.id
                  return (
                    <Button
                      key={conversation.id}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-3 h-9 px-3 font-normal text-sm transition-colors",
                        isActive
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      )}
                      onClick={() => onSelectConversation?.(conversation.id)}
                    >
                      <MessageSquare className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate text-left">{conversation.title}</span>
                    </Button>
                  )
                })
              )}
            </div>
          </div>
        )}

        {/* Collapsed state - show icon only */}
        {isCollapsed && (
          <div className="px-3 py-4 flex-1">
            <div className="space-y-1">
              {recentConversations.slice(0, 5).map((conversation) => {
                const isActive = currentConversationId === conversation.id
                return (
                  <Button
                    key={conversation.id}
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "w-full h-10 transition-colors",
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )}
                    onClick={() => onSelectConversation?.(conversation.id)}
                    title={conversation.title}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                )
              })}
            </div>
          </div>
        )}

        {/* Mobile Close Button */}
        <div className="lg:hidden px-3 py-3 border-t border-slate-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className={cn(
              "w-full h-10 px-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50",
              isCollapsed ? "justify-center" : "justify-start gap-3"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            {!isCollapsed && <span className="text-sm font-normal">Close</span>}
          </Button>
        </div>
      </aside>
    </>
  )
}
