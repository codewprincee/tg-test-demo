"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sparkles,
  Settings,
  BarChart3,
  ChevronLeft,
  MessageSquare,
  PanelLeftClose,
  PanelLeft,
  Plus,
  Search,
  Clock,
  Pin,
  MoreVertical,
  Archive,
  Calendar,
  Hash,
  Trash2,
  LogOut,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { useChatContext } from "@/lib/chat-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const mainNavItems = [
  { name: "AI Chat", icon: Sparkles, href: "/" },
  { name: "Actions", icon: Zap, href: "/actions" },
  { name: "Analytics", icon: BarChart3, href: "/analytics" },
  { name: "Settings", icon: Settings, href: "/settings" },
]

interface Conversation {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  messageCount?: number
  isPinned?: boolean
  tags?: string[]
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
  return conversations.slice(0, 20) // Show last 20 conversations
}

function groupConversationsByTime(conversations: Conversation[]) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const thisWeek = new Date(today)
  thisWeek.setDate(thisWeek.getDate() - 7)

  const groups = {
    pinned: conversations.filter(c => c.isPinned),
    today: [] as Conversation[],
    yesterday: [] as Conversation[],
    thisWeek: [] as Conversation[],
    older: [] as Conversation[],
  }

  conversations.forEach(conversation => {
    if (conversation.isPinned) return // Already in pinned

    const date = new Date(conversation.updatedAt)
    if (date >= today) {
      groups.today.push(conversation)
    } else if (date >= yesterday) {
      groups.yesterday.push(conversation)
    } else if (date >= thisWeek) {
      groups.thisWeek.push(conversation)
    } else {
      groups.older.push(conversation)
    }
  })

  return groups
}

function getRelativeTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
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

