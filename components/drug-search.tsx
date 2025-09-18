"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Pill, AlertTriangle } from "lucide-react"

interface Drug {
  id: string
  name: string
  genericName: string
  brandNames: string[]
  category: string
  dosageForm: string | null
  concentration: string | null
  indication: string | null
  ageRange: string | null
  dosageGuidelines: {
    mgPerKg: string
    mgPerM2: string
    maxDaily: string
    routes: string[]
    frequency: string
  }
  warnings: string[]
  contraindications: string[]
  sideEffects: {
    common: string[]
    serious: string[]
    rare: string[]
  } | null
  interactions: string[]
  status: string | null
  mechanism: string | null
  monitoring: string[]
  storage: string | null
}

interface DrugSearchProps {
  onDrugSelect?: (drug: Drug) => void
  placeholder?: string
}

export function DrugSearch({ onDrugSelect, placeholder = "Search drugs..." }: DrugSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredDrugs, setFilteredDrugs] = useState<Drug[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDrugs = async () => {
      if (searchTerm.length === 0) {
        setFilteredDrugs([])
        setError(null)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/drugs?search=${encodeURIComponent(searchTerm)}`)
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `HTTP error ${response.status}`)
        }

        const drugData = await response.json()

        // Normalize data
        const formattedDrugs = Array.isArray(drugData)
          ? drugData.map((drug: any) => ({
              ...drug,
              id: drug.id ? String(drug.id) : "", // Ensure id is string
              brandNames: Array.isArray(drug.brandNames) ? drug.brandNames : [],
              warnings: Array.isArray(drug.warnings) ? drug.warnings : [],
              contraindications: Array.isArray(drug.contraindications) ? drug.contraindications : [],
              interactions: Array.isArray(drug.interactions) ? drug.interactions : [],
              monitoring: Array.isArray(drug.monitoring) ? drug.monitoring : [],
              sideEffects: drug.sideEffects && typeof drug.sideEffects === 'object' && 'common' in drug.sideEffects
                ? drug.sideEffects
                : { common: [], serious: [], rare: [] },
              dosageGuidelines: {
                mgPerKg: drug.dosageGuidelines?.mgPerKg || drug.dosageGuidelines?.weight_based || 'Not specified',
                mgPerM2: drug.dosageGuidelines?.mgPerM2 || 'Not typically calculated by BSA',
                maxDaily: drug.dosageGuidelines?.maxDaily || drug.dosageGuidelines?.max_daily || 'Not specified',
                routes: JSON.parse(drug.dosageGuidelines.routes) || ['Unknown'],
                frequency: drug.dosageGuidelines?.frequency || drug.dosageGuidelines?.age_based || drug.dosageGuidelines?.duration || 'As prescribed',
                ...drug.dosageGuidelines,
              },
              status: drug.status || 'active',
              mechanism: drug.mechanism || '',
              storage: drug.storage || '',
            }))
          : []

        setFilteredDrugs(formattedDrugs)
      } catch (e: any) {
        setError(e.message || 'Failed to fetch drugs')
        console.error('Fetch error:', e)
        setFilteredDrugs([])
      } finally {
        setLoading(false)
      }
    }

    fetchDrugs()
  }, [searchTerm])

  const handleDrugSelect = (drug: Drug) => {
    onDrugSelect?.(drug)
    setIsOpen(false)
    setSearchTerm("")
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Analgesic/Antipyretic': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Antibiotics': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'NSAIDs': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Bronchodilator': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Antiemetic': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'Antihistamine': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      'Corticosteroid': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Antithyroid Agent': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
      'Thyroid Hormone': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
      'Opioid Antagonist': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Proton Pump Inhibitor': 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
      'Hormone': 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
      'Antibiotic/Antiprotozoal': 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200',
      'Opioid Analgesic': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
      'Cardiac Glycoside': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      'Leukotriene Receptor Antagonist': 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-200',
      'First Generation Antihistamine': 'bg-indigo-200 text-indigo-900 dark:bg-indigo-800 dark:text-indigo-100',
      'Antiflatulent': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      'Stimulant Laxative': 'bg-orange-200 text-orange-900 dark:bg-orange-800 dark:text-orange-100',
      'Anticonvulsant': 'bg-purple-200 text-purple-900 dark:bg-purple-800 dark:text-purple-100',
      'Antifungal': 'bg-green-200 text-green-900 dark:bg-green-800 dark:text-green-100',
      'Prokinetic': 'bg-pink-200 text-pink-900 dark:bg-pink-800 dark:text-pink-100',
      'Stool Softener': 'bg-teal-200 text-teal-900 dark:bg-teal-800 dark:text-teal-100',
      'Loop Diuretic': 'bg-blue-200 text-blue-900 dark:bg-blue-800 dark:text-blue-100',
      'Analgesics': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    }
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }

  const hasWarnings = (warnings: string[]) => {
    return warnings.length > 0
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start bg-transparent">
          <Search className="h-4 w-4 mr-2" />
          {placeholder}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Search Drugs</DialogTitle>
          <DialogDescription>Find and select a drug from the database</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Type drug name, brand, or indication..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-950 dark:border-red-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-800 dark:text-red-200">{error}</span>
              </div>
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-2">
              {filteredDrugs.length > 0 ? (
                filteredDrugs.map((drug) => (
                  <Card
                    key={drug.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleDrugSelect(drug)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Pill className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{drug.name}</h4>
                              <Badge className={getCategoryColor(drug.category)}>{drug.category}</Badge>
                              {hasWarnings(drug.warnings) && (
                                <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Warnings
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Generic: {drug.genericName} • Brands:{" "}
                              {drug.brandNames.length > 0 ? drug.brandNames.join(", ") : "N/A"}
                            </p>
                            <p className="text-sm">{drug.indication || "No indication specified"}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : searchTerm.length > 0 ? (
                <div className="text-center py-8">
                  <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No drugs found</h3>
                  <p className="text-muted-foreground">No drugs match your search criteria</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Start typing to search for drugs</p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}