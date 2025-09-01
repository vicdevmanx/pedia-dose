"use client"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Plus, X } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
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
  },
}

export default function EditPatientPage() {
  const params = useParams()
  const router = useRouter()
  const patientId = params.id as string

  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newAllergy, setNewAllergy] = useState("")
  const [newCondition, setNewCondition] = useState("")

  useEffect(() => {
    const loadPatient = () => {
      setLoading(true)
      setTimeout(() => {
        const foundPatient = patientDatabase[patientId]
        setPatient(foundPatient ? { ...foundPatient } : null)
        setLoading(false)
      }, 500)
    }

    if (patientId) {
      loadPatient()
    }
  }, [patientId])

  const handleSave = async () => {
    if (!patient) return

    setSaving(true)
    setTimeout(() => {
      // Update the database
      patientDatabase[patientId] = patient
      setSaving(false)
      router.push(`/patients/${patientId}`)
    }, 1000)
  }

  const addAllergy = () => {
    if (newAllergy.trim() && patient && !patient.allergies.includes(newAllergy.trim())) {
      setPatient({
        ...patient,
        allergies: [...patient.allergies, newAllergy.trim()],
      })
      setNewAllergy("")
    }
  }

  const removeAllergy = (allergy: string) => {
    if (patient) {
      setPatient({
        ...patient,
        allergies: patient.allergies.filter((a) => a !== allergy),
      })
    }
  }

  const addCondition = () => {
    if (newCondition.trim() && patient && !patient.conditions.includes(newCondition.trim())) {
      setPatient({
        ...patient,
        conditions: [...patient.conditions, newCondition.trim()],
      })
      setNewCondition("")
    }
  }

  const removeCondition = (condition: string) => {
    if (patient) {
      setPatient({
        ...patient,
        conditions: patient.conditions.filter((c) => c !== condition),
      })
    }
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href={`/patients/${patientId}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Patient
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Edit Patient</h1>
              <p className="text-muted-foreground">Update {patient.name}'s information</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Demographics */}
          <Card>
            <CardHeader>
              <CardTitle>Demographics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={patient.name}
                    onChange={(e) => setPatient({ ...patient, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={patient.gender} onValueChange={(value) => setPatient({ ...patient, gender: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={patient.dateOfBirth}
                    onChange={(e) => setPatient({ ...patient, dateOfBirth: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={patient.age}
                    onChange={(e) => setPatient({ ...patient, age: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={patient.weight}
                    onChange={(e) => setPatient({ ...patient, weight: Number.parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={patient.height}
                    onChange={(e) => setPatient({ ...patient, height: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="guardianName">Guardian/Parent Name</Label>
                <Input
                  id="guardianName"
                  value={patient.guardianName}
                  onChange={(e) => setPatient({ ...patient, guardianName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guardianPhone">Guardian Phone</Label>
                <Input
                  id="guardianPhone"
                  value={patient.guardianPhone}
                  onChange={(e) => setPatient({ ...patient, guardianPhone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  value={patient.emergencyContact}
                  onChange={(e) => setPatient({ ...patient, emergencyContact: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Allergies */}
          <Card>
            <CardHeader>
              <CardTitle>Known Allergies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {patient.allergies.map((allergy) => (
                  <Badge key={allergy} variant="destructive" className="flex items-center gap-1">
                    {allergy}
                    <button onClick={() => removeAllergy(allergy)} className="ml-1 hover:bg-red-600 rounded-full p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add new allergy"
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addAllergy()}
                />
                <Button onClick={addAllergy} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Medical Conditions */}
          <Card>
            <CardHeader>
              <CardTitle>Medical Conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {patient.conditions.map((condition) => (
                  <Badge key={condition} variant="secondary" className="flex items-center gap-1">
                    {condition}
                    <button
                      onClick={() => removeCondition(condition)}
                      className="ml-1 hover:bg-gray-600 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add new condition"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addCondition()}
                />
                <Button onClick={addCondition} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Medical Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter medical notes, special instructions, or observations..."
              value={patient.notes}
              onChange={(e) => setPatient({ ...patient, notes: e.target.value })}
              rows={4}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
