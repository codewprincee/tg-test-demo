"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Sparkles,
  Send,
  BarChart3,
  TrendingUp,
  Zap,
  ChevronRight
} from "lucide-react"
import { generateChatResponse, generateGeminiResponseStream } from "@/lib/ai-responses"
import { useChatContext } from "@/lib/chat-context"
import { parseResponseForVisualizations } from "@/lib/visualization-generator"
import { ActionCards } from "@/components/action-cards"
import { generateActionsFromContext, executeAction } from "@/lib/action-generator"
import { DynamicVisualization } from "@/components/dynamic-visualization"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isTyping?: boolean
  displayedContent?: string
  visualizationData?: any
  actions?: any[]
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

function generateConversationTitle(firstMessage: string): string {
  const title = firstMessage.substring(0, 50).trim()
  return title.length < firstMessage.length ? title + "..." : title
}

const suggestedPrompts = [
  {
    title: "API Error Analysis",
    description: "Identify which account is facing the most API errors and understand the root causes",
    prompt: "Which account is currently facing the most API errors and why?",
    icon: BarChart3,
    color: "bg-blue-600"
  },
  {
    title: "Account Health Summary",
    description: "Get a comprehensive overview of customer health metrics and churn risk indicators",
    prompt: "Give me a summary of account health across all our customers and highlight churn risk for the last quarter?",
    icon: TrendingUp,
    color: "bg-purple-600"
  },
  {
    title: "Usage Analytics",
    description: "Analyze top and bottom performing accounts by usage with strategic recommendations",
    prompt: "Tell me top 10 accounts by most usage and least usage and write an action plan for the next quarter?",
    icon: Zap,
    color: "bg-orange-600"
  },
  {
    title: "Bug Analysis",
    description: "Track which product components have introduced the most bugs across customer accounts",
    prompt: "Which product component has introduced the most bugs in the last quarter across all our accounts?",
    icon: BarChart3,
    color: "bg-red-600"
  },
]

const FormattedText = ({ content }: { content: string }) => {
  const lines = content.split("\n")

  return (
    <div className="space-y-3">
      {lines.map((line, idx) => {
        if (!line.trim()) return <div key={idx} className="h-2" />

        // Bold text with **
        if (line.includes("**")) {
          const parts = line.split("**")
          return (
            <div key={idx} className="text-[15px] leading-relaxed text-slate-700">
              {parts.map((part, i) =>
                i % 2 === 1 ? (
                  <strong key={i} className="font-semibold text-slate-900">
                    {part}
                  </strong>
                ) : (
                  part
                )
              )}
            </div>
          )
        }

        // Bullet points
        if (line.trim().startsWith("•")) {
          return (
            <div key={idx} className="flex gap-3 text-[15px] leading-relaxed text-slate-700">
              <span className="text-blue-500 mt-0.5 flex-shrink-0 font-bold">•</span>
              <span>{line.trim().substring(1).trim()}</span>
            </div>
          )
        }

        return (
          <div key={idx} className="text-[15px] leading-relaxed text-slate-700">
            {line}
          </div>
        )
      })}
    </div>
  )
}

const TypingIndicator = () => (
  <div className="flex items-center gap-1.5">
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
  </div>
)

