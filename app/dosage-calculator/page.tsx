"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MedicalAlert } from "@/components/medical-alert"
import { PatientSearch } from "@/components/patient-search"
import { DrugSearch } from "@/components/drug-search"
import {
  Calculator,
  User,
  Pill,
  AlertTriangle,
  CheckCircle,
  Weight,
  Ruler,
  FileText,
  ArrowRight,
  RotateCcw,
} from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

interface Patient {
  id: number
  name: string
  age: number
  weight: number
  height?: number
  gender: string
  allergies: string[]
  conditions: string[]
}

interface Drug {
  id: number
  name: string
  genericName: string
  category: string
  dosageGuidelines: {
    mgPerKg: string
    mgPerM2: string
    maxDaily: string
    routes: string[]
    frequency: string
  }
  warnings: string[]
  contraindications: string[]
}

interface DosageResult {
  weightBased: number
  bsaBased?: number
  maxDaily: number
  recommendedDose: number
  route: string
  frequency: string
  warnings: string[]
  safetyLevel: "safe" | "caution" | "danger"
}

export default function DosageCalculatorPage() {
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null)
  const [selectedRoute, setSelectedRoute] = useState("")
  const [dosageResult, setDosageResult] = useState<DosageResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  // Check for URL parameters to pre-populate
  useEffect(() => {
    const patientId = searchParams.get("patientId")
    const drugId = searchParams.get("drugId")

    if (patientId) {
      const mockPatient = {
        id: 1,
        name: "Emma Johnson",
        age: 8,
        weight: 25.5,
        height: 125,
        gender: "Female",
        allergies: ["Penicillin", "Peanuts"],
        conditions: ["Asthma"],
      }
      setSelectedPatient(mockPatient)
      setCurrentStep(2)
    }

    if (drugId) {
      const mockDrug = {
        id: 1,
        name: "Acetaminophen",
        genericName: "Acetaminophen",
        category: "Analgesics",
        dosageGuidelines: {
          mgPerKg: "10-15 mg/kg every 4-6 hours",
          mgPerM2: "Not typically calculated by BSA",
          maxDaily: "75 mg/kg/day (maximum 4000mg/day)",
          routes: ["Oral", "Rectal"],
          frequency: "Every 4-6 hours as needed",
        },
        warnings: ["Hepatotoxicity risk with overdose", "Maximum daily dose limits must be observed"],
        contraindications: ["Severe hepatic impairment"],
      }
      setSelectedDrug(mockDrug)
      if (selectedPatient) setCurrentStep(3)
    }
  }, [searchParams, selectedPatient])

  const calculateBSA = (weight: number, height?: number) => {
    if (!height) return null
    return Math.sqrt((height * weight) / 3600)
  }

  const calculateDosage = () => {
    if (!selectedPatient || !selectedDrug || !selectedRoute) return

    setIsCalculating(true)

    setTimeout(() => {
      const mgPerKgMatch = selectedDrug.dosageGuidelines.mgPerKg.match(/(\d+)-?(\d+)?/)
      const minDose = mgPerKgMatch ? Number.parseInt(mgPerKgMatch[1]) : 10
      const maxDose = mgPerKgMatch ? Number.parseInt(mgPerKgMatch[2] || mgPerKgMatch[1]) : 15

      const avgDosePerKg = (minDose + maxDose) / 2
      const weightBasedDose = avgDosePerKg * selectedPatient.weight

      let bsaBasedDose: number | undefined
      if (selectedDrug.dosageGuidelines.mgPerM2 !== "Not typically calculated by BSA" && selectedPatient.height) {
        const bsa = calculateBSA(selectedPatient.weight, selectedPatient.height)
        if (bsa) {
          const mgPerM2Match = selectedDrug.dosageGuidelines.mgPerM2.match(/(\d+)/)
          const dosePerM2 = mgPerM2Match ? Number.parseInt(mgPerM2Match[1]) : 500
          bsaBasedDose = dosePerM2 * bsa
        }
      }

      const maxDailyMatch = selectedDrug.dosageGuidelines.maxDaily.match(/(\d+)/)
      const maxDailyPerKg = maxDailyMatch ? Number.parseInt(maxDailyMatch[1]) : 75
      const maxDaily = maxDailyPerKg * selectedPatient.weight

      const recommendedDose = Math.round(weightBasedDose * 10) / 10

      const warnings: string[] = []
      let safetyLevel: "safe" | "caution" | "danger" = "safe"

      const hasRelevantAllergy = selectedPatient.allergies.some((allergy) => {
        if (allergy === "Penicillin" && selectedDrug.name.toLowerCase().includes("amoxicillin")) return true
        if (allergy === "NSAIDs" && selectedDrug.category === "NSAIDs") return true
        return false
      })

      if (hasRelevantAllergy) {
        warnings.push(`Patient has documented allergy: ${selectedPatient.allergies.join(", ")}`)
        safetyLevel = "danger"
      }

      if (recommendedDose > maxDaily) {
        warnings.push("Calculated dose exceeds maximum daily limit")
        safetyLevel = "danger"
      } else if (recommendedDose > maxDaily * 0.8) {
        warnings.push("Dose approaching maximum daily limit - monitor closely")
        safetyLevel = "caution"
      }

      if (selectedPatient.age < 2 && selectedDrug.category === "NSAIDs") {
        warnings.push("NSAIDs not recommended for children under 2 years")
        safetyLevel = "danger"
      }

      warnings.push(...selectedDrug.warnings)

      if (warnings.length > 0 && safetyLevel === "safe") {
        safetyLevel = "caution"
      }

      const result: DosageResult = {
        weightBased: Math.round(weightBasedDose * 10) / 10,
        bsaBased: bsaBasedDose ? Math.round(bsaBasedDose * 10) / 10 : undefined,
        maxDaily: Math.round(maxDaily * 10) / 10,
        recommendedDose,
        route: selectedRoute,
        frequency: selectedDrug.dosageGuidelines.frequency,
        warnings,
        safetyLevel,
      }

      setDosageResult(result)
      setCurrentStep(4)
      setIsCalculating(false)
    }, 1500)
  }

  const resetCalculator = () => {
    setCurrentStep(1)
    setSelectedPatient(null)
    setSelectedDrug(null)
    setSelectedRoute("")
    setDosageResult(null)
  }

  const generatePrescription = () => {
    if (!selectedPatient || !selectedDrug || !dosageResult) return

    console.log("Generating prescription:", {
      patient: selectedPatient,
      drug: selectedDrug,
      dosage: dosageResult,
    })

    alert("Prescription generated successfully!")
  }

  const getStepStatus = (step: number) => {
    if (step < currentStep) return "completed"
    if (step === currentStep) return "current"
    return "upcoming"
  }

  const getStepIcon = (step: number) => {
    const status = getStepStatus(step)
    if (status === "completed") return <CheckCircle className="h-5 w-5 text-green-600" />
    if (status === "current") return <div className="w-5 h-5 bg-primary rounded-full" />
    return <div className="w-5 h-5 bg-muted rounded-full" />
  }

  const goToStep = (step: number) => {
    if (step <= currentStep) {
      setCurrentStep(step)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dosage Calculator</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Calculate safe pediatric dosages with real-time safety checks
            </p>
          </div>
          <Button variant="outline" onClick={resetCalculator} size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Calculator
          </Button>
        </div>

        {/* Progress Steps */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-2">
              <div
                className={`flex items-center gap-3 sm:gap-4 cursor-pointer ${currentStep >= 1 ? "hover:bg-muted/50 rounded-lg p-2 -m-2" : ""}`}
                onClick={() => goToStep(1)}
              >
                {getStepIcon(1)}
                <div className={currentStep >= 1 ? "text-foreground" : "text-muted-foreground"}>
                  <p className="font-semibold text-sm sm:text-base">Select Patient</p>
                  <p className="text-xs sm:text-sm">Choose patient from database</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground hidden sm:block" />
              <div
                className={`flex items-center gap-3 sm:gap-4 cursor-pointer ${currentStep >= 2 ? "hover:bg-muted/50 rounded-lg p-2 -m-2" : ""}`}
                onClick={() => goToStep(2)}
              >
                {getStepIcon(2)}
                <div className={currentStep >= 2 ? "text-foreground" : "text-muted-foreground"}>
                  <p className="font-semibold text-sm sm:text-base">Choose Drug</p>
                  <p className="text-xs sm:text-sm">Select medication to prescribe</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground hidden sm:block" />
              <div
                className={`flex items-center gap-3 sm:gap-4 cursor-pointer ${currentStep >= 3 ? "hover:bg-muted/50 rounded-lg p-2 -m-2" : ""}`}
                onClick={() => goToStep(3)}
              >
                {getStepIcon(3)}
                <div className={currentStep >= 3 ? "text-foreground" : "text-muted-foreground"}>
                  <p className="font-semibold text-sm sm:text-base">Calculate Dosage</p>
                  <p className="text-xs sm:text-sm">System calculates safe dose</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground hidden sm:block" />
              <div className="flex items-center gap-3 sm:gap-4">
                {getStepIcon(4)}
                <div className={currentStep >= 4 ? "text-foreground" : "text-muted-foreground"}>
                  <p className="font-semibold text-sm sm:text-base">Review & Confirm</p>
                  <p className="text-xs sm:text-sm">Generate prescription</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Patient Selection */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <User className="h-5 w-5" />
                Step 1: Select Patient
              </CardTitle>
              <CardDescription className="text-sm">
                Choose a patient from the database or add a new patient
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <PatientSearch
                onPatientSelect={(patient) => {
                  setSelectedPatient(patient)
                  setCurrentStep(2)
                }}
                placeholder="Search for patient..."
              />
              <div className="text-center">
                <p className="text-xs sm:text-sm text-muted-foreground mb-2">Patient not in database?</p>
                <Link href="/patients/add">
                  <Button variant="outline" size="sm">Add New Patient</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Drug Selection */}
        {currentStep === 2 && selectedPatient && (
          <div className="space-y-4">
            {/* Patient Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm sm:text-base">Selected Patient</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm sm:text-base">{selectedPatient.name}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {selectedPatient.age} years • {selectedPatient.weight} kg • {selectedPatient.gender}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => goToStep(1)}>
                    Change Patient
                  </Button>
                </div>
                {selectedPatient.allergies.length > 0 && !selectedPatient.allergies.includes("None") && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-950 dark:border-yellow-800">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="text-xs sm:text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Known Allergies:
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedPatient.allergies.map((allergy) => (
                        <Badge key={allergy} variant="destructive" className="text-xs">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Drug Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Pill className="h-5 w-5" />
                  Step 2: Choose Drug
                </CardTitle>
                <CardDescription className="text-sm">Select the medication to prescribe</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <DrugSearch
                  onDrugSelect={(drug) => {
                    setSelectedDrug(drug)
                    setCurrentStep(3)
                  }}
                  placeholder="Search for drug..."
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Route Selection & Calculation */}
        {currentStep === 3 && selectedPatient && selectedDrug && (
          <div className="space-y-4">
            {/* Patient & Drug Summary */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm sm:text-base">Patient</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="font-semibold text-sm sm:text-base">{selectedPatient.name}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {selectedPatient.age} years • {selectedPatient.weight} kg
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => goToStep(1)}>
                      Change
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm sm:text-base">Drug</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="font-semibold text-sm sm:text-base">{selectedDrug.name}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">{selectedDrug.category}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => goToStep(2)}>
                      Change
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Route Selection & Calculate */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Calculator className="h-5 w-5" />
                  Step 3: Calculate Dosage
                </CardTitle>
                <CardDescription className="text-sm">
                  Select administration route and calculate safe dosage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="route" className="text-sm">Administration Route</Label>
                  <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select route" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedDrug?.dosageGuidelines?.routes?.map((route) => (
                        <SelectItem key={route} value={route}>
                          {route}
                        </SelectItem>
                      )) || (
                        <SelectItem value="oral" disabled>
                          No routes available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={calculateDosage} disabled={!selectedRoute || isCalculating} className="w-full">
                  {isCalculating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Calculator className="h-4 w-4 mr-2" />
                      Calculate Safe Dosage
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4: Results & Confirmation */}
        {currentStep === 4 && selectedPatient && selectedDrug && dosageResult && (
          <div className="space-y-4">
            {/* Safety Alert */}
            <MedicalAlert
              type={dosageResult.safetyLevel}
              title={
                dosageResult.safetyLevel === "safe"
                  ? "Dosage Calculation Complete"
                  : dosageResult.safetyLevel === "caution"
                    ? "Caution Required"
                    : "Unsafe Dosage Detected"
              }
            >
              {dosageResult.safetyLevel === "safe" && "Calculated dosage is within safe parameters."}
              {dosageResult.safetyLevel === "caution" && "Please review warnings before prescribing."}
              {dosageResult.safetyLevel === "danger" && "Do not prescribe - unsafe conditions detected."}
            </MedicalAlert>

            {/* Dosage Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Calculator className="h-5 w-5" />
                  Dosage Calculation Results
                </CardTitle>
                <CardDescription className="text-sm">
                  Calculated for {selectedPatient.name} - {selectedDrug.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm sm:text-base">
                        <Weight className="h-4 w-4" />
                        Weight-Based Calculation
                      </h4>
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-xl sm:text-2xl font-bold text-primary">{dosageResult.weightBased} mg</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Based on {selectedPatient.weight} kg body weight
                        </p>
                      </div>
                    </div>

                    {dosageResult.bsaBased && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm sm:text-base">
                          <Ruler className="h-4 w-4" />
                          BSA-Based Calculation
                        </h4>
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-xl sm:text-2xl font-bold text-secondary">{dosageResult.bsaBased} mg</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">Based on body surface area</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">Recommended Dose</h4>
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-950 dark:border-green-800">
                        <p className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-300">
                          {dosageResult.recommendedDose} mg
                        </p>
                        <p className="text-xs sm:text-sm text-green-600 dark:text-green-400">
                          {dosageResult.route} • {dosageResult.frequency}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">Maximum Daily Dose</h4>
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-950 dark:border-red-800">
                        <p className="text-base sm:text-lg font-bold text-red-700 dark:text-red-300">
                          {dosageResult.maxDaily} mg
                        </p>
                        <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">Do not exceed in 24 hours</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Warnings */}
                {dosageResult.warnings.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2 text-sm sm:text-base">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      Warnings & Precautions
                    </h4>
                    <ul className="space-y-1">
                      {dosageResult.warnings.map((warning, index) => (
                        <li key={index} className="flex items-start gap-2 text-xs sm:text-sm">
                          <AlertTriangle className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <Button variant="outline" onClick={() => setCurrentStep(3)} className="w-full sm:w-auto">
                    Recalculate
                  </Button>
                  <Button
                    onClick={generatePrescription}
                    disabled={dosageResult.safetyLevel === "danger"}
                    className="w-full sm:flex-1"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Prescription
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}