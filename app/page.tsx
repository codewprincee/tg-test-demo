"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Sparkles, Clock, Volume2, VolumeX } from "lucide-react"
import { generateChatResponse, generateGeminiResponseStream } from "@/lib/ai-responses"
import { calculateTotalMRR, calculateAverageHealthScore, getAtRiskCustomers } from "@/lib/demo-data"
import { useChatContext } from "@/lib/chat-context"
import { ChatModeSwitcher, type ChatMode } from "@/components/chat-mode-switcher"
import { ChatVisualizationsDynamic } from "@/components/chat-visualizations-dynamic"
import { ChatAgent } from "@/components/chat-agent"
import { parseResponseForVisualizations, type VisualizationData } from "@/lib/visualization-generator"

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
  "Which account is currently facing the most API errors and why?",
  "Give me a summary of account health across all customers and highlight churn risk for the last quarter",
  "Tell me top 10 accounts by most usage and least usage and write an action plan for the next quarter",
  "Which product component has introduced the most bugs in the last quarter across all accounts?",
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
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [chatMode, setChatMode] = useState<ChatMode>("chat")
  const [visualizationContext, setVisualizationContext] = useState<string>("")
  const initialLoadDone = useRef(false)
  const isLoadingConversation = useRef(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

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

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3")
    audioRef.current.loop = true
    audioRef.current.volume = 0.12
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(console.error)
      }
      setIsMusicPlaying(!isMusicPlaying)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Update visualization context when messages change
  useEffect(() => {
    if (messages.length > 0) {
      // Get the last few messages for context
      const recentMessages = messages.slice(-3)
      const context = recentMessages
        .map((m) => `${m.role === "user" ? "User" : "AI"}: ${m.content}`)
        .join("\n\n")
      setVisualizationContext(context)
    }
  }, [messages])

  // Streaming replaces the typing effect - no longer needed

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

  // Render agent mode separately (full screen)
  if (chatMode === "agent") {
    return <ChatAgent messageCount={messages.length} onModeChange={setChatMode} />
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header with Mode Switcher */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-slate-200 bg-white">
        <ChatModeSwitcher currentMode={chatMode} onModeChange={setChatMode} messageCount={messages.length} />

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMusic}
            className="h-9 w-9 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            title={isMusicPlaying ? "Pause music" : "Play music"}
          >
            {isMusicPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Split View: Chat + Visualizations */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Side: Chat Messages */}
        <div
          className={`flex flex-col bg-gradient-to-b from-white to-slate-50/30 transition-all duration-300 ${
            chatMode === "visualizations" ? "w-1/2 border-r border-slate-200" : "w-full"
          }`}
        >
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 py-10">
          {/* Welcome Section - Only shown when chat is empty */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center  space-y-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto shadow-lg">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">AI Customer Success Assistant</h2>
                  <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Get instant insights on customer health, support tickets, revenue trends, and engagement analytics
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-8">
            {messages.map((message) => (
              <div key={message.id} className="animate-in fade-in slide-in-from-bottom-3 duration-500">
                {message.role === "assistant" ? (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                          <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-slate-900">AI Assistant</span>
                          <p className="text-xs text-slate-500">Just now</p>
                        </div>
                      </div>
                      <div className="pl-11">
                        {!message.content ? (
                          <div className="py-2">
                            <TypingIndicator />
                          </div>
                        ) : (
                          <FormattedText content={message.content} />
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <div className="max-w-[85%] space-y-3">
                      <div className="flex items-center gap-3 justify-end">
                        <div>
                          <span className="text-sm font-semibold text-slate-900">You</span>
                          <p className="text-xs text-slate-500 text-right">Just now</p>
                        </div>
                        <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src="https://media.licdn.com/dms/image/v2/D5603AQEaxeuVcHNhYw/profile-displayphoto-shrink_400_400/B56ZSO693KGoAo-/0/1737564610636?e=1764201600&v=beta&t=2SrTyhomkp0_wRDMSx5_aL6y4MLjrd3XKK6wFQOHZHM"
                            alt="User profile"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="pr-11">
                        <div className="bg-blue-600 text-white px-5 py-3 rounded-2xl rounded-tr-sm">
                          <p className="text-base leading-[1.7]">{message.content}</p>
                        </div>
                      </div>
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
            <div className="max-w-4xl mx-auto space-y-6 mt-8">
              <h3 className="text-sm font-semibold text-slate-600 text-center">Try asking about...</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePromptClick(prompt)}
                    className="group text-left px-6 py-5 rounded-2xl border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all text-base text-slate-700 hover:text-blue-700 leading-relaxed shadow-sm hover:shadow-lg"
                  >
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-slate-400 group-hover:text-blue-600 mt-0.5 flex-shrink-0 transition-colors" />
                      <span className="font-medium">{prompt}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

          {/* Input Area */}
          <div className="border-t border-slate-200 bg-white/80 backdrop-blur-sm">
            <div className="max-w-5xl mx-auto px-8 py-6">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                e.target.style.height = "60px"
                e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px"
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your customers, analytics, or insights..."
              disabled={isLoading}
              className="min-h-[60px] w-full resize-none rounded-2xl border-2 border-slate-200 bg-white px-6 py-4 pr-16 text-base leading-relaxed placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
              rows={1}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-2.5 bottom-2.5 h-11 w-11 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed p-0 transition-all shadow-sm hover:shadow-md"
            >
              {isLoading ? (
                <Clock className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
              <p className="text-xs text-slate-500 mt-4 text-center font-medium">
                Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600">Enter</kbd> to send • <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600">Shift + Enter</kbd> for new line
              </p>
            </div>
          </div>
        </div>
        {/* End Left Side */}

        {/* Right Side: Visualizations */}
        {chatMode === "visualizations" && (
          <div className="w-1/2 bg-white overflow-hidden">
            <ChatVisualizationsDynamic
              messageCount={messages.length}
              conversationContext={visualizationContext}
              visualizations={
                messages.length > 0 && messages[messages.length - 1].role === "assistant"
                  ? messages[messages.length - 1].visualizationData
                  : undefined
              }
              isLoading={isLoading}
            />
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
