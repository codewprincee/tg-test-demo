"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Zap, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { ChatModeSwitcher, type ChatMode } from "@/components/chat-mode-switcher"

interface ChatAgentProps {
  messageCount: number
  onModeChange?: (mode: ChatMode) => void
}

interface Action {
  id: string
  title: string
  description: string
  status: "pending" | "in_progress" | "completed" | "failed"
  createdAt: Date
}

export function ChatAgent({ messageCount, onModeChange }: ChatAgentProps) {
  const [actionInput, setActionInput] = useState("")
  const [actions, setActions] = useState<Action[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCreateAction = async () => {
    if (!actionInput.trim() || isProcessing) return

    const newAction: Action = {
      id: Date.now().toString(),
      title: actionInput,
      description: "Processing action...",
      status: "in_progress",
      createdAt: new Date(),
    }

    setActions((prev) => [newAction, ...prev])
    setActionInput("")
    setIsProcessing(true)

    // Simulate action processing
    setTimeout(() => {
      setActions((prev) =>
        prev.map((a) =>
          a.id === newAction.id
            ? {
                ...a,
                status: "completed" as const,
                description: "Action completed successfully",
              }
            : a
        )
      )
      setIsProcessing(false)
    }, 2000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleCreateAction()
    }
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-slate-200 bg-white">
        <ChatModeSwitcher currentMode="agent" onModeChange={onModeChange || (() => {})} messageCount={messageCount} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white to-slate-50/30 px-8 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Info Card */}
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-2xl">
            <h3 className="text-base font-semibold text-blue-900 mb-2">AI-Powered Actions</h3>
            <p className="text-sm text-blue-700">
              Based on the conversation, the AI can take automated actions to help you manage customers, send emails,
              create tasks, and more. Describe what you want to do below.
            </p>
          </div>

          {/* Action Input */}
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <label className="block text-sm font-semibold text-slate-900 mb-3">Create New Action</label>
            <div className="relative">
              <Textarea
                value={actionInput}
                onChange={(e) => setActionInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tell me what action to take (e.g., 'Send follow-up emails to at-risk customers')..."
                className="min-h-[100px] w-full resize-none rounded-xl border-2 border-slate-200 bg-white px-4 py-3 pr-14 text-base leading-relaxed placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100"
                disabled={isProcessing}
              />
              <Button
                onClick={handleCreateAction}
                disabled={!actionInput.trim() || isProcessing}
                className="absolute right-2 bottom-2 h-10 w-10 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 p-0"
              >
                {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Suggested Actions */}
          {actions.length === 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Suggested Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Send follow-up emails to at-risk customers",
                  "Create support tickets for customers with API errors",
                  "Schedule check-in calls with top 10 customers",
                  "Generate churn prevention playbook",
                  "Export customer health report to CSV",
                  "Set up alerts for customers with declining usage",
                ].map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActionInput(suggestion)}
                    className="text-left px-4 py-3 rounded-xl border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all text-sm text-slate-700 hover:text-blue-700"
                  >
                    <div className="flex items-start gap-2">
                      <Zap className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span>{suggestion}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions List */}
          {actions.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Actions History</h3>
              <div className="space-y-3">
                {actions.map((action) => (
                  <div key={action.id} className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {action.status === "completed" && (
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          </div>
                        )}
                        {action.status === "in_progress" && (
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                          </div>
                        )}
                        {action.status === "failed" && (
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                          </div>
                        )}
                        {action.status === "pending" && (
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                            <Zap className="h-5 w-5 text-slate-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-slate-900 mb-1">{action.title}</h4>
                        <p className="text-sm text-slate-600 mb-2">{action.description}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>{action.createdAt.toLocaleTimeString()}</span>
                          <span>•</span>
                          <span className="capitalize">{action.status.replace("_", " ")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
