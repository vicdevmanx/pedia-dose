"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ClipboardCheck, Clock, AlertTriangle, CheckCircle, User, Pill } from "lucide-react"
import Link from "next/link"

export default function NurseDashboard() {
  // Mock data for demonstration
  const stats = {
    scheduledMedications: 15,
    completedToday: 8,
    pendingAdministrations: 7,
    adverseEvents: 2,
  }

  const medicationSchedule = [
    {
      id: 1,
      patient: "Emma Johnson",
      age: 8,
      medication: "Acetaminophen 160mg",
      time: "09:00 AM",
      status: "pending",
      route: "Oral",
    },
    {
      id: 2,
      patient: "Michael Chen",
      age: 5,
      medication: "Amoxicillin 250mg",
      time: "09:30 AM",
      status: "completed",
      route: "Oral",
    },
    {
      id: 3,
      patient: "Sarah Williams",
      age: 12,
      medication: "Ibuprofen 200mg",
      time: "10:00 AM",
      status: "pending",
      route: "Oral",
    },
    {
      id: 4,
      patient: "David Brown",
      age: 6,
      medication: "Ceftriaxone 500mg",
      time: "10:30 AM",
      status: "overdue",
      route: "IV",
    },
  ]

  const getStatusColor =(status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "overdue":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Nurse Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage medication schedules and track patient administrations.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled Today</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{stats.scheduledMedications}</div>
              <p className="text-xs text-muted-foreground">Medications for today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-green-600">{stats.completedToday}</div>
              <p className="text-xs text-muted-foreground">Administered successfully</p>
            </CardContent>
          </Card>

          <Card>


            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.pendingAdministrations}</div>
              <p className="text-xs text-muted-foreground">Awaiting administration</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Adverse Events</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-red-600">{stats.adverseEvents}</div>
              <p className="text-xs text-muted-foreground">Reported this week</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Link href="/medication-schedule">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-blue-50 text-blue-600 rounded-lg dark:bg-blue-950 dark:text-blue-400">
                    <Calendar className="h-5 sm:h-6 w-5 sm:w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">Medication Schedule</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      View and manage patient medication schedules
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/administration">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-green-50 text-green-600 rounded-lg dark:bg-green-950 dark:text-green-400">
                    <ClipboardCheck className="h-5 sm:h-6 w-5 sm:w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">Administration Log</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Record administrations and adverse events
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Today's Medication Schedule */}
        <Card className="p-0 border-0 outline-0 shadow-none">
          <CardHeader className="p-0 border-0 outline-0 shadow-none">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl font-bold sm:text-xl">
                  {/* <Pill className="h-5 w-5" /> */}
                  Today's Medication Schedule
                </CardTitle>
                <CardDescription className="text-sm">
                  Upcoming and completed medication administrations
                </CardDescription>
              </div>
              <Link href="/medication-schedule">
                <Button variant="outline" size="sm">
                  View Full Schedule
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0 border-0 outline-0 shadow-none">
            <div className="space-y-4">
              {medicationSchedule.map((med) => (
                <div
                  key={med.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-lg"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(med.status)}
                      <span className="font-medium text-sm">{med.time}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold text-sm sm:text-base">{med.patient}</span>
                        <span className="text-xs sm:text-sm text-muted-foreground">({med.age}y)</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs sm:text-sm">{med.medication}</span>
                        <Badge variant="outline" className="text-xs">
                          {med.route}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getStatusColor(med.status)} text-xs`}>
                      {med.status.charAt(0).toUpperCase() + med.status.slice(1)}
                    </Badge>
                    {med.status === "pending" && <Button size="sm">Administer</Button>}
                    {med.status === "overdue" && (
                      <Button size="sm" variant="destructive">
                        Urgent
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}