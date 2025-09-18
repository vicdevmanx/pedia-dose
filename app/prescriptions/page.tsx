"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, FileText, Clock, CheckCircle, Package, User, Pill, Eye, Send, Scan, AlertCircle } from "lucide-react"
import Link from "next/link"
import { DrugSearch } from "@/components/drug-search"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Prescription {
  id: number
  patient_id: number
  drug_id: string
  dosage: string
  quantity: string
  route: string
  frequency: string
  status: "pending" | "sent" | "verified" | "dispensed" | "administered" | "completed"
  priority: "normal" | "urgent" | "stat"
  created_at: string
  updated_at: string
  notes?: string
  doctor_id: string
  // Nested data from API joins
  patients: {
    patientName: string
    patientAge: number
  } | null
  drugs: {
    medication: string
    genericName: string
  } | null
  profiles: {
    doctorName: string
  } | null
}

interface Drug {
  id: string
  name: string
  genericName: string
  brandNames: string[]
  category: string
  dosageForm: string | null
  concentration: string | null
  indication: string | null
  ageRange: string | null
  dosageGuidelines: {
    mgPerKg: string
    mgPerM2: string
    maxDaily: string
    routes: string[]
    frequency: string
  }
  warnings: string[]
  contraindications: string[]
  sideEffects: {
    common: string[]
    serious: string[]
    rare: string[]
  } | null
  interactions: string[]
  status: string | null
  mechanism: string | null
  monitoring: string[]
  storage: string | null
}

interface Patient {
  id: string
  name: string
  age: number
}

interface User {
  id: string
  role: string
}

