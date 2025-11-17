"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sparkles, Clock } from "lucide-react"
import { generateChatResponse, generateGeminiResponseStream } from "@/lib/ai-responses"
import { useChatContext } from "@/lib/chat-context"
import { parseResponseForVisualizations } from "@/lib/visualization-generator"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isTyping?: boolean
  displayedContent?: string
  visualizationData?: any
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

// Utility functions for localStorage
function saveConversations(conversations: Conversation[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("chat_conversations", JSON.stringify(conversations))
  }
}

function loadConversations(): Conversation[] {
  if (typeof window === "undefined") return []
  const saved = localStorage.getItem("chat_conversations")
  if (!saved) return []
  return JSON.parse(saved, (key, value) => {
    if (key === "timestamp" || key === "createdAt" || key === "updatedAt") {
      return new Date(value)
    }
    return value
  })
}

function generateConversationTitle(firstMessage: string): string {
  // Create a title from first user message (max 50 chars)
  const title = firstMessage.substring(0, 50).trim()
  return title.length < firstMessage.length ? title + "..." : title
}

const suggestedPrompts = [
  {
    title: "How's my campaign?",
    description: "Get a quick overview of your campaign's performance, including reach, engagement, and ROI.",
    action: "View Report",
    icon: "📊"
  },
  {
    title: "Any spend issues?",
    description: "Identify sudden spikes or dips in ad spend and get suggestions to optimize your budget.",
    action: "Analyze Budget",
    icon: "💰"
  },
  {
    title: "Which ads work best?",
    description: "See the top-performing ads based on clicks, conversions, and engagement to refine your strategy.",
    action: "View Insights",
    icon: "🎯"
  },
]

const FormattedText = ({ content }: { content: string }) => {
  const lines = content.split("\n")

  return (
    <div className="space-y-2.5">
      {lines.map((line, idx) => {
        if (!line.trim()) return <div key={idx} className="h-1" />

        // Bold text with **
        if (line.includes("**")) {
          const parts = line.split("**")
          return (
            <div key={idx} className="text-[15px] leading-[1.6] text-slate-800">
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
            <div key={idx} className="flex gap-3 text-[15px] leading-[1.6] text-slate-800">
              <span className="text-slate-400 mt-0.5 flex-shrink-0">•</span>
              <span>{line.trim().substring(1).trim()}</span>
            </div>
          )
        }

        return (
          <div key={idx} className="text-[15px] leading-[1.6] text-slate-800">
            {line}
          </div>
        )
      })}
    </div>
  )
}

const TypingIndicator = () => (
  <div className="flex items-center gap-1.5">
    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
  </div>
)

