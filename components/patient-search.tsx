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
import { Search, User, Plus, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface Patient {
  id: number
  name: string
  age: number
  weight: number
  gender: string
  allergies: string[]
  conditions: string[]
}

interface PatientSearchProps {
  onPatientSelect?: (patient: Patient) => void
  showAddButton?: boolean
  placeholder?: string
}

// Mock patient data - in real app this would come from API
const mockPatients: Patient[] = [
  {
    id: 1,
    name: "Emma Johnson",
    age: 8,
    weight: 25.5,
    gender: "Female",
    allergies: ["Penicillin", "Peanuts"],
    conditions: ["Asthma"],
  },
  {
    id: 2,
    name: "Michael Chen",
    age: 5,
    weight: 18.2,
    gender: "Male",
    allergies: [],
    conditions: [],
  },
  {
    id: 3,
    name: "Sarah Williams",
    age: 12,
    weight: 42.1,
    gender: "Female",
    allergies: ["Latex"],
    conditions: ["Type 1 Diabetes"],
  },
]

export function PatientSearch({
  onPatientSelect,
  showAddButton = true,
  placeholder = "Search patients...",
}: PatientSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = mockPatients.filter((patient) => patient.name.toLowerCase().includes(searchTerm.toLowerCase()))
      setFilteredPatients(filtered)
    } else {
      setFilteredPatients([])
    }
  }, [searchTerm])

  const handlePatientSelect = (patient: Patient) => {
    onPatientSelect?.(patient)
    setIsOpen(false)
    setSearchTerm("")
  }

  const hasAllergies = (allergies: string[]) => {
    return allergies.length > 0
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
          <DialogTitle>Search Patients</DialogTitle>
          <DialogDescription>Find and select a patient from the database</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Type patient name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <Card
                  key={patient.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handlePatientSelect(patient)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{patient.name}</h4>
                            {hasAllergies(patient.allergies) && (
                              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Allergies
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {patient.age} years • {patient.weight} kg • {patient.gender}
                          </p>
                          {patient.conditions.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {patient.conditions.map((condition) => (
                                <Badge key={condition} variant="secondary" className="text-xs">
                                  {condition}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : searchTerm.length > 0 ? (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No patients found</h3>
                <p className="text-muted-foreground mb-4">No patients match your search criteria</p>
                {showAddButton && (
                  <Link href="/patients/add">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Patient
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Start typing to search for patients</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
