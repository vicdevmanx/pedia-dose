"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Search, Package, Scan, User, Pill } from "lucide-react"

// Mock dispensing queue data
const mockDispensingQueue = [
  {
    id: 2,
    patientName: "Michael Chen",
    patientAge: 5,
    medication: "Amoxicillin",
    dosage: "250 mg",
    quantity: "20 capsules",
    status: "verified",
    priority: "normal",
    prescribedBy: "Dr. Johnson",
    verifiedAt: "2024-01-15T11:45:00Z",
  },
  {
    id: 4,
    patientName: "David Brown",
    patientAge: 6,
    medication: "EpiPen Jr.",
    dosage: "0.15 mg",
    quantity: "2 auto-injectors",
    status: "verified",
    priority: "urgent",
    prescribedBy: "Dr. Davis",
    verifiedAt: "2024-01-15T12:10:00Z",
  },
]

export default function DispensingPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null)
  const [dispensingNotes, setDispensingNotes] = useState("")
  const [barcodeInput, setBarcodeInput] = useState("")
  const [isDispensing, setIsDispensing] = useState(false)

  const filteredQueue = mockDispensingQueue.filter(
    (item) =>
      item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.medication.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDispense = (prescription: any) => {
    setSelectedPrescription(prescription)
    setDispensingNotes("")
    setBarcodeInput("")
  }

  const confirmDispensing = () => {
    if (!dispensingNotes.trim()) {
      alert("Please add dispensing notes")
      return
    }

    setIsDispensing(true)
    setTimeout(() => {
      // In real app, this would update the prescription status
      console.log("Dispensing completed:", {
        prescription: selectedPrescription,
        notes: dispensingNotes,
        barcode: barcodeInput,
      })
      setSelectedPrescription(null)
      setIsDispensing(false)
      alert("Medication dispensed successfully!")
    }, 1000)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dispensing Queue</h1>
          <p className="text-muted-foreground">Process verified prescriptions and dispense medications</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Queue List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Verified Prescriptions
                </CardTitle>
                <CardDescription>Ready for dispensing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search prescriptions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="space-y-3">
                    {filteredQueue.map((prescription) => (
                      <div
                        key={prescription.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">{prescription.patientName}</span>
                            <span className="text-sm text-muted-foreground">({prescription.patientAge}y)</span>
                            {prescription.priority === "urgent" && (
                              <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                                URGENT
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Pill className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {prescription.medication} {prescription.dosage}
                            </span>
                            <span className="text-sm text-muted-foreground">• {prescription.quantity}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Prescribed by {prescription.prescribedBy} • Verified{" "}
                            {new Date(prescription.verifiedAt).toLocaleString()}
                          </div>
                        </div>
                        <Button onClick={() => handleDispense(prescription)} size="sm">
                          <Package className="h-4 w-4 mr-2" />
                          Dispense
                        </Button>
                      </div>
                    ))}
                  </div>

                  {filteredQueue.length === 0 && (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No prescriptions ready</h3>
                      <p className="text-muted-foreground">All verified prescriptions have been dispensed</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dispensing Panel */}
          <div>
            {selectedPrescription ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scan className="h-5 w-5" />
                    Dispense Medication
                  </CardTitle>
                  <CardDescription>Complete dispensing process</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="font-semibold">{selectedPrescription.patientName}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedPrescription.medication} {selectedPrescription.dosage}
                    </p>
                    <p className="text-sm text-muted-foreground">Quantity: {selectedPrescription.quantity}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="barcode">Barcode Verification</Label>
                    <Input
                      id="barcode"
                      placeholder="Scan or enter barcode"
                      value={barcodeInput}
                      onChange={(e) => setBarcodeInput(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Dispensing Notes *</Label>
                    <Textarea
                      id="notes"
                      placeholder="Record dispensing details, patient counseling, etc."
                      value={dispensingNotes}
                      onChange={(e) => setDispensingNotes(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setSelectedPrescription(null)} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={confirmDispensing} disabled={isDispensing} className="flex-1">
                      {isDispensing ? "Processing..." : "Confirm Dispensing"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Select Prescription</CardTitle>
                  <CardDescription>Choose a prescription to dispense</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Select a prescription from the queue to begin dispensing</p>
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
