"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MedicalAlert } from "@/components/medical-alert"
import {
  Pill,
  ArrowLeft,
  AlertTriangle,
  Calculator,
  Shield,
  Zap,
  Info,
  Clock,
  Weight,
  Ruler,
  Activity,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

// Mock detailed drug data
const mockDrugDetails = {
  1: {
    id: 1,
    name: "Acetaminophen",
    genericName: "Acetaminophen",
    brandNames: ["Tylenol", "Panadol", "FeverAll"],
    category: "Analgesics",
    dosageForm: "Oral Suspension, Chewable Tablets, Suppositories",
    concentration: "160mg/5ml, 80mg/ml, 80mg chewable",
    indication: "Pain relief, fever reduction",
    ageRange: "0-18 years",
    mechanism: "Inhibits cyclooxygenase enzymes and blocks pain pathways in the central nervous system",
    dosageGuidelines: {
      mgPerKg: "10-15 mg/kg every 4-6 hours",
      mgPerM2: "Not typically calculated by BSA",
      maxDaily: "75 mg/kg/day (maximum 4000mg/day)",
      routes: ["Oral", "Rectal"],
      frequency: "Every 4-6 hours as needed",
    },
    contraindications: [
      "Severe hepatic impairment",
      "Known hypersensitivity to acetaminophen",
      "Chronic alcohol use (relative contraindication)",
    ],
    warnings: [
      "Hepatotoxicity risk with overdose",
      "Maximum daily dose limits must be observed",
      "Monitor cumulative dose from all sources",
      "Use caution in patients with hepatic impairment",
    ],
    interactions: [
      "Warfarin - may enhance anticoagulant effect",
      "Alcohol - increased risk of hepatotoxicity",
      "Phenytoin - may increase acetaminophen toxicity",
    ],
    sideEffects: {
      common: ["Nausea", "Vomiting", "Constipation"],
      serious: ["Hepatotoxicity", "Severe skin reactions", "Acute renal failure"],
      rare: ["Thrombocytopenia", "Neutropenia", "Pancytopenia"],
    },
    monitoring: [
      "Liver function tests if prolonged use",
      "Signs of hepatotoxicity",
      "Pain and fever response",
      "Cumulative daily dose",
    ],
    storage: "Store at room temperature, protect from moisture",
    status: "active",
  },
}

export default function DrugDetailPage() {
  const params = useParams()
  const drugId = Number.parseInt(params.id as string)

  // In a real app, you'd fetch drug data based on the ID
  const drug = mockDrugDetails[drugId as keyof typeof mockDrugDetails]

  if (!drug) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Drug Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested drug information is not available.</p>
          <Link href="/drugs">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Drug Database
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    )
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/drugs">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Database
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold tracking-tight">{drug.name}</h1>
                <Badge className={getCategoryColor(drug.category)}>{drug.category}</Badge>
              </div>
              <p className="text-muted-foreground">
                Generic: {drug.genericName} • Age Range: {drug.ageRange}
              </p>
            </div>
          </div>
          <Link href={`/dosage-calculator?drugId=${drug.id}`}>
            <Button>
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Dosage
            </Button>
          </Link>
        </div>

        {/* Drug Overview Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dosage Forms</CardTitle>
              <Pill className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">{drug.dosageForm}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concentration</CardTitle>
              <Info className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">{drug.concentration}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Routes</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">{drug.dosageGuidelines.routes.join(", ")}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Frequency</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">{drug.dosageGuidelines.frequency}</div>
            </CardContent>
          </Card>
        </div>

        {/* Safety Alerts */}
        {drug.warnings.length > 0 && (
          <MedicalAlert type="caution" title="Important Safety Information">
            <ul className="list-disc list-inside space-y-1">
              {drug.warnings.map((warning, index) => (
                <li key={index} className="text-sm">
                  {warning}
                </li>
              ))}
            </ul>
          </MedicalAlert>
        )}

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="dosage" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dosage">Dosage</TabsTrigger>
            <TabsTrigger value="safety">Safety</TabsTrigger>
            <TabsTrigger value="interactions">Interactions</TabsTrigger>
            <TabsTrigger value="effects">Side Effects</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="dosage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Weight className="h-5 w-5" />
                  Dosage Guidelines
                </CardTitle>
                <CardDescription>Pediatric dosing recommendations and calculations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Weight className="h-4 w-4" />
                        Weight-Based Dosing
                      </h4>
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-lg font-semibold text-primary">{drug.dosageGuidelines.mgPerKg}</p>
                        <p className="text-sm text-muted-foreground">Milligrams per kilogram of body weight</p>
                      </div>
                    </div>

                    {drug.dosageGuidelines.mgPerM2 !== "Not typically calculated by BSA" && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Ruler className="h-4 w-4" />
                          BSA-Based Dosing
                        </h4>
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-lg font-semibold text-primary">{drug.dosageGuidelines.mgPerM2}</p>
                          <p className="text-sm text-muted-foreground">
                            Milligrams per square meter of body surface area
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Maximum Daily Dose</h4>
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-950 dark:border-red-800">
                        <p className="text-lg font-semibold text-red-700 dark:text-red-300">
                          {drug.dosageGuidelines.maxDaily}
                        </p>
                        <p className="text-sm text-red-600 dark:text-red-400">Do not exceed this amount in 24 hours</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Administration Routes</h4>
                      <div className="flex flex-wrap gap-2">
                        {drug.dosageGuidelines.routes.map((route) => (
                          <Badge key={route} variant="secondary">
                            {route}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Frequency</h4>
                      <p className="text-sm">{drug.dosageGuidelines.frequency}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Mechanism of Action</h4>
                  <p className="text-sm text-muted-foreground">{drug.mechanism}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Indication</h4>
                  <p className="text-sm">{drug.indication}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="safety" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <Shield className="h-5 w-5" />
                    Contraindications
                  </CardTitle>
                  <CardDescription>Conditions where this drug should not be used</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {drug.contraindications.map((contraindication, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{contraindication}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-600">
                    <AlertTriangle className="h-5 w-5" />
                    Warnings & Precautions
                  </CardTitle>
                  <CardDescription>Important safety considerations</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {drug.warnings.map((warning, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{warning}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Storage & Handling</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{drug.storage}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Drug Interactions
                </CardTitle>
                <CardDescription>Known interactions with other medications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {drug.interactions.map((interaction, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <p className="text-sm">{interaction}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="effects" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-blue-600">Common Side Effects</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {drug.sideEffects.common.map((effect, index) => (
                      <li key={index} className="text-sm">
                        • {effect}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-red-600">Serious Side Effects</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {drug.sideEffects.serious.map((effect, index) => (
                      <li key={index} className="text-sm">
                        • {effect}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-yellow-600">Rare Side Effects</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {drug.sideEffects.rare.map((effect, index) => (
                      <li key={index} className="text-sm">
                        • {effect}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Monitoring Parameters
                </CardTitle>
                <CardDescription>What to monitor when using this medication</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {drug.monitoring.map((parameter, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm">{parameter}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
