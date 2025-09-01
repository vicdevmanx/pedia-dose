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
  id: number
  name: string
  genericName: string
  brandNames: string[]
  category: string
  indication: string
  warnings: string[]
}

interface DrugSearchProps {
  onDrugSelect?: (drug: Drug) => void
  placeholder?: string
}

// Mock drug data - in real app this would come from API
const mockDrugs: Drug[] = [
  {
    id: 1,
    name: "Acetaminophen",
    genericName: "Acetaminophen",
    brandNames: ["Tylenol", "Panadol"],
    category: "Analgesics",
    indication: "Pain relief, fever reduction",
    warnings: ["Hepatotoxicity risk", "Maximum daily dose limits"],
  },
  {
    id: 2,
    name: "Amoxicillin",
    genericName: "Amoxicillin",
    brandNames: ["Amoxil", "Trimox"],
    category: "Antibiotics",
    indication: "Bacterial infections",
    warnings: ["Penicillin allergy", "C. diff risk"],
  },
  {
    id: 3,
    name: "Ibuprofen",
    genericName: "Ibuprofen",
    brandNames: ["Advil", "Motrin"],
    category: "NSAIDs",
    indication: "Pain relief, fever reduction, inflammation",
    warnings: ["GI bleeding risk", "Renal impairment"],
  },
]

export function DrugSearch({ onDrugSelect, placeholder = "Search drugs..." }: DrugSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredDrugs, setFilteredDrugs] = useState<Drug[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = mockDrugs.filter(
        (drug) =>
          drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          drug.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          drug.brandNames.some((brand) => brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
          drug.indication.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredDrugs(filtered)
    } else {
      setFilteredDrugs([])
    }
  }, [searchTerm])

  const handleDrugSelect = (drug: Drug) => {
    onDrugSelect?.(drug)
    setIsOpen(false)
    setSearchTerm("")
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      Analgesics: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      Antibiotics: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      NSAIDs: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      Bronchodilators: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      Antiemetics: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Search Drugs</DialogTitle>
          <DialogDescription>Find and select a drug from the database</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Type drug name, brand, or indication..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          <div className="max-h-96 overflow-y-auto space-y-2">
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
                            Generic: {drug.genericName} • Brands: {drug.brandNames.join(", ")}
                          </p>
                          <p className="text-sm">{drug.indication}</p>
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
