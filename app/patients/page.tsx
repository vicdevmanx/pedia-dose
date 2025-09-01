"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { PatientModal } from "@/components/modals/patient-modal"
import { Search, Plus, User, Calendar, Weight, AlertTriangle, Eye, Edit } from "lucide-react"
import Link from "next/link"

// Mock patient data
const mockPatients = [
  {
    id: 1,
    name: "Emma Johnson",
    age: 8,
    weight: 25.5,
    gender: "Female",
    allergies: ["Penicillin", "Peanuts"],
    conditions: ["Asthma"],
    lastVisit: "2024-01-15",
    status: "active",
  },
  {
    id: 2,
    name: "Michael Chen",
    age: 5,
    weight: 18.2,
    gender: "Male",
    allergies: ["None"],
    conditions: ["None"],
    lastVisit: "2024-01-10",
    status: "active",
  },
  {
    id: 3,
    name: "Sarah Williams",
    age: 12,
    weight: 42.1,
    gender: "Female",
    allergies: ["Latex"],
    conditions: ["Type 1 Diabetes"],
    lastVisit: "2024-01-08",
    status: "active",
  },
  {
    id: 4,
    name: "David Brown",
    age: 6,
    weight: 22.8,
    gender: "Male",
    allergies: ["Shellfish", "Eggs"],
    conditions: ["Food Allergies"],
    lastVisit: "2024-01-05",
    status: "active",
  },
  {
    id: 5,
    name: "Olivia Davis",
    age: 10,
    weight: 35.0,
    gender: "Female",
    allergies: ["None"],
    conditions: ["ADHD"],
    lastVisit: "2024-01-03",
    status: "inactive",
  },
]

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [patients, setPatients] = useState(mockPatients)

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.conditions.some((condition) => condition.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = filterStatus === "all" || patient.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }

  const hasAllergies = (allergies: string[]) => {
    return allergies.length > 0 && !allergies.includes("None")
  }

  const handleAddPatient = (newPatient: any) => {
    const patientWithId = {
      ...newPatient,
      id: Date.now(),
      status: "active",
      lastVisit: new Date().toISOString().split("T")[0],
    }
    setPatients([...patients, patientWithId])
    setShowAddModal(false)
  }

  const handleEditPatient = (updatedPatient: any) => {
    setPatients(patients.map((p) => (p.id === selectedPatient.id ? { ...updatedPatient, id: selectedPatient.id } : p)))
    setShowEditModal(false)
    setSelectedPatient(null)
  }

  const openEditModal = (patient: any) => {
    setSelectedPatient(patient)
    setShowEditModal(true)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Patient Management</h1>
            <p className="text-muted-foreground">Manage patient records, demographics, and medical history</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patients.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {patients.filter((p) => p.status === "active").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">With Allergies</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {patients.filter((p) => hasAllergies(p.allergies)).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Age</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {patients.length > 0 ? Math.round(patients.reduce((sum, p) => sum + p.age, 0) / patients.length) : 0}y
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Patient List</CardTitle>
            <CardDescription>Search and filter patient records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients by name or condition..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("all")}
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === "active" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("active")}
                >
                  Active
                </Button>
                <Button
                  variant={filterStatus === "inactive" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("inactive")}
                >
                  Inactive
                </Button>
              </div>
            </div>

            {/* Patient List */}
            <div className="space-y-4">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-4"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{patient.name}</h3>
                        <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
                        {hasAllergies(patient.allergies) && (
                          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Allergies
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {patient.age} years old
                        </div>
                        <div className="flex items-center gap-1">
                          <Weight className="h-3 w-3" />
                          {patient.weight} kg
                        </div>
                        <div>{patient.gender}</div>
                        <div>Last visit: {new Date(patient.lastVisit).toLocaleDateString()}</div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {patient.conditions
                          .filter((c) => c !== "None")
                          .map((condition) => (
                            <Badge key={condition} variant="secondary" className="text-xs">
                              {condition}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Link href={`/patients/${patient.id}`} className="flex-1 sm:flex-none">
                      <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(patient)}
                      className="flex-1 sm:flex-none"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredPatients.length === 0 && (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No patients found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first patient"}
                </p>
                <Button onClick={() => setShowAddModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Patient
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <PatientModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddPatient}
          mode="add"
        />

        <PatientModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setSelectedPatient(null)
          }}
          onSave={handleEditPatient}
          patient={selectedPatient}
          mode="edit"
        />
      </div>
    </DashboardLayout>
  )
}
