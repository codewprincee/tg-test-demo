"use client"

import { MessageSquare, BarChart3, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export type ChatMode = "chat" | "visualizations" | "agent"

interface ChatModeSwitcherProps {
  currentMode: ChatMode
  onModeChange: (mode: ChatMode) => void
  messageCount: number
}

const modes = [
  { id: "chat" as ChatMode, label: "Chat", icon: MessageSquare },
  { id: "visualizations" as ChatMode, label: "Visualizations", icon: BarChart3 },
  { id: "agent" as ChatMode, label: "Agent", icon: Zap },
]

export function ChatModeSwitcher({ currentMode, onModeChange, messageCount }: ChatModeSwitcherProps) {
  const currentModeData = modes.find((m) => m.id === currentMode)
  const CurrentIcon = currentModeData?.icon || MessageSquare

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 h-10 px-3 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
        >
          <CurrentIcon className="h-4 w-4" />
          <span>{currentModeData?.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {modes.map((mode) => {
          const Icon = mode.icon
          const isActive = currentMode === mode.id
          return (
            <DropdownMenuItem
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 cursor-pointer",
                isActive && "bg-blue-50 text-blue-600 font-medium"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{mode.label}</span>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
