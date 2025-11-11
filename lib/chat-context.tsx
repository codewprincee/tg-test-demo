"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isTyping?: boolean
  displayedContent?: string
  visualizationData?: any
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

interface ChatContextType {
  conversations: Conversation[]
  currentConversationId: string | null
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>
  setCurrentConversationId: React.Dispatch<React.SetStateAction<string | null>>
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)

  // Load conversations from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("chat_conversations")
      if (saved) {
        const loaded = JSON.parse(saved, (key, value) => {
          if (key === "timestamp" || key === "createdAt" || key === "updatedAt") {
            return new Date(value)
          }
          return value
        })
        setConversations(loaded)
        // Don't auto-set current conversation - let URL handling do it
      }
    }
  }, [])

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined" && conversations.length > 0) {
      localStorage.setItem("chat_conversations", JSON.stringify(conversations))
    }
  }, [conversations])

  return (
    <ChatContext.Provider value={{ conversations, currentConversationId, setConversations, setCurrentConversationId }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChatContext() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChatContext must be used within ChatProvider")
  }
  return context
}