function ChatPageContent() {
  const { conversations, currentConversationId, setConversations, setCurrentConversationId } = useChatContext()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showAnalyticsPanel, setShowAnalyticsPanel] = useState(true)
  const initialLoadDone = useRef(false)
  const isLoadingConversation = useRef(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Sync URL with currentConversationId on mount
  useEffect(() => {
    if (initialLoadDone.current || conversations.length === 0) return
    initialLoadDone.current = true

    const chatId = searchParams.get("chat")
    if (chatId) {
      const conversation = conversations.find((c) => c.id === chatId)
      if (conversation) {
        setCurrentConversationId(chatId)
      } else {
        router.replace("/", { scroll: false })
        setCurrentConversationId(null)
      }
    }
    // Removed auto-loading of most recent conversation - start fresh instead
  }, [conversations, searchParams, currentConversationId, router, setCurrentConversationId])

  // Update URL when currentConversationId changes
  useEffect(() => {
    const chatId = searchParams.get("chat")
    if (currentConversationId && currentConversationId !== chatId) {
      router.replace(`/?chat=${currentConversationId}`, { scroll: false })
    } else if (!currentConversationId && chatId) {
      router.replace("/", { scroll: false })
    }
  }, [currentConversationId, router, searchParams])

  // Load messages when currentConversationId changes
  useEffect(() => {
    if (currentConversationId) {
      const conversation = conversations.find((c) => c.id === currentConversationId)
      if (conversation) {
        setMessages((prevMessages) => {
          if (conversation.messages === prevMessages) {
            return prevMessages
          }
          isLoadingConversation.current = true
          setTimeout(() => {
            isLoadingConversation.current = false
          }, 0)
          return conversation.messages
        })
      }
    } else {
      setMessages([])
    }
  }, [currentConversationId, conversations])

  // Update current conversation when messages change
  useEffect(() => {
    if (isLoadingConversation.current) return

    if (currentConversationId && messages.length > 0) {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === currentConversationId
            ? {
                ...conv,
                messages,
                updatedAt: new Date(),
                title: conv.title || generateConversationTitle(messages.find((m) => m.role === "user")?.content || "New chat"),
              }
            : conv
        )
      )
    }
  }, [messages, currentConversationId, setConversations])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    // Create new conversation if this is the first message
    if (!currentConversationId) {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: generateConversationTitle(input),
        messages: [userMessage],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setConversations((prev) => [newConversation, ...prev])
      setCurrentConversationId(newConversation.id)
      setMessages([userMessage])
    } else {
      setMessages((prev) => [...prev, userMessage])
    }

    const userInput = input
    setInput("")
    setIsLoading(true)

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }

    await new Promise((resolve) => setTimeout(resolve, 400))

    const aiMessageId = (Date.now() + 1).toString()
    let fullContent = ""

    const initialAiMessage: Message = {
      id: aiMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isTyping: false,
      displayedContent: "",
    }

    setMessages((prev) => [...prev, initialAiMessage])
    setIsLoading(false)

    try {
      const streamGenerator = generateGeminiResponseStream(userInput)

      for await (const chunk of streamGenerator) {
        fullContent += chunk

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? {
                  ...msg,
                  content: fullContent,
                  displayedContent: fullContent,
                }
              : msg
          )
        )

        await new Promise((resolve) => setTimeout(resolve, 20))
      }

      // Generate visualizations and actions from the complete response
      const visualizations = parseResponseForVisualizations(fullContent, userInput)
      const actions = generateActionsFromContext(fullContent, userInput)

      if (visualizations.length > 0 || actions.length > 0) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? {
                  ...msg,
                  visualizationData: visualizations.length > 0 ? visualizations : undefined,
                  actions: actions.length > 0 ? actions : undefined,
                }
              : msg
          )
        )
      }

      // If streaming didn't work, fall back to regular response
      if (!fullContent) {
        const response = await generateChatResponse(userInput)
        const fallbackVisualizations = parseResponseForVisualizations(response.text, userInput)
        const fallbackActions = generateActionsFromContext(response.text, userInput)
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? {
                  ...msg,
                  content: response.text,
                  displayedContent: response.text,
                  visualizationData: fallbackVisualizations.length > 0 ? fallbackVisualizations : undefined,
                  actions: fallbackActions.length > 0 ? fallbackActions : undefined,
                }
              : msg
          )
        )
      }
    } catch (error) {
      console.error("Error generating response:", error)
      const response = await generateChatResponse(userInput)
      const errorVisualizations = parseResponseForVisualizations(response.text, userInput)
      const errorActions = generateActionsFromContext(response.text, userInput)
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? {
                ...msg,
                content: response.text,
                displayedContent: response.text,
                visualizationData: errorVisualizations.length > 0 ? errorVisualizations : undefined,
                actions: errorActions.length > 0 ? errorActions : undefined,
              }
            : msg
        )
      )
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handlePromptClick = (prompt: string) => {
    setInput(prompt)
    textareaRef.current?.focus()
  }

  const userName = "Mohab"
  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? "Good Morning" : currentHour < 18 ? "Good Afternoon" : "Good Evening"

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Split View: Chat + Analytics */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Side: Chat */}
        <div
          className={cn(
            "flex flex-col transition-all duration-300",
            messages.length > 1 && showAnalyticsPanel ? "w-1/2" : "w-full"
          )}
        >
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-6 py-8">
              {/* Welcome Section */}
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto shadow-lg">
                      <Sparkles className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold text-slate-900 mb-3">
                        {greeting}, {userName}
                      </h1>
                      <p className="text-lg text-slate-600">
                        I'm your AI analytics assistant. How can I help you today?
                      </p>
                    </div>
                  </div>

                  {/* Suggested Prompts */}
                  <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    {suggestedPrompts.map((prompt, idx) => {
                      const Icon = prompt.icon
                      return (
                        <button
                          key={idx}
                          onClick={() => handlePromptClick(prompt.prompt)}
                          className="group relative bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-slate-300 text-left"
                        >
                          <div className="flex items-start gap-4">
                            <div className={cn(
                              "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0",
                              prompt.color
                            )}>
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-semibold text-slate-900 mb-2">
                                {prompt.title}
                              </h3>
                              <p className="text-sm text-slate-600 leading-relaxed mb-3">
                                {prompt.description}
                              </p>
                              <div className="flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                                <span>Ask question</span>
                                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="space-y-6">
                {messages.map((message, idx) => (
                  <div
                    key={message.id}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                  >
                    {message.role === "assistant" ? (
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
                          <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-sm font-semibold text-slate-900">
                                TouchBase AI
                              </span>
                              <span className="text-xs text-slate-400">
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>

                            {!message.content ? (
                              <div className="py-2">
                                <TypingIndicator />
                              </div>
                            ) : (
                              <>
                                <FormattedText content={message.content} />

                                {/* Action Cards */}
                                {message.actions && message.actions.length > 0 && (
                                  <div className="mt-8 pt-6 border-t border-slate-100">
                                    <div className="flex items-center gap-2 mb-4">
                                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                      <h4 className="text-sm font-semibold text-slate-900">
                                        Recommended Actions
                                      </h4>
                                    </div>
                                    <ActionCards
                                      actions={message.actions}
                                      onExecuteAction={executeAction}
                                    />
                                  </div>
                                )}

                                {/* View Analytics Button */}
                                {idx === messages.filter(m => m.role === "assistant").length - 1 && messages.length > 1 && (
                                  <button
                                    onClick={() => setShowAnalyticsPanel(true)}
                                    className="mt-6 w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                  >
                                    <BarChart3 className="h-4 w-4" />
                                    View Full Analytics Dashboard
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-4 justify-end">
                        <div className="flex-1 min-w-0 flex justify-end">
                          <div className="max-w-2xl bg-blue-600 rounded-xl shadow-md p-6">
                            <div className="flex items-center gap-2 mb-2 justify-end">
                              <span className="text-xs text-blue-100">
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <span className="text-sm font-semibold text-white">
                                You
                              </span>
                            </div>
                            <p className="text-[15px] leading-relaxed text-white">
                              {message.content}
                            </p>
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0 shadow-md text-sm font-bold text-white">
                          {userName.charAt(0)}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
                      <Sparkles className="h-5 w-5 text-white animate-pulse" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm font-semibold text-slate-900">TouchBase AI</span>
                          <span className="text-xs text-slate-400">Thinking...</span>
                        </div>
                        <TypingIndicator />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-200 bg-white/80 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto px-6 py-5">
              <div className="relative">
                {/* Input Container */}
                <div className="relative bg-white rounded-xl border-2 border-slate-200 shadow-sm hover:border-blue-400 focus-within:border-blue-500 focus-within:shadow-md transition-all">
                  <div className="flex items-end gap-3 p-4">
                    {/* Input */}
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => {
                        setInput(e.target.value)
                        e.target.style.height = "auto"
                        e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px"
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask me anything about your accounts..."
                      disabled={isLoading}
                      className="flex-1 resize-none border-0 bg-transparent px-2 py-2 text-[15px] placeholder:text-slate-400 focus:outline-none disabled:opacity-50 max-h-[200px]"
                      rows={1}
                      style={{ height: "auto" }}
                    />

                    {/* Send Button */}
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      className={cn(
                        "p-3 rounded-lg transition-all flex-shrink-0 mb-1",
                        input.trim() && !isLoading
                          ? "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg text-white"
                          : "bg-slate-100 text-slate-400"
                      )}
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Helper Text */}
                <p className="text-xs text-slate-500 mt-3 text-center">
                  Press <kbd className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded text-xs font-mono">Enter</kbd> to send,
                  <kbd className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded text-xs font-mono ml-1">Shift + Enter</kbd> for new line
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Analytics Dashboard */}
        {messages.length > 1 && showAnalyticsPanel && (() => {
          // Get the latest assistant message with visualizations
          const latestAssistantMessage = [...messages].reverse().find(m => m.role === "assistant" && m.visualizationData && m.visualizationData.length > 0)
          const visualizations = latestAssistantMessage?.visualizationData || []

          // Find metric visualization
          const metricViz = visualizations.find((v: any) => v.type === "metric")

          // Find other visualizations (bar, pie, line, table)
          const otherViz = visualizations.filter((v: any) => v.type !== "metric")

          return (
            <div className="w-1/2 bg-white border-l border-slate-200 overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-md">
                      <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">Performance Dashboard</h2>
                      <p className="text-xs text-slate-500">Real-time analytics</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAnalyticsPanel(false)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18"/>
                      <path d="m6 6 12 12"/>
                    </svg>
                  </button>
                </div>

                {/* Dynamic Key Metrics */}
                {metricViz && (
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-slate-900 mb-4">Key Metrics</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {metricViz.data.slice(0, 6).map((metric: any, idx: number) => (
                        <div key={idx} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                          <p className="text-xs text-slate-600 mb-2 font-medium">{metric.label}</p>
                          <div className="flex items-end justify-between">
                            <span className="text-2xl font-bold text-slate-900">
                              {typeof metric.value === "number" ? metric.value.toLocaleString() : metric.value}
                            </span>
                            {metric.trend && (
                              <span className={`text-sm font-semibold flex items-center gap-1 ${
                                metric.trend === "up" ? "text-emerald-600" : metric.trend === "down" ? "text-red-600" : "text-slate-600"
                              }`}>
                                {metric.trend === "up" ? "↑" : metric.trend === "down" ? "↓" : "→"} {metric.trend}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Visual Breakdown */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Performance Trends</h3>
                <div className="border border-slate-200 rounded-lg p-6 bg-white">
                  {/* Radar Chart */}
                  <div className="relative h-80 flex items-center justify-center">
                    <svg viewBox="0 0 400 400" className="w-full h-full">
                      {/* Grid circles */}
                      <circle cx="200" cy="200" r="150" fill="none" stroke="#e2e8f0" strokeWidth="1" opacity="0.3" />
                      <circle cx="200" cy="200" r="100" fill="none" stroke="#e2e8f0" strokeWidth="1" opacity="0.3" />
                      <circle cx="200" cy="200" r="50" fill="none" stroke="#e2e8f0" strokeWidth="1" opacity="0.3" />

                      {/* Axis lines */}
                      <line x1="200" y1="50" x2="200" y2="200" stroke="#e2e8f0" strokeWidth="1" opacity="0.3" />
                      <line x1="330" y1="125" x2="200" y2="200" stroke="#e2e8f0" strokeWidth="1" opacity="0.3" />
                      <line x1="330" y1="275" x2="200" y2="200" stroke="#e2e8f0" strokeWidth="1" opacity="0.3" />
                      <line x1="70" y1="275" x2="200" y2="200" stroke="#e2e8f0" strokeWidth="1" opacity="0.3" />
                      <line x1="70" y1="125" x2="200" y2="200" stroke="#e2e8f0" strokeWidth="1" opacity="0.3" />

                      {/* Series 1 */}
                      <polygon
                        points="200,80 280,140 280,260 200,320 120,260"
                        fill="url(#gradient1)"
                        fillOpacity="0.2"
                        stroke="url(#gradient1)"
                        strokeWidth="2"
                      />

                      {/* Series 2 */}
                      <polygon
                        points="200,100 260,150 260,250 200,300 140,250"
                        fill="url(#gradient2)"
                        fillOpacity="0.2"
                        stroke="url(#gradient2)"
                        strokeWidth="2"
                      />

                      {/* Series 3 */}
                      <polygon
                        points="200,90 270,145 270,255 200,310 130,255"
                        fill="url(#gradient3)"
                        fillOpacity="0.2"
                        stroke="url(#gradient3)"
                        strokeWidth="2"
                      />

                      {/* Gradients */}
                      <defs>
                        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#ec4899" />
                          <stop offset="100%" stopColor="#f43f5e" />
                        </linearGradient>
                        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                        <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                      </defs>

                      {/* Day labels */}
                      <text x="200" y="40" textAnchor="middle" className="text-xs fill-slate-600 font-medium">Mon</text>
                      <text x="345" y="130" textAnchor="start" className="text-xs fill-slate-600 font-medium">Tue</text>
                      <text x="345" y="280" textAnchor="start" className="text-xs fill-slate-600 font-medium">Wed</text>
                      <text x="55" y="280" textAnchor="end" className="text-xs fill-slate-600 font-medium">Sat</text>
                      <text x="55" y="130" textAnchor="end" className="text-xs fill-slate-600 font-medium">Sun</text>
                    </svg>
                  </div>

                  {/* Legend */}
                  <div className="flex items-center justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                      <span className="text-xs text-slate-600 font-medium">Impressions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-xs text-slate-600 font-medium">Clicks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span className="text-xs text-slate-600 font-medium">Conversions</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-4">
                  <p className="text-xs text-slate-500">Last updated: few seconds ago</p>
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" x2="12" y1="15" y2="3"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Additional Dynamic Visualizations */}
              {otherViz.length > 0 && (
                <div className="mt-8 space-y-6">
                  <h3 className="text-sm font-semibold text-slate-900 mb-4">Detailed Analytics</h3>
                  {otherViz.map((viz: any) => (
                    <DynamicVisualization key={viz.id} visualization={viz} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )
        })()}
      </div>
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 rounded-xl bg-blue-600 flex items-center justify-center mx-auto shadow-lg mb-4 animate-pulse">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <p className="text-slate-600 text-sm font-medium">Loading your workspace...</p>
        </div>
      </div>
    }>
      <ChatPageContent />
    </Suspense>
  )
}
