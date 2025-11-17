"use client"

import { useState } from "react"
import { Play, Check, AlertCircle, Clock, ChevronRight, Zap, Settings, RefreshCw, Database, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface ActionInput {
  name: string
  label: string
  type: "text" | "number" | "select" | "date"
  placeholder?: string
  required?: boolean
  options?: { label: string; value: string }[]
}

export interface Action {
  id: string
  title: string
  description: string
  icon: "zap" | "settings" | "refresh" | "database" | "send" | "play"
  category?: string
  inputs?: ActionInput[]
  estimatedTime?: string
  requiresConfirmation?: boolean
}

export type ActionStatus = "idle" | "running" | "success" | "error"

export interface ActionResult {
  status: ActionStatus
  message?: string
  data?: any
}

interface ActionCardsProps {
  actions: Action[]
  onExecuteAction?: (actionId: string, inputs: Record<string, any>) => Promise<ActionResult>
  className?: string
}

const iconMap = {
  zap: Zap,
  settings: Settings,
  refresh: RefreshCw,
  database: Database,
  send: Send,
  play: Play,
}

export function ActionCards({ actions, onExecuteAction, className = "" }: ActionCardsProps) {
  const [expandedAction, setExpandedAction] = useState<string | null>(null)
  const [actionStates, setActionStates] = useState<Record<string, { status: ActionStatus; message?: string; inputs: Record<string, any> }>>({})

  const handleExecuteAction = async (action: Action) => {
    const inputs = actionStates[action.id]?.inputs || {}

    // Validate required inputs
    if (action.inputs) {
      const missingRequired = action.inputs.filter((input) => input.required && !inputs[input.name])
      if (missingRequired.length > 0) {
        setActionStates((prev) => ({
          ...prev,
          [action.id]: {
            ...prev[action.id],
            status: "error",
            message: `Please fill in: ${missingRequired.map((i) => i.label).join(", ")}`,
          },
        }))
        return
      }
    }

    // Update to running state
    setActionStates((prev) => ({
      ...prev,
      [action.id]: { ...prev[action.id], status: "running", message: undefined },
    }))

    try {
      // Execute action
      const result = onExecuteAction
        ? await onExecuteAction(action.id, inputs)
        : await simulateActionExecution(action)

      setActionStates((prev) => ({
        ...prev,
        [action.id]: {
          ...prev[action.id],
          status: result.status,
          message: result.message,
        },
      }))

      // Auto-collapse after success
      if (result.status === "success") {
        setTimeout(() => {
          setExpandedAction(null)
        }, 2000)
      }
    } catch (error) {
      setActionStates((prev) => ({
        ...prev,
        [action.id]: {
          ...prev[action.id],
          status: "error",
          message: "Action failed. Please try again.",
        },
      }))
    }
  }

  const handleInputChange = (actionId: string, inputName: string, value: any) => {
    setActionStates((prev) => ({
      ...prev,
      [actionId]: {
        ...prev[actionId],
        inputs: {
          ...(prev[actionId]?.inputs || {}),
          [inputName]: value,
        },
        status: "idle",
        message: undefined,
      },
    }))
  }

  const toggleActionExpanded = (actionId: string) => {
    setExpandedAction(expandedAction === actionId ? null : actionId)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {actions.map((action) => {
        const Icon = iconMap[action.icon] || Play
        const state = actionStates[action.id] || { status: "idle", inputs: {} }
        const isExpanded = expandedAction === action.id
        const isRunning = state.status === "running"
        const isSuccess = state.status === "success"
        const isError = state.status === "error"

        return (
          <div
            key={action.id}
            className={cn(
              "bg-white border-2 rounded-xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md",
              isExpanded && "shadow-lg",
              isSuccess && "border-green-500 bg-green-50/50",
              isError && "border-red-500 bg-red-50/50",
              !isSuccess && !isError && "border-slate-200 hover:border-blue-300"
            )}
          >
            {/* Action Header */}
            <div
              className={cn(
                "p-5 cursor-pointer transition-colors",
                isExpanded && "bg-gradient-to-r from-blue-50 to-white"
              )}
              onClick={() => !isRunning && toggleActionExpanded(action.id)}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all",
                    isSuccess
                      ? "bg-green-500"
                      : isError
                        ? "bg-red-500"
                        : isRunning
                          ? "bg-blue-500 animate-pulse"
                          : "bg-gradient-to-br from-blue-500 to-blue-600"
                  )}
                >
                  {isRunning ? (
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  ) : isSuccess ? (
                    <Check className="h-6 w-6 text-white" />
                  ) : isError ? (
                    <AlertCircle className="h-6 w-6 text-white" />
                  ) : (
                    <Icon className="h-6 w-6 text-white" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900 mb-1">
                        {action.title}
                      </h3>
                      {action.category && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                          {action.category}
                        </span>
                      )}
                    </div>
                    <ChevronRight
                      className={cn(
                        "h-5 w-5 text-slate-400 transition-transform flex-shrink-0",
                        isExpanded && "rotate-90"
                      )}
                    />
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed mb-2">
                    {action.description}
                  </p>

                  {action.estimatedTime && !isExpanded && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock className="h-3.5 w-3.5" />
                      <span>~{action.estimatedTime}</span>
                    </div>
                  )}

                  {/* Status message */}
                  {state.message && (
                    <div
                      className={cn(
                        "mt-3 p-3 rounded-lg text-sm font-medium",
                        isSuccess && "bg-green-100 text-green-800 border border-green-200",
                        isError && "bg-red-100 text-red-800 border border-red-200",
                        !isSuccess && !isError && "bg-blue-100 text-blue-800 border border-blue-200"
                      )}
                    >
                      {state.message}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="px-5 pb-5 border-t border-slate-200 bg-gradient-to-b from-white to-slate-50/50">
                <div className="pt-5 space-y-4">
                  {/* Action Inputs */}
                  {action.inputs && action.inputs.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-slate-900 mb-3">
                        Configuration
                      </h4>
                      {action.inputs.map((input) => (
                        <div key={input.name}>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            {input.label}
                            {input.required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          {input.type === "select" ? (
                            <select
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={state.inputs[input.name] || ""}
                              onChange={(e) =>
                                handleInputChange(action.id, input.name, e.target.value)
                              }
                              disabled={isRunning}
                            >
                              <option value="">Select {input.label.toLowerCase()}</option>
                              {input.options?.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <Input
                              type={input.type}
                              placeholder={input.placeholder}
                              value={state.inputs[input.name] || ""}
                              onChange={(e) =>
                                handleInputChange(action.id, input.name, e.target.value)
                              }
                              disabled={isRunning}
                              className="h-10"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      onClick={() => handleExecuteAction(action)}
                      disabled={isRunning}
                      className={cn(
                        "flex-1 h-10 font-semibold transition-all",
                        isSuccess
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                      )}
                    >
                      {isRunning ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Executing...
                        </>
                      ) : isSuccess ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Completed
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Run Action
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => toggleActionExpanded(action.id)}
                      variant="outline"
                      disabled={isRunning}
                      className="px-4 h-10"
                    >
                      Cancel
                    </Button>
                  </div>

                  {action.estimatedTime && (
                    <p className="text-xs text-slate-500 text-center">
                      Estimated completion: {action.estimatedTime}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// Simulate action execution for demo purposes
async function simulateActionExecution(action: Action): Promise<ActionResult> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Simulate random success/failure
  const isSuccess = Math.random() > 0.1

  if (isSuccess) {
    return {
      status: "success",
      message: `${action.title} completed successfully!`,
    }
  } else {
    return {
      status: "error",
      message: "Action failed. Please check your inputs and try again.",
    }
  }
}