export function Sidebar({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
  onSelectConversation,
  onNewChat,
  currentConversationId
}: SidebarProps) {
  const pathname = usePathname()
  const { updateConversation, deleteConversation } = useChatContext()
  const [recentConversations, setRecentConversations] = useState<Conversation[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [hoveredConversation, setHoveredConversation] = useState<string | null>(null)

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

  // Filter conversations based on search
  const filteredConversations = recentConversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const groupedConversations = groupConversationsByTime(filteredConversations)

  const handleTogglePin = (conversationId: string, currentPinned: boolean) => {
    updateConversation(conversationId, { isPinned: !currentPinned })
  }

  const handleDeleteConversation = (conversationId: string) => {
    if (confirm("Are you sure you want to delete this conversation?")) {
      deleteConversation(conversationId)
    }
  }

  const ConversationGroup = ({
    title,
    conversations,
    icon: Icon
  }: {
    title: string
    conversations: Conversation[]
    icon: React.ElementType
  }) => {
    if (conversations.length === 0) return null

    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 px-3 mb-2">
          <Icon className="h-3.5 w-3.5 text-sidebar-foreground/40" />
          <h4 className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
            {title}
          </h4>
          <span className="text-xs text-sidebar-foreground/30">({conversations.length})</span>
        </div>
        <div className="space-y-1">
          {conversations.map((conversation) => {
            const isActive = currentConversationId === conversation.id
            const isHovered = hoveredConversation === conversation.id

            return (
              <div
                key={conversation.id}
                className="relative group"
                onMouseEnter={() => setHoveredConversation(conversation.id)}
                onMouseLeave={() => setHoveredConversation(null)}
              >
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full flex-col items-start gap-1.5 h-auto py-2.5 px-3 font-normal text-sm transition-all rounded-lg relative group/item",
                    isActive
                      ? "bg-muted border-l-2 border-black"
                      : "hover:bg-gray-100"
                  )}
                  onClick={() => onSelectConversation?.(conversation.id)}
                >
                  <div className="flex items-start justify-between w-full gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {conversation.isPinned && (
                        <Pin className="h-3 w-3 flex-shrink-0 text-black" fill="currentColor" />
                      )}
                      <span className={cn(
                        "truncate text-left font-medium text-sm transition-colors",
                        isActive
                          ? "text-black font-semibold"
                          : "text-gray-700 group-hover/item:text-black"
                      )}>
                        {conversation.title}
                      </span>
                    </div>
                    <span className={cn(
                      "text-xs flex-shrink-0 transition-colors",
                      isActive
                        ? "text-black/60"
                        : "text-white group-hover/item:text-white"
                    )}>
                      {getRelativeTime(new Date(conversation.updatedAt))}
                    </span>
                  </div>

                  {/* Message count and tags */}
                  <div className="flex items-center gap-2 w-full">
                    {conversation.messageCount && conversation.messageCount > 0 && (
                      <div className={cn(
                        "flex items-center gap-1 text-xs transition-colors",
                        isActive
                          ? "text-black/60"
                          : "text-gray-500 group-hover/item:text-gray-700"
                      )}>
                        <MessageSquare className="h-3 w-3" />
                        <span>{conversation.messageCount}</span>
                      </div>
                    )}
                    {conversation.tags && conversation.tags.length > 0 && (
                      <div className={cn(
                        "flex items-center gap-1 text-xs transition-colors",
                        isActive
                          ? "text-black/60"
                          : "text-white group-hover/item:text-white"
                      )}>
                        <Hash className="h-3 w-3" />
                        <span className="truncate">{conversation.tags[0]}</span>
                      </div>
                    )}
                  </div>
                </Button>

                {/* Quick Actions */}
                {isHovered && !isActive && (
                  <div className="absolute right-2 top-2 flex items-center gap-1 bg-white border border-border rounded-md p-0.5 shadow-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-6 w-6 hover:bg-muted",
                        conversation.isPinned ? "text-black" : "text-sidebar-foreground/50 hover:text-sidebar-foreground"
                      )}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleTogglePin(conversation.id, conversation.isPinned || false)
                      }}
                      title={conversation.isPinned ? "Unpin" : "Pin"}
                    >
                      <Pin className={cn("h-3 w-3", conversation.isPinned && "fill-current")} />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-muted"
                          onClick={(e) => {
                            e.stopPropagation()
                          }}
                        >
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleTogglePin(conversation.id, conversation.isPinned || false)
                          }}
                        >
                          <Pin className="h-4 w-4 mr-2" />
                          {conversation.isPinned ? "Unpin" : "Pin"} conversation
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteConversation(conversation.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete conversation
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

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

      {/* Sidebar - Enhanced Design */}
      <aside
        className={cn(
          "fixed lg:relative inset-y-0 left-0 z-50 bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-80",
          // On mobile, hide sidebar when not open; on desktop, always visible
          "lg:translate-x-0",
          !isOpen && "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-sidebar-border bg-sidebar">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-base font-display font-bold text-sidebar-foreground tracking-tight">
                TouchBase IO
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className={cn(
              "h-8 w-8 rounded-md text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent",
              isCollapsed && "mx-auto"
            )}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
        </div>

        {/* Main Navigation */}
        <nav className="px-3 py-4 space-y-1 border-b border-sidebar-border">
          {mainNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full h-11 px-3 font-normal text-sm transition-all rounded-lg",
                    isCollapsed ? "justify-center" : "justify-start gap-3",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-sm"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* Conversations Section - Enhanced */}
        {!isCollapsed && (
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* New Chat Button & Search */}
            <div className="px-3 py-4 space-y-3 border-b border-sidebar-border">
              <Button
                onClick={onNewChat}
                className="w-full h-10 justify-start gap-2 border-2 border-black bg-white hover:bg-black text-black hover:text-white transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span className="font-medium">New Conversation</span>
              </Button>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sidebar-foreground/40" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 pl-9 bg-sidebar-accent border-sidebar-border text-sm placeholder:text-sidebar-foreground/40"
                />
              </div>
            </div>

            {/* Conversations List - Timeline View */}
            <div className="flex-1 overflow-y-auto px-3 py-4">
              {recentConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <div className="w-16 h-16 rounded-full bg-sidebar-accent flex items-center justify-center mb-4">
                    <MessageSquare className="h-8 w-8 text-sidebar-foreground/30" />
                  </div>
                  <p className="text-sm font-medium text-sidebar-foreground/60 mb-1">No conversations yet</p>
                  <p className="text-xs text-sidebar-foreground/40 text-center">
                    Start a new conversation to get started
                  </p>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <div className="w-16 h-16 rounded-full bg-sidebar-accent flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-sidebar-foreground/30" />
                  </div>
                  <p className="text-sm font-medium text-sidebar-foreground/60 mb-1">No results found</p>
                  <p className="text-xs text-sidebar-foreground/40 text-center">
                    Try a different search term
                  </p>
                </div>
              ) : (
                <>
                  <ConversationGroup
                    title="Pinned"
                    conversations={groupedConversations.pinned}
                    icon={Pin}
                  />
                  <ConversationGroup
                    title="Today"
                    conversations={groupedConversations.today}
                    icon={Clock}
                  />
                  <ConversationGroup
                    title="Yesterday"
                    conversations={groupedConversations.yesterday}
                    icon={Calendar}
                  />
                  <ConversationGroup
                    title="This Week"
                    conversations={groupedConversations.thisWeek}
                    icon={Calendar}
                  />
                  <ConversationGroup
                    title="Older"
                    conversations={groupedConversations.older}
                    icon={Archive}
                  />
                </>
              )}
            </div>
          </div>
        )}

        {/* Collapsed state - Minimal view */}
        {isCollapsed && (
          <div className="flex-1 overflow-y-auto px-2 py-4">
            <div className="space-y-2">
              <Button
                onClick={onNewChat}
                size="icon"
                className="w-full h-10 border-2 border-black bg-white hover:bg-black text-black hover:text-white transition-colors"
                title="New Conversation"
              >
                <Plus className="h-5 w-5" />
              </Button>

              {recentConversations.slice(0, 8).map((conversation) => {
                const isActive = currentConversationId === conversation.id
                return (
                  <Button
                    key={conversation.id}
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "w-full h-10 transition-colors rounded-lg relative",
                      isActive
                        ? "bg-muted border-l-2 border-black"
                        : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                    )}
                    onClick={() => onSelectConversation?.(conversation.id)}
                    title={conversation.title}
                  >
                    <MessageSquare className="h-4 w-4" />
                    {conversation.isPinned && (
                      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-black rounded-full" />
                    )}
                  </Button>
                )
              })}
            </div>
          </div>
        )}

        {/* Logout Button */}
        <div className="px-3 py-3 border-t border-sidebar-border">
          <Button
            variant="ghost"
            onClick={() => {
              // Clear auth data
              if (typeof window !== "undefined") {
                localStorage.removeItem("user")
                localStorage.removeItem("isAuthenticated")
              }
              // Redirect to login
              window.location.href = "/login"
            }}
            className={cn(
              "w-full h-10 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors",
              isCollapsed ? "justify-center" : "justify-start gap-3"
            )}
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
          </Button>
        </div>

        {/* Mobile Close Button */}
        <div className="lg:hidden px-3 py-3 border-t border-sidebar-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className={cn(
              "w-full h-10 px-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-lg",
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
