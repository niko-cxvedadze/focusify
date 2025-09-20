import * as React from 'react'

import { Calendar, FileText, Folder, Home, LogOut, Mail, Settings, User } from 'lucide-react'

import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'

import { db } from '@/lib/instant'

// Menu items.
const mainMenuItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: Home
  },
  {
    title: 'Projects',
    url: '/projects',
    icon: Folder
  },
  {
    title: 'Documents',
    url: '/documents',
    icon: FileText
  },
  {
    title: 'Calendar',
    url: '/calendar',
    icon: Calendar
  },
  {
    title: 'Messages',
    url: '/messages',
    icon: Mail
  }
]

const settingsMenuItems = [
  {
    title: 'Profile',
    url: '/profile',
    icon: User
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings
  }
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = db.useAuth()

  const handleSignOut = () => {
    db.auth.signOut()
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {user?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium truncate">{user?.email}</span>
            <span className="text-xs text-muted-foreground">Free Plan</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center justify-between">
          <ThemeSwitcher />
          <SidebarMenuButton
            onClick={handleSignOut}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
