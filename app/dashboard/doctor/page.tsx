"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MedicalAlert } from "@/components/medical-alert"
import { Users, Calculator, FileText, Bell, Clock } from "lucide-react"
import Link from "next/link"

export default function DoctorDashboard() {
  const stats = {
    totalPatients: 24,
    activePrescriptions: 18,
    pendingAlerts: 3,
    calculationsToday: 12,
  }

  const recentAlerts = [
    {
      id: 1,
      type: "danger" as const,
      patient: "Emma Johnson (8y)",
      drug: "Acetaminophen",
      message: "Dosage exceeds maximum safe limit for weight",
      time: "2 minutes ago",
    },
    {
      id: 2,
      type: "caution" as const,
      patient: "Michael Chen (5y)",
      drug: "Amoxicillin",
      message: "Patient has documented penicillin allergy",
      time: "15 minutes ago",
    },
    {
      id: 3,
      type: "safe" as const,
      patient: "Sarah Williams (12y)",
      drug: "Ibuprofen",
      message: "Dosage calculation verified and approved",
      time: "1 hour ago",
    },
  ]

  const quickActions = [
    {
      title: "Patient List",
      description: "View and manage your patients",
      icon: Users,
      href: "/patients",
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
    },
    {
      title: "Dosage Calculator",
      description: "Calculate safe pediatric dosages",
      icon: Calculator,
      href: "/dosage-calculator",
      color: "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400",
    },
    {
      title: "Prescriptions",
      description: "Manage prescriptions and orders",
      icon: FileText,
      href: "/prescriptions",
      color: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Doctor Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your patients and recent activity.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPatients}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+2</span> from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Prescriptions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activePrescriptions}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-blue-600">+5</span> from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Safety Alerts</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.pendingAlerts}</div>
              <p className="text-xs text-muted-foreground">Requires immediate attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Calculations Today</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.calculationsToday}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+3</span> from yesterday
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-0 border-0 outline-0 shadow-none">
          <CardHeader className="p-0 border-0 outline-0 shadow-none">
            <CardTitle className='text-xl font-bold'>Quick Actions</CardTitle>
            <CardDescription>Access frequently used tools and features</CardDescription>
          </CardHeader>
          <CardContent className="p-0 border-0 outline-0 shadow-none">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {quickActions.map((action) => (
                <Link key={action.href} href={action.href}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${action.color}`}>
                          <action.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{action.title}</h3>
                          <p className="text-xs text-muted-foreground">{action.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Safety Alerts Panel */}
        <Card className="p-0 border-0 outline-0 shadow-none">
          <CardHeader className="p-0 border-0 outline-0 shadow-none">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Safety Alerts
                </CardTitle>
                <CardDescription className="p-0 border-0 outline-0 shadow-none">
                  Recent alerts for unsafe prescriptions and dosage warnings
                </CardDescription>
              </div>
              <Link href="/alerts">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-0 border-0 outline-0 shadow-none">
            {recentAlerts.map((alert) => (
              <MedicalAlert key={alert.id} type={alert.type}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">{alert.patient}</span>
                      <Badge variant="outline" className="text-xs">
                        {alert.drug}
                      </Badge>
                    </div>
                    <p className="text-sm">{alert.message}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {alert.time}
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="whitespace-nowrap">
                    Review
                  </Button>
                </div>
              </MedicalAlert>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
