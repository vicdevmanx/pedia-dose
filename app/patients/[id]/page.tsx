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
  emergencyContact: {
    name: string
    relationship: string
    phone: string
  }
  allergies: string[]
  conditions: string[]
  notes: string
  status: string
  lastVisit: string
  createdDate: string
  address?: string
  medicalRecordNumber?: string
}


export default function PatientDetailPage() {
  const params = useParams();
  const patientId = params.id as string;
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [medicationHistory, setMedicationHistory] = useState<any[]>([]);
  const [visitHistory, setVisitHistory] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch patient details
        const patientRes = await fetch(`/api/patients/${patientId}`);
        let patientData;
        try {
          patientData = await patientRes.json();
        } catch (jsonErr) {
          setError('API returned invalid JSON. Check if the route exists and returns JSON.');
          setPatient(null);
          return;
        }
        if (!patientRes.ok) {
          setError(patientData.error || 'Unknown error fetching patient');
          setPatient(null);
        } else {
          setPatient(patientData || null);
        }

        // Fetch medication history
        const medRes = await fetch(`/api/patients/${patientId}/medications`);
        let medData = [];
        try {
          medData = await medRes.json();
        } catch {
          medData = [];
        }
        setMedicationHistory(Array.isArray(medData) ? medData : []);

        // Fetch visit history
        const visitRes = await fetch(`/api/patients/${patientId}/visits`);
        let visitData = [];
        try {
          visitData = await visitRes.json();
        } catch {
          visitData = [];
        }
        setVisitHistory(Array.isArray(visitData) ? visitData : []);
      } catch (e: any) {
        setError(e?.message || 'Unknown error occurred');
        setPatient(null);
        setMedicationHistory([]);
        setVisitHistory([]);
      } finally {
        setLoading(false);
      }
    };
    if (patientId) fetchData();
  }, [patientId]);

  const handlePatientUpdate = (updatedPatient: any) => {
    setPatient(updatedPatient);
    setShowEditModal(false);
  };

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
            The patient with ID {patientId} could not be found in the system.<br />
            {error && (
              <span className="block mt-2 text-red-500">Error: {error}</span>
            )}
          </MedicalAlert>
        </div>
      </DashboardLayout>
    );
  }

  const hasAllergies = patient && patient.allergies && patient.allergies.length > 0;
  const hasConditions = patient && patient.conditions && patient.conditions.length > 0;

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
                {patient.status ? (patient.status.charAt(0).toUpperCase() + patient.status.slice(1)) : "Unknown"}
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
                    <p className="font-semibold">{patient.emergencyContact?.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Guardian Phone</p>
                    <p className="font-semibold">{patient.emergencyContact?.phone || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Relationship</p>
                    <p className="font-semibold">{patient.emergencyContact?.relationship || "N/A"}</p>
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