export default function PrescriptionsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isNewPrescriptionOpen, setIsNewPrescriptionOpen] = useState(false)
  const [newPrescription, setNewPrescription] = useState({
    patient_id: "",
    drug: null as Drug | null,
    dosage: "",
    quantity: "",
    route: "",
    frequency: "",
    priority: "normal" as "normal" | "urgent" | "stat",
    notes: "",
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
    fetchPrescriptions()
    fetchPatients()
  }, [])

  const fetchPrescriptions = async () => {
    setLoading(true)
    setError(null)
    try {
      const query = new URLSearchParams({
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(priorityFilter !== "all" && { priority: priorityFilter }),
      }).toString()
      const response = await fetch(`/api/prescriptions?${query}`)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error ${response.status}: Failed to fetch prescriptions`)
      }
      const data = await response.json()
      setPrescriptions(data)
    } catch (e: any) {
      setError(e.message || "Failed to fetch prescriptions. The server may be experiencing issues.")
      console.error("Fetch error:", e)
      setPrescriptions([])
    } finally {
      setLoading(false)
    }
  }

  const fetchPatients = async () => {
    try {
      const response = await fetch("/api/patients")
      if (!response.ok) {
        throw new Error("Failed to fetch patients")
      }
      const data = await response.json()
      setPatients(data)
    } catch (e: any) {
      console.error("Fetch patients error:", e)
      setError("Failed to load patient list. Please try again.")
    }
  }

  useEffect(() => {
    fetchPrescriptions()
  }, [searchTerm, statusFilter, priorityFilter])

  const handleNewPrescriptionSubmit = async () => {
    if (!user || !newPrescription.drug || !newPrescription.patient_id || !newPrescription.dosage || !newPrescription.quantity || !newPrescription.route || !newPrescription.frequency) {
      setError("Please fill in all required fields")
      return
    }

    try {
      const response = await fetch("/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: parseInt(newPrescription.patient_id),
          drug_id: newPrescription.drug.id,
          dosage: newPrescription.dosage,
          quantity: newPrescription.quantity,
          route: newPrescription.route,
          frequency: newPrescription.frequency,
          notes: newPrescription.notes,
          doctor_id: user.id,
          priority: newPrescription.priority,
        }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create prescription")
      }
      setIsNewPrescriptionOpen(false)
      setNewPrescription({
        patient_id: "",
        drug: null,
        dosage: "",
        quantity: "",
        route: "",
        frequency: "",
        priority: "normal",
        notes: "",
      })
      fetchPrescriptions()
    } catch (e: any) {
      setError(e.message || "Failed to create prescription")
      console.error("Create prescription error:", e)
    }
  }

  const handleAction = async (prescription: Prescription, action: string) => {
    try {
      const newStatus = {
        send: "sent",
        verify: "verified",
        dispense: "dispensed",
        administer: "administered",
      }[action]
      if (!newStatus) return

      const response = await fetch(`/api/prescriptions/${prescription.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, user_id: user?.id }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to ${action} prescription`)
      }
      fetchPrescriptions()
    } catch (e: any) {
      setError(e.message || `Failed to ${action} prescription`)
      console.error(`${action} error:`, e)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      sent: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      verified: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      dispensed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      administered: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
      completed: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      normal: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
      urgent: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      stat: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    }
    return colors[priority] || "bg-gray-100 text-gray-800"
  }

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: JSX.Element } = {
      pending: <Clock className="h-4 w-4" />,
      sent: <Send className="h-4 w-4" />,
      verified: <Scan className="h-4 w-4" />,
      dispensed: <Package className="h-4 w-4" />,
      administered: <CheckCircle className="h-4 w-4" />,
      completed: <CheckCircle className="h-4 w-4" />,
    }
    return icons[status] || <Clock className="h-4 w-4" />
  }

  const getRoleSpecificActions = (prescription: Prescription) => {
    if (!user) return null

    switch (user.role) {
      case "doctor":
        return (
          <div className="flex flex-col sm:flex-row gap-2">
            <Link href={`/prescriptions/${prescription.id}`}>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
            </Link>
            {prescription.status === "pending" && (
              <Button size="sm" onClick={() => handleAction(prescription, "send")}>
                <Send className="h-4 w-4 mr-2" />
                Send to Pharmacy
              </Button>
            )}
          </div>
        )

      case "pharmacist":
        return (
          <div className="flex flex-col sm:flex-row gap-2">
            <Link href={`/prescriptions/${prescription.id}`}>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
            </Link>
            {prescription.status === "sent" && (
              <Button size="sm" onClick={() => handleAction(prescription, "verify")}>
                <Scan className="h-4 w-4 mr-2" />
                Verify
              </Button>
            )}
            {prescription.status === "verified" && (
              <Button size="sm" onClick={() => handleAction(prescription, "dispense")}>
                <Package className="h-4 w-4 mr-2" />
                Dispense
              </Button>
            )}
          </div>
        )

      case "nurse":
        return (
          <div className="flex flex-col sm:flex-row gap-2">
            <Link href={`/prescriptions/${prescription.id}`}>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
            </Link>
            {prescription.status === "dispensed" && (
              <Button size="sm" onClick={() => handleAction(prescription, "administer")}>
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
    total: prescriptions.length,
    pending: prescriptions.filter((p) => p.status === "pending").length,
    inProgress: prescriptions.filter((p) => ["sent", "verified", "dispensed"].includes(p.status)).length,
    completed: prescriptions.filter((p) => p.status === "administered" || p.status === "completed").length,
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Prescriptions
            </h1>
            <p className="text-base lg:text-lg text-muted-foreground max-w-2xl">
              Streamlined prescription workflow from creation to administration with real-time tracking
            </p>
          </div>
          {user?.role === "doctor" && (
            <Dialog open={isNewPrescriptionOpen} onOpenChange={setIsNewPrescriptionOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  New Prescription
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="pb-6">
                  <DialogTitle className="text-2xl font-bold">Create New Prescription</DialogTitle>
                  <DialogDescription className="text-base">
                    Fill in the prescription details carefully
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Patient *</label>
                      <Select
                        value={newPrescription.patient_id}
                        onValueChange={(value) => setNewPrescription({ ...newPrescription, patient_id: value })}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select patient" />
                        </SelectTrigger>
                        <SelectContent>
                          {patients.length > 0 ? (
                            patients.map((patient) => (
                              <SelectItem key={patient.id} value={patient.id}>
                                {patient.name} ({patient.age}y)
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="" disabled>
                              No patients available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Priority</label>
                      <Select
                        value={newPrescription.priority}
                        onValueChange={(value) =>
                          setNewPrescription({ ...newPrescription, priority: value as "normal" | "urgent" | "stat" })
                        }
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                          <SelectItem value="stat">STAT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Medication *</label>
                    <DrugSearch
                      onDrugSelect={(drug) =>
                        setNewPrescription({
                          ...newPrescription,
                          drug,
                          dosage: drug.dosageGuidelines?.mgPerKg || "",
                          route: drug.dosageGuidelines?.routes?.[0] || "",
                          frequency: drug.dosageGuidelines?.frequency || "",
                        })
                      }
                      placeholder="Search for medication..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Dosage *</label>
                      <Input
                        placeholder="Enter dosage (e.g., 500mg)"
                        value={newPrescription.dosage}
                        onChange={(e) => setNewPrescription({ ...newPrescription, dosage: e.target.value })}
                        className="h-11"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Quantity *</label>
                      <Input
                        placeholder="Enter quantity (e.g., 30 tablets)"
                        value={newPrescription.quantity}
                        onChange={(e) => setNewPrescription({ ...newPrescription, quantity: e.target.value })}
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Route *</label>
                      <Select
                        value={newPrescription.route}
                        onValueChange={(value) => setNewPrescription({ ...newPrescription, route: value })}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select route" />
                        </SelectTrigger>
                        <SelectContent>
                          {newPrescription.drug?.dosageGuidelines?.routes?.map((route) => (
                            <SelectItem key={route} value={route}>
                              {route}
                            </SelectItem>
                          )) || (
                            <>
                              <SelectItem value="oral">Oral</SelectItem>
                              <SelectItem value="IV">IV</SelectItem>
                              <SelectItem value="IM">IM</SelectItem>
                              <SelectItem value="topical">Topical</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Frequency *</label>
                      <Input
                        placeholder="Enter frequency (e.g., BID, TID)"
                        value={newPrescription.frequency}
                        onChange={(e) => setNewPrescription({ ...newPrescription, frequency: e.target.value })}
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Notes</label>
                    <Input
                      placeholder="Enter notes (optional)"
                      value={newPrescription.notes}
                      onChange={(e) => setNewPrescription({ ...newPrescription, notes: e.target.value })}
                      className="h-11"
                    />
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-950 dark:border-red-800">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                        <span className="text-sm font-medium text-red-800 dark:text-red-200">{error}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-4 pt-4">
                    <Button 
                      onClick={handleNewPrescriptionSubmit} 
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12"
                    >
                      Create Prescription
                    </Button>
                    <Button variant="outline" onClick={() => setIsNewPrescriptionOpen(false)} className="h-12">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Enhanced Stats with better design */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold">Total Prescriptions</CardTitle>
              <FileText className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">{stats.total}</div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">All time</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold">Pending Review</CardTitle>
              <Clock className="h-5 w-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">{stats.pending}</div>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">Awaiting action</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold">In Progress</CardTitle>
              <Package className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">{stats.inProgress}</div>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Being processed</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold">Completed</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700 dark:text-green-300">{stats.completed}</div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">Successfully administered</p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Filters */}
        <Card className="shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold">Prescription Management</CardTitle>
            <CardDescription className="text-base">
              Search, filter, and manage prescriptions across the workflow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by patient, medication, or doctor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-base max-w-md lg:max-w-lg"
                />
              </div>
              <div className="flex gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full lg:w-48 h-12">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {getTabsForRole().map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-full lg:w-48 h-12">
                    <SelectValue placeholder="Filter by Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="stat">STAT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Enhanced Prescription List */}
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-base text-muted-foreground">Loading prescriptions...</p>
              </div>
            )}

            {error && (
              <div className="p-6 bg-red-50 border border-red-200 rounded-xl dark:bg-red-950 dark:border-red-800">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-red-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-red-800 dark:text-red-200">Error Loading Prescriptions</h3>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                      {error.includes("PGRST100")
                        ? "Failed to load prescriptions due to a server configuration issue. Please try again later or contact support."
                        : error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!loading && !error && (
              <div className="space-y-4">
                {prescriptions.length > 0 ? (
                  prescriptions.map((prescription) => (
                    <Card 
                      key={prescription.id}
                      className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500 hover:border-l-purple-500"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                          <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-3 flex-wrap">
                              {getStatusIcon(prescription.status)}
                              <span className="text-sm text-muted-foreground font-medium">
                                {new Date(prescription.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                              <Badge className={`${getPriorityColor(prescription.priority)} text-xs font-semibold`}>
                                {prescription.priority.toUpperCase()}
                              </Badge>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <User className="h-5 w-5 text-blue-600" />
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-semibold text-lg text-foreground">
                                    {prescription.patients?.patientName || "N/A"}
                                  </span>
                                  <span className="text-muted-foreground">
                                    ({prescription.patients?.patientAge || "N/A"}y)
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <Pill className="h-5 w-5 text-purple-600" />
                                <div className="flex items-center gap-2 flex-wrap text-sm lg:text-base">
                                  <span className="font-medium">
                                    {prescription.drugs?.medication || "N/A"}
                                  </span>
                                  {prescription.drugs?.genericName && (
                                    <span className="text-muted-foreground">
                                      ({prescription.drugs.genericName})
                                    </span>
                                  )}
                                  <span className="font-medium text-blue-600">
                                    {prescription.dosage}
                                  </span>
                                  <span className="text-muted-foreground">
                                    • {prescription.route || "N/A"} • {prescription.frequency}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="text-sm text-muted-foreground space-y-1">
                                <div>
                                  Prescribed by {prescription.profiles?.doctorName || "N/A"} • 
                                  Quantity: {prescription.quantity}
                                </div>
                                {prescription.notes && (
                                  <div className="italic text-blue-700 dark:text-blue-300">
                                    Note: {prescription.notes}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <Badge className={`${getStatusColor(prescription.status)} text-sm font-semibold px-3 py-1`}>
                              {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                            </Badge>
                            {getRoleSpecificActions(prescription)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-16">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-2xl p-12 max-w-md mx-auto">
                      <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                      <h3 className="text-xl font-semibold mb-3">No prescriptions found</h3>
                      <p className="text-muted-foreground">
                        {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                          ? "Try adjusting your search terms or filters to find what you're looking for"
                          : "No prescriptions have been created yet. Create your first prescription to get started."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}