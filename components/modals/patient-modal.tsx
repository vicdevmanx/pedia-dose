"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X, Plus, User, Phone, MapPin } from "lucide-react"

interface Patient {
  id?: number
  name: string
  age: number
  weight: number
  height?: number
  gender: string
  allergies: string[]
  conditions: string[]
  emergencyContact?: {
    name: string
    relationship: string
    phone: string
  }
  address?: string
  medicalRecordNumber?: string
}

interface PatientModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (patient: Patient) => void
  patient?: Patient | null
  mode: "add" | "edit"
}

export function PatientModal({ isOpen, onClose, onSave, patient, mode }: PatientModalProps) {
  const [formData, setFormData] = useState<Patient>({
    name: "",
    age: 0,
    weight: 0,
    height: undefined,
    gender: "",
    allergies: [],
    conditions: [],
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
    address: "",
    medicalRecordNumber: "",
  })
  const [newAllergy, setNewAllergy] = useState("")
  const [newCondition, setNewCondition] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (patient && mode === "edit") {
      setFormData({
        ...patient,
        emergencyContact: patient.emergencyContact || {
          name: "",
          relationship: "",
          phone: "",
        },
      })
    } else {
      setFormData({
        name: "",
        age: 0,
        weight: 0,
        height: undefined,
        gender: "",
        allergies: [],
        conditions: [],
        emergencyContact: {
          name: "",
          relationship: "",
          phone: "",
        },
        address: "",
        medicalRecordNumber: "",
      })
    }
  }, [patient, mode, isOpen])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const patientData = {
        ...formData,
        id: mode === "edit" ? patient?.id : Date.now(),
      }

      onSave(patientData)
      onClose()
    } catch (error) {
      console.error("Error saving patient:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addAllergy = () => {
    if (newAllergy.trim() && !formData.allergies.includes(newAllergy.trim())) {
      setFormData((prev) => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()],
      }))
      setNewAllergy("")
    }
  }

  const removeAllergy = (allergy: string) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((a) => a !== allergy),
    }))
  }

  const addCondition = () => {
    if (newCondition.trim() && !formData.conditions.includes(newCondition.trim())) {
      setFormData((prev) => ({
        ...prev,
        conditions: [...prev.conditions, newCondition.trim()],
      }))
      setNewCondition("")
    }
  }

  const removeCondition = (condition: string) => {
    setFormData((prev) => ({
      ...prev,
      conditions: prev.conditions.filter((c) => c !== condition),
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {mode === "add" ? "Add New Patient" : "Edit Patient"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add" ? "Enter patient information to add them to the database" : "Update patient information"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold">Basic Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter patient's full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mrn">Medical Record Number</Label>
                <Input
                  id="mrn"
                  value={formData.medicalRecordNumber || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, medicalRecordNumber: e.target.value }))}
                  placeholder="MRN (optional)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age (years) *</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, age: Number(e.target.value) }))}
                  placeholder="Age in years"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, weight: Number(e.target.value) }))}
                  placeholder="Weight in kg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, height: Number(e.target.value) || undefined }))}
                  placeholder="Height in cm (optional)"
                />
              </div>
            </div>
          </div>

          {/* Allergies */}
          <div className="space-y-4">
            <h3 className="font-semibold">Allergies</h3>
            <div className="flex gap-2">
              <Input
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                placeholder="Add allergy"
                onKeyPress={(e) => e.key === "Enter" && addAllergy()}
              />
              <Button type="button" onClick={addAllergy} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.allergies.map((allergy) => (
                <Badge key={allergy} variant="destructive" className="flex items-center gap-1">
                  {allergy}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeAllergy(allergy)} />
                </Badge>
              ))}
              {formData.allergies.length === 0 && <p className="text-sm text-muted-foreground">No known allergies</p>}
            </div>
          </div>

          {/* Medical Conditions */}
          <div className="space-y-4">
            <h3 className="font-semibold">Medical Conditions</h3>
            <div className="flex gap-2">
              <Input
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                placeholder="Add medical condition"
                onKeyPress={(e) => e.key === "Enter" && addCondition()}
              />
              <Button type="button" onClick={addCondition} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.conditions.map((condition) => (
                <Badge key={condition} variant="secondary" className="flex items-center gap-1">
                  {condition}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeCondition(condition)} />
                </Badge>
              ))}
              {formData.conditions.length === 0 && <p className="text-sm text-muted-foreground">No known conditions</p>}
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Emergency Contact
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="emergency-name">Contact Name</Label>
                <Input
                  id="emergency-name"
                  value={formData.emergencyContact?.name || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      emergencyContact: { ...prev.emergencyContact!, name: e.target.value },
                    }))
                  }
                  placeholder="Emergency contact name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="relationship">Relationship</Label>
                <Input
                  id="relationship"
                  value={formData.emergencyContact?.relationship || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      emergencyContact: { ...prev.emergencyContact!, relationship: e.target.value },
                    }))
                  }
                  placeholder="e.g., Parent, Guardian"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency-phone">Phone Number</Label>
                <Input
                  id="emergency-phone"
                  value={formData.emergencyContact?.phone || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      emergencyContact: { ...prev.emergencyContact!, phone: e.target.value },
                    }))
                  }
                  placeholder="Emergency phone number"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Address
            </h3>
            <Textarea
              value={formData.address || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
              placeholder="Patient's address (optional)"
              rows={2}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!formData.name || !formData.age || !formData.weight || !formData.gender || isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : mode === "add" ? (
              "Add Patient"
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