function ChatPageContent() {
  const { conversations, currentConversationId, setConversations, setCurrentConversationId } = useChatContext()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [showAnalyticsPanel, setShowAnalyticsPanel] = useState(true)
  const initialLoadDone = useRef(false)
  const isLoadingConversation = useRef(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Sync URL with currentConversationId on mount
  useEffect(() => {
    // Only run once when conversations are loaded
    if (initialLoadDone.current || conversations.length === 0) return
    initialLoadDone.current = true

    const chatId = searchParams.get("chat")
    if (chatId) {
      // URL has a chat ID, load it
      const conversation = conversations.find((c) => c.id === chatId)
      if (conversation) {
        setCurrentConversationId(chatId)
      } else {
        // Chat ID in URL doesn't exist, redirect to home
        router.replace("/", { scroll: false })
      }
    } else if (!currentConversationId) {
      // No URL chat ID and no current conversation, but we have conversations - load most recent
      const mostRecent = conversations[0]
      setCurrentConversationId(mostRecent.id)
      router.replace(`/?chat=${mostRecent.id}`, { scroll: false })
    }
  }, [conversations, searchParams, currentConversationId, router, setCurrentConversationId])

  // Update URL when currentConversationId changes (from sidebar or new chat)
  useEffect(() => {
    const chatId = searchParams.get("chat")
    if (currentConversationId && currentConversationId !== chatId) {
      // Update URL to reflect current conversation
      router.replace(`/?chat=${currentConversationId}`, { scroll: false })
    } else if (!currentConversationId && chatId) {
      // Clear URL when starting new chat
      router.replace("/", { scroll: false })
    }
  }, [currentConversationId])

  // Load messages when currentConversationId changes (from sidebar click or URL)
  useEffect(() => {
    if (currentConversationId) {
      const conversation = conversations.find((c) => c.id === currentConversationId)
      if (conversation) {
        // Only update if messages array reference changed or length is different
        setMessages((prevMessages) => {
          // Check if messages are the same
          if (conversation.messages === prevMessages) {
            return prevMessages
          }
          // Set flag to prevent circular update
          isLoadingConversation.current = true
          setTimeout(() => {
            isLoadingConversation.current = false
          }, 0)
          return conversation.messages
        })
      }
    } else {
      // New chat - clear messages
      setMessages([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentConversationId])

  // Update current conversation when messages change (but not when loading from conversations)
  useEffect(() => {
    // Don't update if we're currently loading a conversation
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
      textareaRef.current.style.height = "60px"
    }

    // Small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 400))

    const aiMessageId = (Date.now() + 1).toString()
    let fullContent = ""

    // Add empty AI message to show typing indicator
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
    setIsStreaming(true) // Start streaming indicator

    try {
      // Stream response from Gemini
      const streamGenerator = generateGeminiResponseStream(userInput)

      for await (const chunk of streamGenerator) {
        fullContent += chunk

        // Update message with new content in real-time
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

        // Small delay to make streaming visible (adjust for speed)
        await new Promise((resolve) => setTimeout(resolve, 20))
      }

      // Generate visualizations from the complete response
      const visualizations = parseResponseForVisualizations(fullContent, userInput)
      if (visualizations.length > 0) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? {
                  ...msg,
                  visualizationData: visualizations,
                }
              : msg
          )
        )
      }

      // Streaming complete
      setIsStreaming(false)

      // If streaming didn't work, fall back to regular response
      if (!fullContent) {
        const response = await generateChatResponse(userInput)
        const fallbackVisualizations = parseResponseForVisualizations(response.text, userInput)
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? {
                  ...msg,
                  content: response.text,
                  displayedContent: response.text,
                  visualizationData: fallbackVisualizations.length > 0 ? fallbackVisualizations : undefined,
                }
              : msg
          )
        )
        setIsStreaming(false)
      }
    } catch (error) {
      console.error("Error generating response:", error)
      // Fallback to regular response
      const response = await generateChatResponse(userInput)
      const errorVisualizations = parseResponseForVisualizations(response.text, userInput)
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? {
                ...msg,
                content: response.text,
                displayedContent: response.text,
                visualizationData: errorVisualizations.length > 0 ? errorVisualizations : undefined,
              }
            : msg
        )
      )
      setIsStreaming(false)
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
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-50/30 to-white">

      {/* Split View: Chat + Visualizations */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Side: Chat Messages */}
        <div
          className={`flex flex-col bg-gradient-to-b from-white to-slate-50/30 transition-all duration-300 ${
            messages.length > 1 && showAnalyticsPanel ? "w-1/2 border-r border-slate-200" : "w-full"
          }`}
        >
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto">
        <div className="mx-auto px-8 py-10">
          {/* Welcome Section - Only shown when chat is empty */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-10">
              <div className="text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2">
                  <Sparkles className="h-7 w-7 text-slate-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-semibold text-slate-900 mb-2">{greeting}, {userName}</h2>
                  <p className="text-base text-slate-500">
                    Hey there! What can I do for your campaigns today?
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {messages.map((message, idx) => (
              <div key={message.id} className="animate-in fade-in slide-in-from-bottom-3 duration-500">
                {message.role === "assistant" ? (
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm max-w-2xl">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="h-4 w-4 text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900">{idx === 0 ? "EVA AI" : "Bella AI"}</span>
                          <span className="text-xs text-slate-400">2:03 PM</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {!message.content ? (
                        <div className="py-2">
                          <TypingIndicator />
                        </div>
                      ) : (
                        <>
                          <FormattedText content={message.content} />

                          {/* PDF Attachment - show for first message */}
                          {idx === 0 && (
                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200 mt-4">
                              <div className="w-10 h-10 rounded bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-bold text-slate-600">PDF</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate">Tech design requirements.pdf</p>
                                <p className="text-xs text-slate-500">200 KB – PDF</p>
                              </div>
                              <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600">
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                  <polyline points="7 10 12 15 17 10"/>
                                  <line x1="12" x2="12" y1="15" y2="3"/>
                                </svg>
                              </button>
                            </div>
                          )}

                          {/* View Full Analytics button - show for last AI message */}
                          {idx === messages.filter(m => m.role === "assistant").length - 1 && messages.length > 1 && (
                            <button
                              onClick={() => setShowAnalyticsPanel(true)}
                              className="mt-4 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                              View Full Analytics
                            </button>
                          )}
                        </>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Refresh">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600">
                          <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                        </svg>
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Copy">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600">
                          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                        </svg>
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Share">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600">
                          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                          <polyline points="16 6 12 2 8 6"/>
                          <line x1="12" x2="12" y1="2" y2="15"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 max-w-2xl ml-auto">
                    <div className="flex-1 text-right">
                      <div className="flex items-center justify-end gap-2 mb-2">
                        <span className="text-sm font-semibold text-slate-900">Mohab</span>
                        <span className="text-xs text-slate-400">2:02 PM</span>
                      </div>
                      <p className="text-sm text-slate-700">{message.content}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center flex-shrink-0 text-sm font-semibold text-slate-700">
                      M
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-500">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-900">AI Assistant</span>
                    <p className="text-xs text-slate-500">Thinking...</p>
                  </div>
                </div>
                <div className="pl-11 py-2">
                  <TypingIndicator />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts - Only shown when chat is empty */}
          {messages.length === 0 && (
            <div className="mx-auto space-y-6 mt-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {suggestedPrompts.map((prompt, idx) => (
                  <div
                    key={idx}
                    className="group bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handlePromptClick(prompt.title)}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-xl flex-shrink-0">
                        {prompt.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-slate-900 mb-2">{prompt.title}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {prompt.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg h-9"
                    >
                      {prompt.action}
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto">
                        <path d="M5 12h14"/>
                        <path d="m12 5 7 7-7 7"/>
                      </svg>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

          {/* Input Area */}
          <div className="border-t border-slate-100 bg-white">
            <div className="mx-auto px-8 py-5">
          <div className="relative flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex-shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14"/>
                <path d="M5 12h14"/>
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex-shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                <line x1="9" x2="9.01" y1="9" y2="9"/>
                <line x1="15" x2="15.01" y1="9" y2="9"/>
              </svg>
            </Button>
            <input
              ref={textareaRef as any}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write a message here..."
              disabled={isLoading}
              className="flex-1 h-10 resize-none border-0 bg-transparent px-2 text-sm placeholder:text-slate-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="h-9 w-9 rounded-full bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed p-0 transition-all flex-shrink-0"
            >
              {isLoading ? (
                <Clock className="h-4 w-4 animate-spin" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12 7-7 7 7"/>
                  <path d="M12 19V5"/>
                </svg>
              )}
            </Button>
          </div>
            </div>
          </div>
        </div>
        {/* End Left Side */}

        {/* Right Side: Campaign Performance Overview */}
        {messages.length > 1 && showAnalyticsPanel && (
          <div className="w-1/2 bg-white border-l border-slate-200 overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900">Campaign Performance Overview</h2>
                <button
                  onClick={() => setShowAnalyticsPanel(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Close panel"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600">
                    <path d="M18 6 6 18"/>
                    <path d="m6 6 12 12"/>
                  </svg>
                </button>
              </div>

              {/* Summary Stats */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Summary Stats</h3>
                <div className="grid grid-cols-3 gap-4">
                  {/* Total Ad Spend */}
                  <div className="border border-slate-200 rounded-lg p-4">
                    <p className="text-xs text-slate-600 mb-2">Total Ad Spend</p>
                    <div className="flex items-end justify-between">
                      <span className="text-xl font-bold text-slate-900">$12,500</span>
                      <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
                        ↑ 8%
                      </span>
                    </div>
                  </div>

                  {/* Impressions */}
                  <div className="border border-slate-200 rounded-lg p-4">
                    <p className="text-xs text-slate-600 mb-2">Impressions</p>
                    <div className="flex items-end justify-between">
                      <span className="text-xl font-bold text-slate-900">1.2M</span>
                      <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
                        ↑ 8%
                      </span>
                    </div>
                  </div>

                  {/* Clicks */}
                  <div className="border border-slate-200 rounded-lg p-4">
                    <p className="text-xs text-slate-600 mb-2">Clicks</p>
                    <div className="flex items-end justify-between">
                      <span className="text-xl font-bold text-slate-900">86,400</span>
                      <span className="text-sm font-semibold text-red-600 flex items-center gap-1">
                        ↓ 2.5%
                      </span>
                    </div>
                  </div>

                  {/* CRT */}
                  <div className="border border-slate-200 rounded-lg p-4">
                    <p className="text-xs text-slate-600 mb-2">CRT</p>
                    <div className="flex items-end justify-between">
                      <span className="text-xl font-bold text-slate-900">7.2%</span>
                      <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
                        ↑ 8%
                      </span>
                    </div>
                  </div>

                  {/* Conversions */}
                  <div className="border border-slate-200 rounded-lg p-4">
                    <p className="text-xs text-slate-600 mb-2">Conversions</p>
                    <div className="flex items-end justify-between">
                      <span className="text-xl font-bold text-slate-900">4,320</span>
                      <span className="text-sm font-semibold text-red-600 flex items-center gap-1">
                        ↓ 2.5%
                      </span>
                    </div>
                  </div>

                  {/* ROAS */}
                  <div className="border border-slate-200 rounded-lg p-4">
                    <p className="text-xs text-slate-600 mb-2">ROAS</p>
                    <div className="flex items-end justify-between">
                      <span className="text-xl font-bold text-slate-900">3.8X</span>
                      <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
                        ↑ 8%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual Breakdown - Radar Chart */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Visual Breakdown</h3>
                <div className="border border-slate-200 rounded-lg p-6">
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

                      {/* Series 1 - Pink */}
                      <polygon
                        points="200,80 280,140 280,260 200,320 120,260"
                        fill="#ec4899"
                        fillOpacity="0.2"
                        stroke="#ec4899"
                        strokeWidth="2"
                      />

                      {/* Series 2 - Blue */}
                      <polygon
                        points="200,100 260,150 260,250 200,300 140,250"
                        fill="#3b82f6"
                        fillOpacity="0.2"
                        stroke="#3b82f6"
                        strokeWidth="2"
                      />

                      {/* Series 3 - Purple */}
                      <polygon
                        points="200,90 270,145 270,255 200,310 130,255"
                        fill="#8b5cf6"
                        fillOpacity="0.2"
                        stroke="#8b5cf6"
                        strokeWidth="2"
                      />

                      {/* Day labels */}
                      <text x="200" y="40" textAnchor="middle" className="text-xs fill-slate-600 font-medium">Mon</text>
                      <text x="345" y="130" textAnchor="start" className="text-xs fill-slate-600 font-medium">Tue</text>
                      <text x="345" y="280" textAnchor="start" className="text-xs fill-slate-600 font-medium">Wed</text>
                      <text x="55" y="280" textAnchor="end" className="text-xs fill-slate-600 font-medium">Sat</text>
                      <text x="55" y="130" textAnchor="end" className="text-xs fill-slate-600 font-medium">Sun</text>

                      {/* Scale labels */}
                      <text x="210" y="150" className="text-xs fill-slate-400">200</text>
                      <text x="210" y="100" className="text-xs fill-slate-400">400</text>
                      <text x="305" y="205" className="text-xs fill-slate-400">600</text>
                      <text x="280" y="205" className="text-xs fill-slate-400">800</text>
                      <text x="250" y="80" className="text-xs fill-slate-400">1,000</text>
                    </svg>
                  </div>

                  {/* Legend */}
                  <div className="flex items-center justify-end gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                      <span className="text-xs text-slate-600">Series 1</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-xs text-slate-600">Series 2</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span className="text-xs text-slate-600">Series 3</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-4">
                  <p className="text-xs text-slate-500">Last edit: few seconds ago</p>
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" x2="12" y1="15" y2="3"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full bg-white">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto shadow-lg mb-4 animate-pulse">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <p className="text-slate-600 text-sm">Loading chat...</p>
        </div>
      </div>
    }>
      <ChatPageContent />
    </Suspense>
  )
}
