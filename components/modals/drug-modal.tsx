"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Pill } from "lucide-react"

interface Drug {
  id?: string
  name: string
  genericName: string
  brandNames: string[]
  category: string
  dosageForm: string
  concentration: string
  indication: string
  ageRange: string
  dosageGuidelines: {
    mgPerKg: string
    mgPerM2: string
    maxDaily: string
    routes: string[]
    frequency: string
  }
  warnings: string[]
  contraindications: string[]
  sideEffects: string[]
  interactions: string[]
  status: string
}

interface DrugModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (drug: Drug) => void
  drug?: Drug | null
  mode: "add" | "edit"
}

export function DrugModal({ isOpen, onClose, onSave, drug, mode }: DrugModalProps) {
  const [formData, setFormData] = useState<Drug>({
    name: "",
    genericName: "",
    brandNames: [],
    category: "",
    dosageForm: "",
    concentration: "",
    indication: "",
    ageRange: "",
    dosageGuidelines: {
      mgPerKg: "",
      mgPerM2: "",
      maxDaily: "",
      routes: [],
      frequency: "",
    },
    warnings: [],
    contraindications: [],
    sideEffects: [],
    interactions: [],
    status: "active",
  })
  const [newRoute, setNewRoute] = useState("")
  const [newWarning, setNewWarning] = useState("")
  const [newContraindication, setNewContraindication] = useState("")
  const [newSideEffect, setNewSideEffect] = useState("")
  const [newInteraction, setNewInteraction] = useState("")
  const [newBrandName, setNewBrandName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (drug && mode === "edit") {
      setFormData(drug)
    } else {
      setFormData({
        name: "",
        genericName: "",
        brandNames: [],
        category: "",
        dosageForm: "",
        concentration: "",
        indication: "",
        ageRange: "",
        dosageGuidelines: {
          mgPerKg: "",
          mgPerM2: "",
          maxDaily: "",
          routes: [],
          frequency: "",
        },
        warnings: [],
        contraindications: [],
        sideEffects: [],
        interactions: [],
        status: "active",
      })
    }
  }, [drug, mode, isOpen])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await onSave(formData)
    } catch (error) {
      console.error("Error saving drug:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addRoute = () => {
    if (newRoute.trim() && !formData.dosageGuidelines.routes.includes(newRoute.trim())) {
      setFormData((prev) => ({
        ...prev,
        dosageGuidelines: {
          ...prev.dosageGuidelines,
          routes: [...prev.dosageGuidelines.routes, newRoute.trim()],
        },
      }))
      setNewRoute("")
    }
  }

  const removeRoute = (route: string) => {
    setFormData((prev) => ({
      ...prev,
      dosageGuidelines: {
        ...prev.dosageGuidelines,
        routes: prev.dosageGuidelines.routes.filter((r) => r !== route),
      },
    }))
  }

  const addWarning = () => {
    if (newWarning.trim() && !formData.warnings.includes(newWarning.trim())) {
      setFormData((prev) => ({
        ...prev,
        warnings: [...prev.warnings, newWarning.trim()],
      }))
      setNewWarning("")
    }
  }

  const removeWarning = (warning: string) => {
    setFormData((prev) => ({
      ...prev,
      warnings: prev.warnings.filter((w) => w !== warning),
    }))
  }

  const addContraindication = () => {
    if (newContraindication.trim() && !formData.contraindications.includes(newContraindication.trim())) {
      setFormData((prev) => ({
        ...prev,
        contraindications: [...prev.contraindications, newContraindication.trim()],
      }))
      setNewContraindication("")
    }
  }

  const removeContraindication = (contraindication: string) => {
    setFormData((prev) => ({
      ...prev,
      contraindications: prev.contraindications.filter((c) => c !== contraindication),
    }))
  }

  const addSideEffect = () => {
    if (newSideEffect.trim() && !formData.sideEffects.includes(newSideEffect.trim())) {
      setFormData((prev) => ({
        ...prev,
        sideEffects: [...prev.sideEffects, newSideEffect.trim()],
      }))
      setNewSideEffect("")
    }
  }

  const removeSideEffect = (sideEffect: string) => {
    setFormData((prev) => ({
      ...prev,
      sideEffects: prev.sideEffects.filter((s) => s !== sideEffect),
    }))
  }

  const addInteraction = () => {
    if (newInteraction.trim() && !formData.interactions.includes(newInteraction.trim())) {
      setFormData((prev) => ({
        ...prev,
        interactions: [...prev.interactions, newInteraction.trim()],
      }))
      setNewInteraction("")
    }
  }

  const removeInteraction = (interaction: string) => {
    setFormData((prev) => ({
      ...prev,
      interactions: prev.interactions.filter((i) => i !== interaction),
    }))
  }

  const addBrandName = () => {
    if (newBrandName.trim() && !formData.brandNames.includes(newBrandName.trim())) {
      setFormData((prev) => ({
        ...prev,
        brandNames: [...prev.brandNames, newBrandName.trim()],
      }))
      setNewBrandName("")
    }
  }

  const removeBrandName = (brand: string) => {
    setFormData((prev) => ({
      ...prev,
      brandNames: prev.brandNames.filter((b) => b !== brand),
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl">
        <DialogHeader>
          <DialogTitle className="flex gap-2">
            <Pill className="h-5 w-5" />
            {mode === "add" ? "Add New Drug" : "Edit Drug"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add" ? "Enter drug information to add it to the database" : "Update drug information"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold">Basic Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="drug-name">Brand Name *</Label>
                <Input
                  id="drug-name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter brand name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="generic-name">Generic Name *</Label>
                <Input
                  id="generic-name"
                  value={formData.genericName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, genericName: e.target.value }))}
                  placeholder="Enter generic name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand-names">Brand Names</Label>
                <div className="flex gap-2">
                  <Input
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    placeholder="Add brand name"
                    onKeyPress={(e) => e.key === "Enter" && addBrandName()}
                  />
                  <Button type="button" onClick={addBrandName} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.brandNames.map((brand) => (
                    <Badge key={brand} variant="secondary" className="flex items-center gap-1">
                      {brand}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeBrandName(brand)} />
                    </Badge>
                  ))}
                  {formData.brandNames.length === 0 && (
                    <p className="text-sm text-muted-foreground">No brand names added</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select drug category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Analgesics">Analgesics</SelectItem>
                    <SelectItem value="Antibiotics">Antibiotics</SelectItem>
                    <SelectItem value="Antihistamines">Antihistamines</SelectItem>
                    <SelectItem value="Bronchodilators">Bronchodilators</SelectItem>
                    <SelectItem value="Corticosteroids">Corticosteroids</SelectItem>
                    <SelectItem value="Antipyretics">Antipyretics</SelectItem>
                    <SelectItem value="Antiemetics">Antiemetics</SelectItem>
                    <SelectItem value="Sedatives">Sedatives</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dosage-form">Dosage Form</Label>
                <Input
                  id="dosage-form"
                  value={formData.dosageForm}
                  onChange={(e) => setFormData((prev) => ({ ...prev, dosageForm: e.target.value }))}
                  placeholder="e.g., Oral Suspension, Tablets"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="concentration">Concentration</Label>
                <Input
                  id="concentration"
                  value={formData.concentration}
                  onChange={(e) => setFormData((prev) => ({ ...prev, concentration: e.target.value }))}
                  placeholder="e.g., 160mg/5ml, 80mg/ml"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="indication">Indication</Label>
                <Input
                  id="indication"
                  value={formData.indication}
                  onChange={(e) => setFormData((prev) => ({ ...prev, indication: e.target.value }))}
                  placeholder="e.g., Pain relief, fever reduction"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age-range">Age Range</Label>
                <Input
                  id="age-range"
                  value={formData.ageRange}
                  onChange={(e) => setFormData((prev) => ({ ...prev, ageRange: e.target.value }))}
                  placeholder="e.g., 0-18 years"
                />
              </div>
            </div>
          </div>

          {/* Dosage Guidelines */}
          <div className="space-y-4">
            <h3 className="font-semibold">Dosage Guidelines</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="mg-per-kg">mg/kg Dosage *</Label>
                <Input
                  id="mg-per-kg"
                  value={formData.dosageGuidelines.mgPerKg}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dosageGuidelines: { ...prev.dosageGuidelines, mgPerKg: e.target.value },
                    }))
                  }
                  placeholder="e.g., 10-15 mg/kg every 4-6 hours"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mg-per-m2">mg/m² Dosage</Label>
                <Input
                  id="mg-per-m2"
                  value={formData.dosageGuidelines.mgPerM2}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dosageGuidelines: { ...prev.dosageGuidelines, mgPerM2: e.target.value },
                    }))
                  }
                  placeholder="e.g., 500 mg/m² or Not typically calculated by BSA"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-daily">Maximum Daily Dose *</Label>
                <Input
                  id="max-daily"
                  value={formData.dosageGuidelines.maxDaily}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dosageGuidelines: { ...prev.dosageGuidelines, maxDaily: e.target.value },
                    }))
                  }
                  placeholder="e.g., 75 mg/kg/day (maximum 4000mg/day)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency *</Label>
                <Input
                  id="frequency"
                  value={formData.dosageGuidelines.frequency}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dosageGuidelines: { ...prev.dosageGuidelines, frequency: e.target.value },
                    }))
                  }
                  placeholder="e.g., Every 4-6 hours as needed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Administration Routes *</Label>
              <div className="flex gap-2">
                <Select value={newRoute} onValueChange={setNewRoute}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select route to add" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Oral">Oral</SelectItem>
                    <SelectItem value="IV">Intravenous (IV)</SelectItem>
                    <SelectItem value="IM">Intramuscular (IM)</SelectItem>
                    <SelectItem value="Rectal">Rectal</SelectItem>
                    <SelectItem value="Topical">Topical</SelectItem>
                    <SelectItem value="Inhalation">Inhalation</SelectItem>
                    <SelectItem value="Sublingual">Sublingual</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="button" onClick={addRoute} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.dosageGuidelines.routes.map((route) => (
                  <Badge key={route} variant="secondary" className="flex items-center gap-1">
                    {route}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeRoute(route)} />
                  </Badge>
                ))}
                {formData.dosageGuidelines.routes.length === 0 && (
                  <p className="text-sm text-muted-foreground">No routes added</p>
                )}
              </div>
            </div>
          </div>

          {/* Warnings */}
          <div className="space-y-4">
            <h3 className="font-semibold">Warnings</h3>
            <div className="flex gap-2">
              <Input
                value={newWarning}
                onChange={(e) => setNewWarning(e.target.value)}
                placeholder="Add warning"
                onKeyPress={(e) => e.key === "Enter" && addWarning()}
              />
              <Button type="button" onClick={addWarning} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {formData.warnings.map((warning, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-yellow-50 border border-yellow-200 rounded dark:bg-yellow-950 dark:border-yellow-800"
                >
                  <span className="text-sm">{warning}</span>
                  <X className="h-4 w-4 cursor-pointer text-yellow-600" onClick={() => removeWarning(warning)} />
                </div>
              ))}
              {formData.warnings.length === 0 && <p className="text-sm text-muted-foreground">No warnings added</p>}
            </div>
          </div>

          {/* Contraindications */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contraindications</h3>
            <div className="flex gap-2">
              <Input
                value={newContraindication}
                onChange={(e) => setNewContraindication(e.target.value)}
                placeholder="Add contraindication"
                onKeyPress={(e) => e.key === "Enter" && addContraindication()}
              />
              <Button type="button" onClick={addContraindication} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {formData.contraindications.map((contraindication, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-red-50 border border-red-200 rounded dark:bg-red-950 dark:border-red-800"
                >
                  <span className="text-sm">{contraindication}</span>
                  <X
                    className="h-4 w-4 cursor-pointer text-red-600"
                    onClick={() => removeContraindication(contraindication)}
                  />
                </div>
              ))}
              {formData.contraindications.length === 0 && (
                <p className="text-sm text-muted-foreground">No contraindications added</p>
              )}
            </div>
          </div>

          {/* Side Effects */}
          <div className="space-y-4">
            <h3 className="font-semibold">Side Effects</h3>
            <div className="flex gap-2">
              <Input
                value={newSideEffect}
                onChange={(e) => setNewSideEffect(e.target.value)}
                placeholder="Add side effect"
                onKeyPress={(e) => e.key === "Enter" && addSideEffect()}
              />
              <Button type="button" onClick={addSideEffect} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {formData.sideEffects.map((sideEffect, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded dark:bg-gray-950 dark:border-gray-800"
                >
                  <span className="text-sm">{sideEffect}</span>
                  <X
                    className="h-4 w-4 cursor-pointer text-gray-600"
                    onClick={() => removeSideEffect(sideEffect)}
                  />
                </div>
              ))}
              {formData.sideEffects.length === 0 && (
                <p className="text-sm text-muted-foreground">No side effects added</p>
              )}
            </div>
          </div>

          {/* Interactions */}
          <div className="space-y-4">
            <h3 className="font-semibold">Interactions</h3>
            <div className="flex gap-2">
              <Input
                value={newInteraction}
                onChange={(e) => setNewInteraction(e.target.value)}
                placeholder="Add interaction"
                onKeyPress={(e) => e.key === "Enter" && addInteraction()}
              />
              <Button type="button" onClick={addInteraction} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {formData.interactions.map((interaction, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded dark:bg-blue-950 dark:border-blue-800"
                >
                  <span className="text-sm">{interaction}</span>
                  <X
                    className="h-4 w-4 cursor-pointer text-blue-600"
                    onClick={() => removeInteraction(interaction)}
                  />
                </div>
              ))}
              {formData.interactions.length === 0 && (
                <p className="text-sm text-muted-foreground">No interactions added</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              !formData.name ||
              !formData.genericName ||
              !formData.category ||
              formData.dosageGuidelines.routes.length === 0 ||
              isLoading
            }
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : mode === "add" ? (
              "Add Drug"
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}