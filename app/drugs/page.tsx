"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DrugModal } from "@/components/modals/drug-modal"
import { Search, Pill, AlertTriangle, Eye, Filter, Plus, Edit } from "lucide-react"
import Link from "next/link"

const drugCategories = [
  "All Categories",
  "Analgesic/Antipyretic",
  "Antibiotics",
  "NSAIDs",
  "Bronchodilator",
  "Antiemetic",
  "Antihistamine",
  "Corticosteroid",
  "Antithyroid Agent",
  "Thyroid Hormone",
  "Opioid Antagonist",
  "Proton Pump Inhibitor",
  "Hormone",
  "Antibiotic/Antiprotozoal",
  "Opioid Analgesic",
  "Cardiac Glycoside",
  "Leukotriene Receptor Antagonist",
  "First Generation Antihistamine",
  "Antiflatulent",
  "Stimulant Laxative",
  "Anticonvulsant",
  "Antifungal",
  "Prokinetic",
  "Stool Softener",
  "Loop Diuretic",
  "Analgesics", // For Thjjjjjj
]

export default function DrugsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedDrug, setSelectedDrug] = useState<any>(null)
  const [drugs, setDrugs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch drugs on mount and when filters change
  useEffect(() => {
    const fetchDrugs = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (searchTerm) params.set('search', searchTerm)
        if (selectedCategory !== 'All Categories') params.set('category', selectedCategory)

        const response = await fetch(`/api/drugs?${params.toString()}`)
        let data
        try {
          data = await response.json()
        } catch {
          throw new Error('API returned invalid JSON')
        }
        if (!response.ok) throw new Error(data.error || 'Failed to fetch drugs')
        // Normalize data
        const normalizedDrugs = Array.isArray(data)
          ? data.map((drug: any) => ({
              ...drug,
              sideEffects:
                drug.sideEffects && typeof drug.sideEffects === 'object' && 'common' in drug.sideEffects
                  ? drug.sideEffects
                  : { common: [], serious: [], rare: [] },
              brandNames: drug.brandNames || [],
              warnings: drug.warnings || [],
              contraindications: drug.contraindications || [],
              interactions: drug.interactions || [],
              monitoring: drug.monitoring || [],
              dosageGuidelines: {
                mgPerKg: drug.dosageGuidelines?.mgPerKg || drug.dosageGuidelines?.weight_based || 'Not specified',
                mgPerM2: drug.dosageGuidelines?.mgPerM2 || 'Not typically calculated by BSA',
                maxDaily: drug.dosageGuidelines?.maxDaily || drug.dosageGuidelines?.max_daily || 'Not specified',
                routes: drug.dosageGuidelines?.routes || ['Unknown'],
                frequency:
                  drug.dosageGuidelines?.frequency ||
                  drug.dosageGuidelines?.age_based ||
                  drug.dosageGuidelines?.duration ||
                  'As prescribed',
              },
            }))
          : []
        setDrugs(normalizedDrugs)
      } catch (err: any) {
        setError(err.message || 'Error fetching drugs')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDrugs()
  }, [searchTerm, selectedCategory])

  const getCategoryColor = (category: string) => {
    const colors = {
      'Analgesic/Antipyretic': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      Antibiotics: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      NSAIDs: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      Bronchodilator: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      Antiemetic: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      Antihistamine: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      Corticosteroid: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Antithyroid Agent': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
      'Thyroid Hormone': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
      'Opioid Antagonist': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Proton Pump Inhibitor': 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
      Hormone: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
      'Antibiotic/Antiprotozoal': 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200',
      'Opioid Analgesic': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
      'Cardiac Glycoside': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      'Leukotriene Receptor Antagonist': 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-200',
      'First Generation Antihistamine': 'bg-indigo-200 text-indigo-900 dark:bg-indigo-800 dark:text-indigo-100',
      Antiflatulent: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      'Stimulant Laxative': 'bg-orange-200 text-orange-900 dark:bg-orange-800 dark:text-orange-100',
      Anticonvulsant: 'bg-purple-200 text-purple-900 dark:bg-purple-800 dark:text-purple-100',
      Antifungal: 'bg-green-200 text-green-900 dark:bg-green-800 dark:text-green-100',
      Prokinetic: 'bg-pink-200 text-pink-900 dark:bg-pink-800 dark:text-pink-100',
      'Stool Softener': 'bg-teal-200 text-teal-900 dark:bg-teal-800 dark:text-teal-100',
      'Loop Diuretic': 'bg-blue-200 text-blue-900 dark:bg-blue-800 dark:text-blue-100',
      Analgesics: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', // For Thjjjjjj
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }

  const hasWarnings = (warnings: string[]) => {
    return warnings.length > 0
  }

  const handleAddDrug = async (newDrug: any) => {
    try {
      const normalizedDrug = {
        ...newDrug,
        dosageGuidelines: {
          mgPerKg: newDrug.dosageGuidelines?.mgPerKg || 'Not specified',
          mgPerM2: newDrug.dosageGuidelines?.mgPerM2 || 'Not typically calculated by BSA',
          maxDaily: newDrug.dosageGuidelines?.maxDaily || 'Not specified',
          routes: newDrug.dosageGuidelines?.routes || ['Unknown'],
          frequency: newDrug.dosageGuidelines?.frequency || 'As prescribed',
        },
      }
      const response = await fetch('/api/drugs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalizedDrug),
      })
      if (!response.ok) throw new Error('Failed to add drug')
      const addedDrug = await response.json()
      setDrugs([...drugs, addedDrug])
      setShowAddModal(false)
    } catch (err) {
      console.error('Error adding drug:', err)
      setError('Error adding drug')
    }
  }

  const handleEditDrug = async (updatedDrug: any) => {
    try {
      const normalizedDrug = {
        ...updatedDrug,
        dosageGuidelines: {
          mgPerKg: updatedDrug.dosageGuidelines?.mgPerKg || 'Not specified',
          mgPerM2: updatedDrug.dosageGuidelines?.mgPerM2 || 'Not typically calculated by BSA',
          maxDaily: updatedDrug.dosageGuidelines?.maxDaily || 'Not specified',
          routes: updatedDrug.dosageGuidelines?.routes || ['Unknown'],
          frequency: updatedDrug.dosageGuidelines?.frequency || 'As prescribed',
        },
      }
      const response = await fetch(`/api/drugs/${selectedDrug.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalizedDrug),
      })
      if (!response.ok) throw new Error('Failed to update drug')
      const updated = await response.json()
      setDrugs(drugs.map((d) => (d.id === selectedDrug.id ? updated : d)))
      setShowEditModal(false)
      setSelectedDrug(null)
    } catch (err) {
      console.error('Error updating drug:', err)
      setError('Error updating drug')
    }
  }

  const handleDeleteDrug = async (id: string) => {
    try {
      const response = await fetch(`/api/drugs/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete drug')
      setDrugs(drugs.filter((d) => d.id !== id))
    } catch (err) {
      console.error('Error deleting drug:', err)
      setError('Error deleting drug')
    }
  }

  const openEditModal = (drug: any) => {
    setSelectedDrug(drug)
    setShowEditModal(true)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Drug Database</h1>
            <p className="text-muted-foreground">
              Comprehensive pediatric drug information including dosage guidelines and safety information
            </p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Drug
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-950 dark:border-red-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-800 dark:text-red-200">{error}</span>
            </div>
          </div>
        )}

        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Drugs</CardTitle>
              <Pill className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{drugs.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{drugCategories.length - 1}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Drugs</CardTitle>
              <Pill className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {drugs.filter((d) => d.status === "active").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Alert</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {drugs.filter((d) => hasWarnings(d.warnings)).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="p-0 border-0 outline-0 shadow-none">
          <CardHeader className="p-0 border-0 outline-0 shadow-none">
            <CardTitle>Drug Search</CardTitle>
            <CardDescription>Search by drug name, brand name, or indication</CardDescription>
          </CardHeader>
          <CardContent className="p-0 border-0 outline-0 shadow-none">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search drugs by name, brand, or indication..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {drugCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {drugs.map((drug) => (
                  <div
                    key={drug.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-4"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Pill className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">{drug.name}</h3>
                          <Badge className={getCategoryColor(drug.category)}>{drug.category}</Badge>
                          {hasWarnings(drug.warnings) && (
                            <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Warnings
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>
                            <span className="font-medium">Generic:</span> {drug.genericName}
                          </p>
                          <p>
                            <span className="font-medium">Brands:</span>{" "}
                            {drug.brandNames.length > 0 ? drug.brandNames.join(", ") : "N/A"}
                          </p>
                          <p>
                            <span className="font-medium">Form:</span> {drug.dosageForm || "N/A"}
                          </p>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Indication:</span> {drug.indication || "N/A"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Age range: {drug.ageRange || "N/A"} • Concentration: {drug.concentration || "N/A"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Link href={`/drugs/${drug.id}`} className="flex-1 sm:flex-none">
                        <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(drug)}
                        className="flex-1 sm:flex-none"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteDrug(drug.id)}
                        className="flex-1 sm:flex-none"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isLoading && drugs.length === 0 && (
              <div className="text-center py-8">
                <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No drugs found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || selectedCategory !== "All Categories"
                    ? "Try adjusting your search terms or filters"
                    : "Get started by adding your first drug"}
                </p>
                <Button onClick={() => setShowAddModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Drug
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <DrugModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSave={handleAddDrug} mode="add" />

        <DrugModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setSelectedDrug(null)
          }}
          onSave={handleEditDrug}
          drug={selectedDrug}
          mode="edit"
        />
      </div>
    </DashboardLayout>
  )
}