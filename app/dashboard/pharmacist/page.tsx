"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, FileText, Clock, CheckCircle, AlertTriangle, User, Pill, Scan } from "lucide-react"
import Link from "next/link"

export default function PharmacistDashboard() {
  // Mock data for demonstration
  const stats = {
    incomingPrescriptions: 12,
    dispensedToday: 8,
    pendingVerification: 4,
    lowStockAlerts: 3,
  }

  const incomingPrescriptions = [
    {
      id: 1,
      patient: "Emma Johnson",
      age: 8,
      doctor: "Dr. Smith",
      medication: "Acetaminophen 160mg",
      quantity: "30 tablets",
      status: "pending",
      priority: "normal",
      time: "2 hours ago",
    },
    {
      id: 2,
      patient: "Michael Chen",
      age: 5,
      doctor: "Dr. Johnson",
      medication: "Amoxicillin 250mg",
      quantity: "20 capsules",
      status: "verified",
      priority: "normal",
      time: "1 hour ago",
    },
    {
      id: 3,
      patient: "Sarah Williams",
      age: 12,
      doctor: "Dr. Brown",
      medication: "Albuterol Inhaler",
      quantity: "1 inhaler",
      status: "dispensed",
      priority: "normal",
      time: "30 minutes ago",
    },
    {
      id: 4,
      patient: "David Brown",
      age: 6,
      doctor: "Dr. Davis",
      medication: "EpiPen Jr.",
      quantity: "2 auto-injectors",
      status: "pending",
      priority: "urgent",
      time: "15 minutes ago",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "dispensed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "verified":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "normal":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "dispensed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "verified":
        return <Scan className="h-4 w-4 text-blue-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pharmacist Dashboard</h1>
          <p className="text-muted-foreground">Manage incoming prescriptions and dispensing workflow.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Incoming</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.incomingPrescriptions}</div>
              <p className="text-xs text-muted-foreground">New prescriptions today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dispensed</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.dispensedToday}</div>
              <p className="text-xs text-muted-foreground">Completed today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingVerification}</div>
              <p className="text-xs text-muted-foreground">Awaiting verification</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.lowStockAlerts}</div>
              <p className="text-xs text-muted-foreground">Low inventory items</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/dispensing">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-lg dark:bg-blue-950 dark:text-blue-400">
                    <Package className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Dispensing Queue</h3>
                    <p className="text-sm text-muted-foreground">Process and dispense medications</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/prescriptions">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-50 text-green-600 rounded-lg dark:bg-green-950 dark:text-green-400">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Prescription History</h3>
                    <p className="text-sm text-muted-foreground">View all prescription records</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Incoming Prescriptions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Incoming Prescriptions
                </CardTitle>
                <CardDescription>Recent prescriptions requiring verification and dispensing</CardDescription>
              </div>
              <Link href="/prescriptions">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {incomingPrescriptions.map((prescription) => (
                <div key={prescription.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(prescription.status)}
                      <span className="text-sm text-muted-foreground">{prescription.time}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{prescription.patient}</span>
                        <span className="text-sm text-muted-foreground">({prescription.age}y)</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Pill className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{prescription.medication}</span>
                        <span className="text-sm text-muted-foreground">• {prescription.quantity}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Prescribed by {prescription.doctor}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(prescription.priority)}>
                      {prescription.priority.charAt(0).toUpperCase() + prescription.priority.slice(1)}
                    </Badge>
                    <Badge className={getStatusColor(prescription.status)}>
                      {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                    </Badge>
                    {prescription.status === "pending" && <Button size="sm">Verify</Button>}
                    {prescription.status === "verified" && (
                      <Button size="sm" variant="outline">
                        Dispense
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
