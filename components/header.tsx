"use client"

import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Menu, LogOut, Settings, User, Building2 } from "lucide-react"

interface HeaderProps {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
}

export function Header({ isSidebarOpen, onToggleSidebar }: HeaderProps) {
  const { user, logout } = useAuth()

  return (
    <header className="border-b border-border bg-card sticky top-0 z-30 shadow-sm">
      <div className="flex items-center justify-between px-6 py-3.5">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Sidebar Toggle - Always show on mobile, show when collapsed on desktop */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-md h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted lg:hidden"
            onClick={onToggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Organization Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2.5 rounded-md px-3 h-10 hover:bg-secondary">
                <Avatar className="h-7 w-7 bg-accent">
                  <AvatarFallback className="bg-accent text-accent-foreground text-xs font-bold">A</AvatarFallback>
                </Avatar>
                <span className="font-semibold text-sm text-foreground hidden sm:inline">Acme Inc.</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-72">
              <DropdownMenuLabel className="text-xs text-muted-foreground font-semibold uppercase tracking-wider px-3 py-2">
                Organizations
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="py-3 px-3">
                <Avatar className="h-9 w-9 bg-accent mr-3">
                  <AvatarFallback className="bg-accent text-accent-foreground text-sm font-bold">A</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">Acme Inc.</p>
                  <p className="text-xs text-muted-foreground">Professional Plan</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="py-3 px-3">
                <Avatar className="h-9 w-9 bg-purple mr-3">
                  <AvatarFallback className="bg-purple text-purple-foreground text-sm font-bold">T</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">TechCorp</p>
                  <p className="text-xs text-muted-foreground">Enterprise Plan</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="py-2.5 px-3">
                <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Create organization</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right Section - User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-md h-10 w-10 hover:bg-secondary">
              <Avatar className="h-8 w-8 bg-accent">
                <AvatarFallback className="bg-accent text-accent-foreground text-sm font-bold">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel className="py-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11 bg-accent">
                  <AvatarFallback className="bg-accent text-accent-foreground font-bold text-base">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="py-2.5 px-3">
              <User className="mr-2.5 h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="py-2.5 px-3">
              <Settings className="mr-2.5 h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="py-2.5 px-3 text-destructive focus:text-destructive focus:bg-destructive/10">
              <LogOut className="mr-2.5 h-4 w-4" />
              <span className="text-sm font-medium">Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
