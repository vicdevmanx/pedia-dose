"use client"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PatientModal } from "@/components/modals/patient-modal"
import {
  User,
  Calendar,
  Weight,
  AlertTriangle,
  Edit,
  ArrowLeft,
  Phone,
  Clock,
  Pill,
  FileText,
  Activity,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { MedicalAlert } from "@/components/medical-alert"

interface Patient {
  id: number
  name: string
  age: number
  weight: number
  height: number
  gender: string
  dateOfBirth: string
  guardianName: string
  guardianPhone: string
  emergencyContact: string
  allergies: string[]
  conditions: string[]
  notes: string
  status: string
  lastVisit: string
  createdDate: string
  address?: string
  medicalRecordNumber?: string
}

const patientDatabase: { [key: string]: Patient } = {
  "1": {
    id: 1,
    name: "Emma Johnson",
    age: 8,
    weight: 25.5,
    height: 125,
    gender: "Female",
    dateOfBirth: "2016-03-15",
    guardianName: "Jennifer Johnson",
    guardianPhone: "(555) 123-4567",
    emergencyContact: "Robert Johnson - (555) 987-6543",
    allergies: ["Penicillin", "Peanuts"],
    conditions: ["Asthma"],
    notes: "Patient responds well to albuterol. Monitor for seasonal allergy flare-ups.",
    status: "active",
    lastVisit: "2024-01-15",
    createdDate: "2023-06-10",
    address: "123 Main St, Springfield, IL 62701",
    medicalRecordNumber: "MRN-001234",
  },
  "2": {
    id: 2,
    name: "Michael Chen",
    age: 12,
    weight: 40.2,
    height: 145,
    gender: "Male",
    dateOfBirth: "2012-08-22",
    guardianName: "Lisa Chen",
    guardianPhone: "(555) 234-5678",
    emergencyContact: "David Chen - (555) 876-5432",
    allergies: ["Shellfish"],
    conditions: ["Type 1 Diabetes"],
    notes: "Requires insulin monitoring. Check blood glucose before meals.",
    status: "active",
    lastVisit: "2024-01-20",
    createdDate: "2023-05-15",
    address: "456 Oak Ave, Springfield, IL 62702",
    medicalRecordNumber: "MRN-005678",
  },
  "3": {
    id: 3,
    name: "Sofia Rodriguez",
    age: 5,
    weight: 18.3,
    height: 110,
    gender: "Female",
    dateOfBirth: "2019-11-08",
    guardianName: "Maria Rodriguez",
    guardianPhone: "(555) 345-6789",
    emergencyContact: "Carlos Rodriguez - (555) 765-4321",
    allergies: ["Latex"],
    conditions: ["Eczema"],
    notes: "Sensitive skin, use hypoallergenic products only.",
    status: "active",
    lastVisit: "2024-01-18",
    createdDate: "2023-07-22",
    address: "789 Pine St, Springfield, IL 62703",
    medicalRecordNumber: "MRN-009012",
  },
  "4": {
    id: 4,
    name: "James Wilson",
    age: 15,
    weight: 58.7,
    height: 168,
    gender: "Male",
    dateOfBirth: "2009-04-12",
    guardianName: "Sarah Wilson",
    guardianPhone: "(555) 456-7890",
    emergencyContact: "Mark Wilson - (555) 654-3210",
    allergies: [],
    conditions: ["ADHD"],
    notes: "Takes medication for ADHD, monitor for side effects.",
    status: "active",
    lastVisit: "2024-01-22",
    createdDate: "2023-04-15",
    address: "321 Elm Dr, Springfield, IL 62704",
    medicalRecordNumber: "MRN-003456",
  },
}

const getMedicationHistory = (patientId: string) => {
  const medicationData: { [key: string]: any[] } = {
    "1": [
      {
        id: 1,
        medication: "Albuterol Inhaler",
        dosage: "90 mcg, 2 puffs",
        frequency: "As needed",
        prescribedBy: "Dr. Smith",
        dateStarted: "2024-01-10",
        status: "Active",
      },
      {
        id: 2,
        medication: "Acetaminophen",
        dosage: "160 mg",
        frequency: "Every 6 hours as needed",
        prescribedBy: "Dr. Smith",
        dateStarted: "2024-01-15",
        status: "Completed",
      },
    ],
    "2": [
      {
        id: 1,
        medication: "Insulin Glargine",
        dosage: "10 units",
        frequency: "Once daily at bedtime",
        prescribedBy: "Dr. Johnson",
        dateStarted: "2023-08-15",
        status: "Active",
      },
      {
        id: 2,
        medication: "Insulin Lispro",
        dosage: "Variable based on carbs",
        frequency: "Before meals",
        prescribedBy: "Dr. Johnson",
        dateStarted: "2023-08-15",
        status: "Active",
      },
    ],
    "3": [
      {
        id: 1,
        medication: "Hydrocortisone Cream",
        dosage: "1% topical",
        frequency: "Twice daily as needed",
        prescribedBy: "Dr. Brown",
        dateStarted: "2024-01-05",
        status: "Active",
      },
    ],
    "4": [
      {
        id: 1,
        medication: "Methylphenidate",
        dosage: "18 mg",
        frequency: "Once daily in morning",
        prescribedBy: "Dr. Davis",
        dateStarted: "2023-09-01",
        status: "Active",
      },
    ],
  }
  return medicationData[patientId] || []
}

const getVisitHistory = (patientId: string) => {
  const visitData: { [key: string]: any[] } = {
    "1": [
      {
        id: 1,
        date: "2024-01-15",
        type: "Follow-up",
        provider: "Dr. Smith",
        reason: "Asthma check-up",
        notes: "Breathing improved, continue current treatment",
      },
      {
        id: 2,
        date: "2023-12-20",
        type: "Sick Visit",
        provider: "Dr. Johnson",
        reason: "Upper respiratory infection",
        notes: "Prescribed antibiotics, follow up in 1 week",
      },
    ],
    "2": [
      {
        id: 1,
        date: "2024-01-20",
        type: "Diabetes Management",
        provider: "Dr. Johnson",
        reason: "Routine diabetes check",
        notes: "Blood sugar levels stable, continue current regimen",
      },
      {
        id: 2,
        date: "2023-11-15",
        type: "Follow-up",
        provider: "Dr. Johnson",
        reason: "Insulin adjustment",
        notes: "Adjusted evening insulin dose",
      },
    ],
    "3": [
      {
        id: 1,
        date: "2024-01-18",
        type: "Dermatology",
        provider: "Dr. Brown",
        reason: "Eczema flare-up",
        notes: "Prescribed topical steroid, avoid known triggers",
      },
    ],
    "4": [
      {
        id: 1,
        date: "2024-01-22",
        type: "Psychiatry",
        provider: "Dr. Davis",
        reason: "ADHD medication review",
        notes: "Patient doing well on current dose, continue treatment",
      },
    ],
  }
  return visitData[patientId] || []
}

export default function PatientDetailPage() {
  const params = useParams()
  const patientId = params.id as string
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    const loadPatient = () => {
      setLoading(true)
      // Simulate API call delay
      setTimeout(() => {
        const foundPatient = patientDatabase[patientId]
        setPatient(foundPatient || null)
        setLoading(false)
      }, 500)
    }

    if (patientId) {
      loadPatient()
    }
  }, [patientId])

  const handlePatientUpdate = (updatedPatient: any) => {
    // Update local database for demo
    if (patientId) {
      const updated = { ...updatedPatient, id: Number(patientId) }
      patientDatabase[patientId] = updated
      setPatient(updated)
    }
    setShowEditModal(false)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading patient information...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!patient) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Link href="/patients">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Patients
              </Button>
            </Link>
          </div>
          <MedicalAlert type="danger" title="Patient Not Found">
            The patient with ID {patientId} could not be found in the system.
          </MedicalAlert>
        </div>
      </DashboardLayout>
    )
  }

  const hasAllergies = patient.allergies.length > 0
  const hasConditions = patient.conditions.length > 0
  const medicationHistory = getMedicationHistory(patientId)
  const visitHistory = getVisitHistory(patientId)

  const calculateBMI = () => {
    if (patient.height && patient.weight) {
      const heightInM = patient.height / 100
      const bmi = patient.weight / (heightInM * heightInM)
      return bmi.toFixed(1)
    }
    return "N/A"
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {hasAllergies && (
          <MedicalAlert type="danger" title="Critical Allergies">
            Patient has known allergies: {patient.allergies.join(", ")}. Verify before prescribing any medications.
          </MedicalAlert>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-4">
          <div className="flex flex-col items-start gap-4">
            <Link href="/patients">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Patients
              </Button>
            </Link>
            
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{patient.name}</h1>
              <p className="text-muted-foreground">
                Patient ID: {patient.id} • Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto bg-transparent"
              onClick={() => setShowEditModal(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Patient
            </Button>
            <Link href={`/dosage-calculator?patientId=${patient.id}`} className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto">Calculate Dosage</Button>
            </Link>
          </div>
        </div>

        {/* Patient Overview Cards */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Age</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patient.age}</div>
              <p className="text-xs text-muted-foreground">years old</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weight</CardTitle>
              <Weight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patient.weight}</div>
              <p className="text-xs text-muted-foreground">kg</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">BMI</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{calculateBMI()}</div>
              <p className="text-xs text-muted-foreground">kg/m²</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Badge
                className={
                  patient.status === "active"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                }
              >
                {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="history">Visit History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Demographics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Demographics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                      <p className="font-semibold">{patient.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Gender</p>
                      <p className="font-semibold">{patient.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                      <p className="font-semibold">{new Date(patient.dateOfBirth).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Age</p>
                      <p className="font-semibold">{patient.age} years</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Weight</p>
                      <p className="font-semibold">{patient.weight} kg</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Height</p>
                      <p className="font-semibold">{patient.height} cm</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Address</p>
                      <p className="font-semibold">{patient.address}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Medical Record Number</p>
                      <p className="font-semibold">{patient.medicalRecordNumber}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Guardian/Parent</p>
                    <p className="font-semibold">{patient.guardianName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Guardian Phone</p>
                    <p className="font-semibold">{patient.guardianPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Emergency Contact</p>
                    <p className="font-semibold">{patient.emergencyContact}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Medical Alerts */}
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Allergies */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Known Allergies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {hasAllergies ? (
                    <div className="flex flex-wrap gap-2">
                      {patient.allergies.map((allergy) => (
                        <Badge key={allergy} variant="destructive">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No known allergies</p>
                  )}
                </CardContent>
              </Card>

              {/* Medical Conditions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Medical Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {hasConditions ? (
                    <div className="flex flex-wrap gap-2">
                      {patient.conditions.map((condition) => (
                        <Badge key={condition} variant="secondary">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No known conditions</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Notes */}
            {patient.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Medical Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{patient.notes}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="medications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5" />
                  Medication History
                </CardTitle>
                <CardDescription>Current and past medications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {medicationHistory.map((med) => (
                    <div key={med.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{med.medication}</h4>
                          <Badge
                            className={
                              med.status === "Active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                            }
                          >
                            {med.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {med.dosage} • {med.frequency}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Prescribed by {med.prescribedBy} on {new Date(med.dateStarted).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {medicationHistory.length === 0 && (
                    <p className="text-muted-foreground text-center py-8">No medication history available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Visit History
                </CardTitle>
                <CardDescription>Previous appointments and treatments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {visitHistory.map((visit) => (
                    <div key={visit.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{visit.type}</h4>
                          <span className="text-sm text-muted-foreground">
                            {new Date(visit.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Provider: {visit.provider} • Reason: {visit.reason}
                        </p>
                        <p className="text-sm">{visit.notes}</p>
                      </div>
                    </div>
                  ))}
                  {visitHistory.length === 0 && (
                    <p className="text-muted-foreground text-center py-8">No visit history available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <PatientModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handlePatientUpdate}
          patient={patient}
          mode="edit"
        />
      </div>
    </DashboardLayout>
  )
}
