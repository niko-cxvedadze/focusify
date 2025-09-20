"use client"

import * as React from "react"
import {
  Home,
  Target,
  BookOpen,
  Focus,
  Settings,
} from "lucide-react"

import { NavMain } from "@/components/ui/nav-main"
import { NavSecondary } from "@/components/ui/nav-secondary"
import { NavUser } from "@/components/ui/nav-user"
import { TeamSwitcher } from "@/components/ui/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// Focusify app data
const data = {
  user: {
    name: "Focusify User",
    email: "user@focusify.app",
    avatar: "/avatars/user.jpg",
  },
  teams: [
    {
      name: "Focusify",
      logo: Focus,
      plan: "Pro",
    },
    {
      name: "Personal",
      logo: Target,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
      isActive: true,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
    {
      title: "Support",
      url: "/support",
      icon: BookOpen,
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: Target,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary items={data.navSecondary} />
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}