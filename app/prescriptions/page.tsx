"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, FileText, Clock, CheckCircle, Package, User, Pill, Eye, Send, Scan } from "lucide-react"
import Link from "next/link"

interface Prescription {
  id: number
  patientName: string
  patientAge: number
  doctorName: string
  medication: string
  dosage: string
  quantity: string
  route: string
  frequency: string
  status: "pending" | "sent" | "verified" | "dispensed" | "administered" | "completed"
  priority: "normal" | "urgent" | "stat"
  createdDate: string
  lastUpdated: string
  notes?: string
}

// Mock prescription data
const mockPrescriptions: Prescription[] = [
  {
    id: 1,
    patientName: "Emma Johnson",
    patientAge: 8,
    doctorName: "Dr. Smith",
    medication: "Acetaminophen",
    dosage: "160 mg",
    quantity: "30 tablets",
    route: "Oral",
    frequency: "Every 6 hours as needed",
    status: "pending",
    priority: "normal",
    createdDate: "2024-01-15T10:30:00Z",
    lastUpdated: "2024-01-15T10:30:00Z",
    notes: "For fever and pain management",
  },
  {
    id: 2,
    patientName: "Michael Chen",
    patientAge: 5,
    doctorName: "Dr. Johnson",
    medication: "Amoxicillin",
    dosage: "250 mg",
    quantity: "20 capsules",
    route: "Oral",
    frequency: "Every 8 hours",
    status: "verified",
    priority: "normal",
    createdDate: "2024-01-15T09:15:00Z",
    lastUpdated: "2024-01-15T11:45:00Z",
    notes: "Complete full course even if symptoms improve",
  },
  {
    id: 3,
    patientName: "Sarah Williams",
    patientAge: 12,
    doctorName: "Dr. Brown",
    medication: "Albuterol Inhaler",
    dosage: "90 mcg",
    quantity: "1 inhaler",
    route: "Inhalation",
    frequency: "2 puffs every 4-6 hours as needed",
    status: "dispensed",
    priority: "normal",
    createdDate: "2024-01-15T08:00:00Z",
    lastUpdated: "2024-01-15T14:20:00Z",
  },
  {
    id: 4,
    patientName: "David Brown",
    patientAge: 6,
    doctorName: "Dr. Davis",
    medication: "EpiPen Jr.",
    dosage: "0.15 mg",
    quantity: "2 auto-injectors",
    route: "Intramuscular",
    frequency: "As needed for severe allergic reactions",
    status: "sent",
    priority: "urgent",
    createdDate: "2024-01-15T07:30:00Z",
    lastUpdated: "2024-01-15T12:10:00Z",
    notes: "Emergency medication - ensure proper training provided",
  },
]

export default function PrescriptionsPage() {
  const [user, setUser] = useState<{ role: string } | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const filteredPrescriptions = mockPrescriptions.filter((prescription) => {
    const matchesSearch =
      prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.doctorName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || prescription.status === statusFilter
    const matchesPriority = priorityFilter === "all" || prescription.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      sent: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      verified: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      dispensed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      administered: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
      completed: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      normal: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
      urgent: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      stat: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    }
    return colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: <Clock className="h-4 w-4" />,
      sent: <Send className="h-4 w-4" />,
      verified: <Scan className="h-4 w-4" />,
      dispensed: <Package className="h-4 w-4" />,
      administered: <CheckCircle className="h-4 w-4" />,
      completed: <CheckCircle className="h-4 w-4" />,
    }
    return icons[status as keyof typeof icons] || <Clock className="h-4 w-4" />
  }

  const getRoleSpecificActions = (prescription: Prescription) => {
    if (!user) return null

    switch (user.role) {
      case "doctor":
        return (
          <div className="flex gap-2">
            <Link href={`/prescriptions/${prescription.id}`}>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
            </Link>
            {prescription.status === "pending" && (
              <Button size="sm">
                <Send className="h-4 w-4 mr-2" />
                Send to Pharmacy
              </Button>
            )}
          </div>
        )

      case "pharmacist":
        return (
          <div className="flex gap-2">
            <Link href={`/prescriptions/${prescription.id}`}>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
            </Link>
            {prescription.status === "sent" && (
              <Button size="sm">
                <Scan className="h-4 w-4 mr-2" />
                Verify
              </Button>
            )}
            {prescription.status === "verified" && (
              <Button size="sm">
                <Package className="h-4 w-4 mr-2" />
                Dispense
              </Button>
            )}
          </div>
        )

      case "nurse":
        return (
          <div className="flex gap-2">
            <Link href={`/prescriptions/${prescription.id}`}>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
            </Link>
            {prescription.status === "dispensed" && (
              <Button size="sm">
                <CheckCircle className="h-4 w-4 mr-2" />
                Administer
              </Button>
            )}
          </div>
        )

      default:
        return (
          <Link href={`/prescriptions/${prescription.id}`}>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
          </Link>
        )
    }
  }

  const getTabsForRole = () => {
    if (!user) return ["all"]

    switch (user.role) {
      case "doctor":
        return ["all", "pending", "sent", "completed"]
      case "pharmacist":
        return ["all", "sent", "verified", "dispensed"]
      case "nurse":
        return ["all", "dispensed", "administered"]
      default:
        return ["all"]
    }
  }

  const stats = {
    total: mockPrescriptions.length,
    pending: mockPrescriptions.filter((p) => p.status === "pending").length,
    inProgress: mockPrescriptions.filter((p) => ["sent", "verified", "dispensed"].includes(p.status)).length,
    completed: mockPrescriptions.filter((p) => ["administered", "completed"].includes(p.status)).length,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Prescriptions</h1>
            <p className="text-muted-foreground">Manage prescription workflow from creation to administration</p>
          </div>
          {user?.role === "doctor" && (
            <Link href="/dosage-calculator">
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                New Prescription
              </Button>
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Prescription List</CardTitle>
            <CardDescription>Search and filter prescriptions by status and priority</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient, medication, or doctor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="dispensed">Dispensed</SelectItem>
                  <SelectItem value="administered">Administered</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="stat">STAT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Prescription List */}
            <div className="space-y-4">
              {filteredPrescriptions.map((prescription) => (
                <div
                  key={prescription.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(prescription.status)}
                      <span className="text-sm text-muted-foreground">
                        {new Date(prescription.createdDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{prescription.patientName}</span>
                        <span className="text-sm text-muted-foreground">({prescription.patientAge}y)</span>
                        <Badge className={getPriorityColor(prescription.priority)}>
                          {prescription.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Pill className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {prescription.medication} {prescription.dosage}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          • {prescription.route} • {prescription.frequency}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Prescribed by {prescription.doctorName} • Quantity: {prescription.quantity}
                      </div>
                      {prescription.notes && (
                        <div className="text-xs text-muted-foreground italic">Note: {prescription.notes}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(prescription.status)}>
                      {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                    </Badge>
                    {getRoleSpecificActions(prescription)}
                  </div>
                </div>
              ))}
            </div>

            {filteredPrescriptions.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No prescriptions found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                    ? "Try adjusting your search terms or filters"
                    : "No prescriptions available"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
