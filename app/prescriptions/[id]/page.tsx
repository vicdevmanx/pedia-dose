"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MedicalAlert } from "@/components/medical-alert"
import { ArrowLeft, User, Pill, Clock, Send, Scan, Package, CheckCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface PrescriptionDetail {
  id: number
  patientName: string
  patientAge: number
  patientWeight: number
  patientAllergies: string[]
  doctorName: string
  medication: string
  genericName: string
  dosage: string
  quantity: string
  route: string
  frequency: string
  status: "pending" | "sent" | "verified" | "dispensed" | "administered" | "completed"
  priority: "normal" | "urgent" | "stat"
  createdDate: string
  lastUpdated: string
  notes?: string
  dispensingNotes?: string
  administrationNotes?: string
  sideEffects?: string[]
  timeline: {
    created: string
    sent?: string
    verified?: string
    dispensed?: string
    administered?: string
    completed?: string
  }
}

// Mock detailed prescription data
const mockPrescriptionDetail: PrescriptionDetail = {
  id: 1,
  patientName: "Emma Johnson",
  patientAge: 8,
  patientWeight: 25.5,
  patientAllergies: ["Penicillin", "Peanuts"],
  doctorName: "Dr. Smith",
  medication: "Acetaminophen",
  genericName: "Acetaminophen",
  dosage: "160 mg",
  quantity: "30 tablets",
  route: "Oral",
  frequency: "Every 6 hours as needed",
  status: "verified",
  priority: "normal",
  createdDate: "2024-01-15T10:30:00Z",
  lastUpdated: "2024-01-15T11:45:00Z",
  notes: "For fever and pain management. Monitor temperature and pain levels.",
  dispensingNotes: "Verified dosage calculation. Patient weight confirmed at 25.5kg.",
  timeline: {
    created: "2024-01-15T10:30:00Z",
    sent: "2024-01-15T10:35:00Z",
    verified: "2024-01-15T11:45:00Z",
  },
}

export default function PrescriptionDetailPage() {
  const params = useParams()
  const prescriptionId = params.id
  const [user, setUser] = useState<{ role: string } | null>(null)
  const [prescription, setPrescription] = useState<PrescriptionDetail>(mockPrescriptionDetail)
  const [administrationNotes, setAdministrationNotes] = useState("")
  const [sideEffectsNotes, setSideEffectsNotes] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

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

  const handleSendToPharmacy = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setPrescription((prev) => ({
        ...prev,
        status: "sent",
        timeline: { ...prev.timeline, sent: new Date().toISOString() },
      }))
      setIsProcessing(false)
    }, 1000)
  }

  const handleVerifyPrescription = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setPrescription((prev) => ({
        ...prev,
        status: "verified",
        timeline: { ...prev.timeline, verified: new Date().toISOString() },
      }))
      setIsProcessing(false)
    }, 1000)
  }

  const handleDispenseMedication = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setPrescription((prev) => ({
        ...prev,
        status: "dispensed",
        timeline: { ...prev.timeline, dispensed: new Date().toISOString() },
      }))
      setIsProcessing(false)
    }, 1000)
  }

  const handleAdministerMedication = () => {
    if (!administrationNotes.trim()) {
      alert("Please add administration notes")
      return
    }

    setIsProcessing(true)
    setTimeout(() => {
      setPrescription((prev) => ({
        ...prev,
        status: "administered",
        administrationNotes,
        sideEffects: sideEffectsNotes ? [sideEffectsNotes] : undefined,
        timeline: { ...prev.timeline, administered: new Date().toISOString() },
      }))
      setIsProcessing(false)
    }, 1000)
  }

  const getRoleSpecificActions = () => {
    if (!user) return null

    switch (user.role) {
      case "doctor":
        if (prescription.status === "pending") {
          return (
            <Button onClick={handleSendToPharmacy} disabled={isProcessing}>
              {isProcessing ? "Sending..." : "Send to Pharmacy"}
              <Send className="h-4 w-4 ml-2" />
            </Button>
          )
        }
        break

      case "pharmacist":
        if (prescription.status === "sent") {
          return (
            <Button onClick={handleVerifyPrescription} disabled={isProcessing}>
              {isProcessing ? "Verifying..." : "Verify Prescription"}
              <Scan className="h-4 w-4 ml-2" />
            </Button>
          )
        }
        if (prescription.status === "verified") {
          return (
            <Button onClick={handleDispenseMedication} disabled={isProcessing}>
              {isProcessing ? "Dispensing..." : "Dispense Medication"}
              <Package className="h-4 w-4 ml-2" />
            </Button>
          )
        }
        break

      case "nurse":
        if (prescription.status === "dispensed") {
          return (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminNotes">Administration Notes *</Label>
                <Textarea
                  id="adminNotes"
                  placeholder="Record administration details, patient response, etc."
                  value={administrationNotes}
                  onChange={(e) => setAdministrationNotes(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sideEffects">Side Effects (if any)</Label>
                <Textarea
                  id="sideEffects"
                  placeholder="Record any observed side effects or adverse reactions"
                  value={sideEffectsNotes}
                  onChange={(e) => setSideEffectsNotes(e.target.value)}
                  rows={2}
                />
              </div>
              <Button onClick={handleAdministerMedication} disabled={isProcessing} className="w-full">
                {isProcessing ? "Recording..." : "Mark as Administered"}
                <CheckCircle className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )
        }
        break
    }

    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/prescriptions">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Prescriptions
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Prescription #{prescription.id}</h1>
              <p className="text-muted-foreground">
                Created {new Date(prescription.createdDate).toLocaleDateString()} by {prescription.doctorName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getPriorityColor(prescription.priority)}>{prescription.priority.toUpperCase()}</Badge>
            <Badge className={getStatusColor(prescription.status)}>
              {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Patient Allergies Alert */}
        {prescription.patientAllergies.length > 0 && !prescription.patientAllergies.includes("None") && (
          <MedicalAlert type="caution" title="Patient Allergies">
            <div className="flex gap-2">
              {prescription.patientAllergies.map((allergy) => (
                <Badge key={allergy} variant="destructive" className="text-xs">
                  {allergy}
                </Badge>
              ))}
            </div>
          </MedicalAlert>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Prescription Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Patient Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                    <p className="font-semibold">{prescription.patientName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Age</p>
                    <p className="font-semibold">{prescription.patientAge} years</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Weight</p>
                    <p className="font-semibold">{prescription.patientWeight} kg</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Prescribing Doctor</p>
                    <p className="font-semibold">{prescription.doctorName}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medication Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5" />
                  Medication Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Medication</p>
                    <p className="font-semibold">{prescription.medication}</p>
                    <p className="text-sm text-muted-foreground">Generic: {prescription.genericName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Dosage</p>
                    <p className="font-semibold">{prescription.dosage}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Route</p>
                    <p className="font-semibold">{prescription.route}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Frequency</p>
                    <p className="font-semibold">{prescription.frequency}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Quantity</p>
                    <p className="font-semibold">{prescription.quantity}</p>
                  </div>
                </div>

                {prescription.notes && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-1">Prescriber Notes</p>
                    <p className="text-sm">{prescription.notes}</p>
                  </div>
                )}

                {prescription.dispensingNotes && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-950 dark:border-blue-800">
                    <p className="text-sm font-medium mb-1">Pharmacist Notes</p>
                    <p className="text-sm">{prescription.dispensingNotes}</p>
                  </div>
                )}

                {prescription.administrationNotes && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg dark:bg-green-950 dark:border-green-800">
                    <p className="text-sm font-medium mb-1">Administration Notes</p>
                    <p className="text-sm">{prescription.administrationNotes}</p>
                  </div>
                )}

                {prescription.sideEffects && prescription.sideEffects.length > 0 && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-950 dark:border-yellow-800">
                    <p className="text-sm font-medium mb-1 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Reported Side Effects
                    </p>
                    <ul className="text-sm space-y-1">
                      {prescription.sideEffects.map((effect, index) => (
                        <li key={index}>• {effect}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Created</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(prescription.timeline.created).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {prescription.timeline.sent && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Sent to Pharmacy</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(prescription.timeline.sent).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {prescription.timeline.verified && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Verified</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(prescription.timeline.verified).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {prescription.timeline.dispensed && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Dispensed</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(prescription.timeline.dispensed).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {prescription.timeline.administered && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Administered</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(prescription.timeline.administered).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent>{getRoleSpecificActions()}</CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
