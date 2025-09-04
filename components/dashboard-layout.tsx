import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Stethoscope,
  Users,
  Calculator,
  FileText,
  Bell,
  Calendar,
  Pill,
  ClipboardCheck,
  Package,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { AlertBell, useAlerts } from "@/components/alerts/alert-system"

interface User {
  email: string
  role: "doctor" | "nurse" | "pharmacist"
  fullName?: string
}

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState<User | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { unreadCount } = useAlerts()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const getNavigationItems = () => {
    const baseItems = [
      { href: `/dashboard/${user.role}`, icon: BarChart3, label: "Dashboard" },
      { href: `/patients`, icon: Users, label: "Patients" },
      { href: `/drugs`, icon: Pill, label: "Drug Database" },
    ]

    const roleSpecificItems = {
      doctor: [
        { href: `/dosage-calculator`, icon: Calculator, label: "Dosage Calculator" },
        { href: `/prescriptions`, icon: FileText, label: "Prescriptions" },
        { href: `/alerts`, icon: Bell, label: "Safety Alerts", badge: unreadCount },
      ],
      nurse: [
        { href: `/dashboard/nurse/schedule`, icon: Calendar, label: "Med Schedule" },
        { href: `/administration`, icon: ClipboardCheck, label: "Administration" },
      ],
      pharmacist: [
        { href: `/dispensing`, icon: Package, label: "Dispensing" },
        { href: `/prescriptions`, icon: FileText, label: "Prescriptions" },
      ],
    }

    return [...baseItems, ...roleSpecificItems[user.role]]
  }

  const navigationItems = getNavigationItems()

  const getRoleColor = (role: string) => {
    switch (role) {
      case "doctor":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "nurse":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "pharmacist":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden bg-card border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Stethoscope className="h-6 w-6 text-primary" />
          <span className="font-semibold">PediDose</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/alerts">
              <AlertBell />
            </Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex flex-col flex-grow bg-card border-r border-border">
            {/* Logo */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Stethoscope className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="font-bold text-lg">PediDose</h1>
                  <p className="text-xs text-muted-foreground">Dosage System</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/alerts">
                  <AlertBell />
                </Link>
              </Button>
            </div>

            {/* User Info */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">
                    {user.fullName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.fullName || user.email}</p>
                  <Badge className={cn("text-xs", getRoleColor(user.role))}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </div>
                    {item.badge && item.badge > 0 && (
                      <Badge className="h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500">
                        {item.badge > 9 ? "9+" : item.badge}
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border space-y-2">
              <Link
                href="/settings"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/20" onClick={() => setSidebarOpen(false)} />
            <div className="relative flex w-64 flex-col bg-card border-r border-border">
              {/* Same content as desktop sidebar */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Stethoscope className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="font-bold text-lg">PediDose</h1>
                    <p className="text-xs text-muted-foreground">Dosage System</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/alerts">
                    <AlertBell />
                  </Link>
                </Button>
              </div>

              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {user.fullName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.fullName || user.email}</p>
                    <Badge className={cn("text-xs", getRoleColor(user.role))}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>

              <nav className="flex-1 p-4 space-y-2">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted",
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </div>
                      {item.badge && item.badge > 0 && (
                        <Badge className="h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500">
                          {item.badge > 9 ? "9+" : item.badge}
                        </Badge>
                      )}
                    </Link>
                  )
                })}
              </nav>

              <div className="p-4 border-t border-border space-y-2">
                <Link
                  href="/settings"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          <main className="p-4 lg:p-8 pb-20 lg:pb-8">{children}</main>
        </div>
      </div>

      {/* Bottom Navigation for Mobile/Tablet */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex items-center justify-around p-2">
          {navigationItems.slice(0, 4).map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
