"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Search, ClipboardCheck, User, Pill, Clock, AlertTriangle } from "lucide-react"

// Mock administration queue data
const mockAdministrationQueue = [
  {
    id: 3,
    patientName: "Sarah Williams",
    patientAge: 12,
    medication: "Albuterol Inhaler",
    dosage: "90 mcg",
    route: "Inhalation",
    frequency: "2 puffs every 4-6 hours as needed",
    status: "dispensed",
    scheduledTime: "2024-01-15T14:00:00Z",
    dispensedAt: "2024-01-15T14:20:00Z",
  },
  {
    id: 5,
    patientName: "Emma Johnson",
    patientAge: 8,
    medication: "Acetaminophen",
    dosage: "160 mg",
    route: "Oral",
    frequency: "Every 6 hours as needed",
    status: "dispensed",
    scheduledTime: "2024-01-15T15:00:00Z",
    dispensedAt: "2024-01-15T14:45:00Z",
  },
]

export default function AdministrationPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMedication, setSelectedMedication] = useState<any>(null)
  const [administrationNotes, setAdministrationNotes] = useState("")
  const [sideEffectsNotes, setSideEffectsNotes] = useState("")
  const [isAdministering, setIsAdministering] = useState(false)

  const filteredQueue = mockAdministrationQueue.filter(
    (item) =>
      item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.medication.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAdminister = (medication: any) => {
    setSelectedMedication(medication)
    setAdministrationNotes("")
    setSideEffectsNotes("")
  }

  const confirmAdministration = () => {
    if (!administrationNotes.trim()) {
      alert("Please add administration notes")
      return
    }

    setIsAdministering(true)
    setTimeout(() => {
      // In real app, this would update the medication status
      console.log("Administration completed:", {
        medication: selectedMedication,
        notes: administrationNotes,
        sideEffects: sideEffectsNotes,
      })
      setSelectedMedication(null)
      setIsAdministering(false)
      alert("Medication administration recorded successfully!")
    }, 1000)
  }

  const isOverdue = (scheduledTime: string) => {
    return new Date(scheduledTime) < new Date()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Medication Administration</h1>
          <p className="text-muted-foreground">Record medication administration and monitor patient responses</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Administration Queue */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5" />
                  Ready for Administration
                </CardTitle>
                <CardDescription>Dispensed medications awaiting administration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search medications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="space-y-3">
                    {filteredQueue.map((medication) => (
                      <div
                        key={medication.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">{medication.patientName}</span>
                            <span className="text-sm text-muted-foreground">({medication.patientAge}y)</span>
                            {isOverdue(medication.scheduledTime) && (
                              <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                OVERDUE
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Pill className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {medication.medication} {medication.dosage}
                            </span>
                            <span className="text-sm text-muted-foreground">• {medication.route}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Scheduled: {new Date(medication.scheduledTime).toLocaleString()}
                            </div>
                            <div>Frequency: {medication.frequency}</div>
                          </div>
                        </div>
                        <Button onClick={() => handleAdminister(medication)} size="sm">
                          <ClipboardCheck className="h-4 w-4 mr-2" />
                          Administer
                        </Button>
                      </div>
                    ))}
                  </div>

                  {filteredQueue.length === 0 && (
                    <div className="text-center py-8">
                      <ClipboardCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No medications ready</h3>
                      <p className="text-muted-foreground">All dispensed medications have been administered</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Administration Panel */}
          <div>
            {selectedMedication ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5" />
                    Record Administration
                  </CardTitle>
                  <CardDescription>Document medication administration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="font-semibold">{selectedMedication.patientName}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedMedication.medication} {selectedMedication.dosage}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedMedication.route} • {selectedMedication.frequency}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminNotes">Administration Notes *</Label>
                    <Textarea
                      id="adminNotes"
                      placeholder="Record administration time, patient response, vital signs, etc."
                      value={administrationNotes}
                      onChange={(e) => setAdministrationNotes(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sideEffects">Side Effects / Adverse Reactions</Label>
                    <Textarea
                      id="sideEffects"
                      placeholder="Record any observed side effects or adverse reactions"
                      value={sideEffectsNotes}
                      onChange={(e) => setSideEffectsNotes(e.target.value)}
                      rows={2}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setSelectedMedication(null)} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={confirmAdministration} disabled={isAdministering} className="flex-1">
                      {isAdministering ? "Recording..." : "Confirm Administration"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Select Medication</CardTitle>
                  <CardDescription>Choose a medication to administer</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <ClipboardCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Select a medication from the queue to record administration</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
