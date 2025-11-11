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
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {/* Sidebar Toggle - Always show on mobile, show when collapsed on desktop */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-lg h-9 w-9 text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
            onClick={onToggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Organization Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 rounded-lg px-3 h-9 hover:bg-blue-50">
                <Avatar className="h-6 w-6 bg-blue-600">
                  <AvatarFallback className="bg-blue-600 text-white text-xs font-semibold">A</AvatarFallback>
                </Avatar>
                <span className="font-medium text-sm text-slate-900 hidden sm:inline">Acme Inc.</span>
                <ChevronDown className="h-4 w-4 text-slate-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuLabel className="text-xs text-slate-500 font-semibold uppercase tracking-wide">
                Organizations
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="py-2.5">
                <Avatar className="h-8 w-8 bg-blue-600 mr-3">
                  <AvatarFallback className="bg-blue-600 text-white text-sm font-semibold">A</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">Acme Inc.</p>
                  <p className="text-xs text-slate-500">Professional Plan</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="py-2.5">
                <Avatar className="h-8 w-8 bg-slate-700 mr-3">
                  <AvatarFallback className="bg-slate-700 text-white text-sm font-semibold">T</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">TechCorp</p>
                  <p className="text-xs text-slate-500">Enterprise Plan</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="py-2">
                <Building2 className="mr-2 h-4 w-4 text-slate-500" />
                <span className="text-sm">Create organization</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right Section - User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-lg h-9 w-9 hover:bg-blue-50">
              <Avatar className="h-8 w-8 bg-blue-600">
                <AvatarFallback className="bg-blue-600 text-white text-sm font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 bg-blue-600">
                  <AvatarFallback className="bg-blue-600 text-white font-semibold">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="py-2.5">
              <User className="mr-2 h-4 w-4 text-slate-500" />
              <span className="text-sm">Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="py-2.5">
              <Settings className="mr-2 h-4 w-4 text-slate-500" />
              <span className="text-sm">Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="py-2.5 text-red-600 focus:text-red-600 focus:bg-red-50">
              <LogOut className="mr-2 h-4 w-4" />
              <span className="text-sm font-medium">Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
