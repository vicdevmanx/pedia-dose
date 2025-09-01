"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MedicalAlert } from "@/components/medical-alert"
import { Calculator, Weight } from "lucide-react"

interface QuickCalculatorProps {
  className?: string
}

export function DosageCalculatorWidget({ className }: QuickCalculatorProps) {
  const [weight, setWeight] = useState("")
  const [dosePerKg, setDosePerKg] = useState("")
  const [result, setResult] = useState<{
    dose: number
    safetyLevel: "safe" | "caution" | "danger"
    warnings: string[]
  } | null>(null)

  const calculateQuickDose = () => {
    const weightNum = Number.parseFloat(weight)
    const doseNum = Number.parseFloat(dosePerKg)

    if (!weightNum || !doseNum) return

    const calculatedDose = weightNum * doseNum
    const warnings: string[] = []
    let safetyLevel: "safe" | "caution" | "danger" = "safe"

    // Basic safety checks
    if (calculatedDose > 1000) {
      warnings.push("High dose calculated - verify calculation")
      safetyLevel = "caution"
    }

    if (weightNum < 2.5) {
      warnings.push("Very low weight - neonatal dosing may differ")
      safetyLevel = "caution"
    }

    if (doseNum > 50) {
      warnings.push("High mg/kg dose - verify drug and indication")
      safetyLevel = "caution"
    }

    setResult({
      dose: Math.round(calculatedDose * 10) / 10,
      safetyLevel,
      warnings,
    })
  }

  const reset = () => {
    setWeight("")
    setDosePerKg("")
    setResult(null)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Quick Dose Calculator
        </CardTitle>
        <CardDescription>Simple weight-based dosage calculation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="weight">Patient Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              placeholder="0.0"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dosePerKg">Dose (mg/kg)</Label>
            <Input
              id="dosePerKg"
              type="number"
              step="0.1"
              placeholder="0.0"
              value={dosePerKg}
              onChange={(e) => setDosePerKg(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={calculateQuickDose} disabled={!weight || !dosePerKg} className="flex-1">
            <Calculator className="h-4 w-4 mr-2" />
            Calculate
          </Button>
          <Button variant="outline" onClick={reset}>
            Reset
          </Button>
        </div>

        {result && (
          <div className="space-y-3">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Weight className="h-4 w-4" />
                <span className="font-semibold">Calculated Dose</span>
              </div>
              <p className="text-2xl font-bold text-primary">{result.dose} mg</p>
            </div>

            {result.warnings.length > 0 && (
              <MedicalAlert type={result.safetyLevel}>
                <ul className="space-y-1">
                  {result.warnings.map((warning, index) => (
                    <li key={index} className="text-sm">
                      • {warning}
                    </li>
                  ))}
                </ul>
              </MedicalAlert>
            )}

            <div className="text-xs text-muted-foreground">
              <p>
                ⚠️ This is a basic calculation tool. Always verify with drug database and consider patient-specific
                factors.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
