"use client"

import { useState, useEffect } from "react"
import { Zap, MessageSquare, Clock, Search, Filter } from "lucide-react"
import { ActionCards } from "@/components/action-cards"
import { executeAction } from "@/lib/action-generator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  actions?: any[]
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

interface ActionWithContext {
  action: any
  conversationId: string
  conversationTitle: string
  messageId: string
  timestamp: Date
}

function getAllActionsFromConversations(): ActionWithContext[] {
  if (typeof window === "undefined") return []

  try {
    const saved = localStorage.getItem("chat_conversations")
    if (!saved) return []

    const conversations: Conversation[] = JSON.parse(saved, (key, value) => {
      if (key === "timestamp" || key === "createdAt" || key === "updatedAt") {
        return value ? new Date(value) : value
      }
      return value
    })

    const allActions: ActionWithContext[] = []

    conversations.forEach(conversation => {
      conversation.messages.forEach(message => {
        if (message.role === "assistant" && message.actions && message.actions.length > 0) {
          message.actions.forEach(action => {
            allActions.push({
              action,
              conversationId: conversation.id,
              conversationTitle: conversation.title,
              messageId: message.id,
              timestamp: new Date(message.timestamp)
            })
          })
        }
      })
    })

    // Sort by timestamp, most recent first
    return allActions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  } catch (error) {
    console.error("Error loading actions:", error)
    return []
  }
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

export default function ActionsPage() {
  const [allActions, setAllActions] = useState<ActionWithContext[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")

  useEffect(() => {
    setAllActions(getAllActionsFromConversations())

    // Reload when localStorage changes
    const handleStorageChange = () => {
      setAllActions(getAllActionsFromConversations())
    }

    window.addEventListener("storage", handleStorageChange)
    const interval = setInterval(handleStorageChange, 2000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  // Get unique categories
  const categories = ["all", ...new Set(allActions.map(a => a.action.category).filter(Boolean))]

  // Filter actions
  const filteredActions = allActions.filter(actionWithContext => {
    const matchesSearch =
      actionWithContext.action.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      actionWithContext.action.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      actionWithContext.conversationTitle.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      filterCategory === "all" ||
      actionWithContext.action.category === filterCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Actions</h1>
              <p className="text-sm text-slate-600 mt-1">
                All suggested actions from your conversations
              </p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search actions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 border-slate-300"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={filterCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterCategory(category)}
                  className={cn(
                    "whitespace-nowrap",
                    filterCategory === category
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "hover:bg-slate-100"
                  )}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {filteredActions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <Zap className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {allActions.length === 0 ? "No actions yet" : "No matching actions"}
              </h3>
              <p className="text-sm text-slate-600 text-center max-w-md">
                {allActions.length === 0
                  ? "Start conversations to get AI-powered action recommendations"
                  : "Try adjusting your search or filter criteria"
                }
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Group actions by conversation */}
              {Object.entries(
                filteredActions.reduce((groups, actionWithContext) => {
                  const key = actionWithContext.conversationId
                  if (!groups[key]) {
                    groups[key] = {
                      title: actionWithContext.conversationTitle,
                      timestamp: actionWithContext.timestamp,
                      actions: []
                    }
                  }
                  groups[key].actions.push(actionWithContext)
                  return groups
                }, {} as Record<string, { title: string; timestamp: Date; actions: ActionWithContext[] }>)
              ).map(([conversationId, group]) => (
                <div key={conversationId} className="space-y-4">
                  {/* Conversation Header */}
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                    <MessageSquare className="h-5 w-5 text-slate-400" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{group.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-slate-400" />
                        <span className="text-xs text-slate-500">
                          {getRelativeTime(group.timestamp)}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        window.location.href = `/?chat=${conversationId}`
                      }}
                      className="text-xs"
                    >
                      View Chat
                    </Button>
                  </div>

                  {/* Actions from this conversation */}
                  <ActionCards
                    actions={group.actions.map(a => a.action)}
                    onExecuteAction={executeAction}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats Footer */}
      {allActions.length > 0 && (
        <div className="bg-white border-t border-slate-200 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-600" />
                <span className="text-slate-600">
                  <span className="font-semibold text-slate-900">{filteredActions.length}</span> actions
                  {searchQuery || filterCategory !== "all" ? " found" : " available"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-slate-400" />
                <span className="text-slate-600">
                  From <span className="font-semibold text-slate-900">
                    {new Set(allActions.map(a => a.conversationId)).size}
                  </span> conversations
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
