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
  isPinned?: boolean
  messageCount?: number
  tags?: string[]
}

interface ChatContextType {
  conversations: Conversation[]
  currentConversationId: string | null
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>
  setCurrentConversationId: React.Dispatch<React.SetStateAction<string | null>>
  updateConversation: (id: string, updates: Partial<Conversation>) => void
  deleteConversation: (id: string) => void
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

  // Update a specific conversation
  const updateConversation = (id: string, updates: Partial<Conversation>) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === id
          ? { ...conv, ...updates, updatedAt: new Date() }
          : conv
      )
    )
  }

  // Delete a conversation
  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id))
    if (currentConversationId === id) {
      setCurrentConversationId(null)
    }
  }

  return (
    <ChatContext.Provider value={{
      conversations,
      currentConversationId,
      setConversations,
      setCurrentConversationId,
      updateConversation,
      deleteConversation
    }}>
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
