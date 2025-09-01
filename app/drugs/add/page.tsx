"use client"

import type React from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Pill, AlertTriangle, Plus, X, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAlerts } from "@/components/alerts/alert-system"

export default function AddDrugPage() {
  const router = useRouter()
  const { addAlert } = useAlerts()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    genericName: "",
    brandNames: [] as string[],
    category: "",
    indication: "",
    dosageGuidelines: {
      mgPerKg: { min: "", max: "" },
      mgPerM2: { min: "", max: "" },
      maxDailyDose: "",
      routes: [] as string[],
      frequency: "",
    },
    contraindications: [] as string[],
    interactions: [] as string[],
    sideEffects: [] as string[],
    warnings: [] as string[],
    notes: "",
  })

  const [newBrandName, setNewBrandName] = useState("")
  const [newContraindication, setNewContraindication] = useState("")
  const [newInteraction, setNewInteraction] = useState("")
  const [newSideEffect, setNewSideEffect] = useState("")
  const [newWarning, setNewWarning] = useState("")
  const [newRoute, setNewRoute] = useState("")

  const handleInputChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent as keyof typeof prev], [child]: value },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const addToArray = (field: string, value: string, setValue: (value: string) => void) => {
    if (value.trim() && !formData[field as keyof typeof formData].includes(value.trim())) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...(prev[field as keyof typeof prev] as string[]), value.trim()],
      }))
      setValue("")
    }
  }

  const removeFromArray = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).filter((item) => item !== value),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!formData.name || !formData.genericName || !formData.category) {
      setError("Please fill in all required fields")
      setIsLoading(false)
      return
    }

    setTimeout(() => {
      console.log("Saving drug:", formData)
      addAlert({
        type: "safe",
        title: "Drug Added Successfully",
        message: `${formData.name} has been added to the drug database`,
        priority: "medium",
      })
      router.push("/drugs")
    }, 1000)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/drugs">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Drugs
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Add New Drug</h1>
            <p className="text-muted-foreground">Enter drug information and dosage guidelines</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>Drug identification and classification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Drug Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter drug name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="genericName">Generic Name *</Label>
                  <Input
                    id="genericName"
                    value={formData.genericName}
                    onChange={(e) => handleInputChange("genericName", e.target.value)}
                    placeholder="Enter generic name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select drug category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Analgesics">Analgesics</SelectItem>
                    <SelectItem value="Antibiotics">Antibiotics</SelectItem>
                    <SelectItem value="NSAIDs">NSAIDs</SelectItem>
                    <SelectItem value="Bronchodilators">Bronchodilators</SelectItem>
                    <SelectItem value="Antiemetics">Antiemetics</SelectItem>
                    <SelectItem value="Antihistamines">Antihistamines</SelectItem>
                    <SelectItem value="Corticosteroids">Corticosteroids</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Brand Names</Label>
                <div className="flex gap-2">
                  <Input
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    placeholder="Enter brand name"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addToArray("brandNames", newBrandName, setNewBrandName))
                    }
                  />
                  <Button
                    type="button"
                    onClick={() => addToArray("brandNames", newBrandName, setNewBrandName)}
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.brandNames.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.brandNames.map((brand) => (
                      <Badge key={brand} variant="secondary" className="flex items-center gap-1">
                        {brand}
                        <button
                          type="button"
                          onClick={() => removeFromArray("brandNames", brand)}
                          className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="indication">Indication</Label>
                <Textarea
                  id="indication"
                  value={formData.indication}
                  onChange={(e) => handleInputChange("indication", e.target.value)}
                  placeholder="Primary indications for use..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Link href="/drugs">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Drug
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
