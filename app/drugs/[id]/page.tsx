"use client"

import { useState, useEffect } from "react"
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

export default function DrugDetailPage() {
  const params = useParams()
  const drugId = params.id as string
  const [drug, setDrug] = useState<Drug | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDrug = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/drugs/${drugId}`)
      if (!response.ok) throw new Error('Drug not found')
      const data = await response.json()
      // Ensure sideEffects is an object with common, serious, rare arrays
      const sideEffects = data.sideEffects && typeof data.sideEffects === 'object' && 'common' in data.sideEffects
        ? data.sideEffects
        : { common: [], serious: [], rare: [] }
      setDrug({
        ...data,
        sideEffects,
        brandNames: data.brandNames || [],
        warnings: data.warnings || [],
        contraindications: data.contraindications || [],
        interactions: data.interactions || [],
        monitoring: data.monitoring || [],
      })
    } catch (err) {
      setError('Error fetching drug details')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (drugId) {
      fetchDrug()
    }
  }, [drugId])

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Loading...</h2>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !drug) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Drug Not Found</h2>
          <p className="text-muted-foreground mb-4">{error || "The requested drug information is not available."}</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={fetchDrug} variant="outline">
              Retry
            </Button>
            <Link href="/drugs">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Drug Database
              </Button>
            </Link>
          </div>
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
        <div className="flex flex-col justify-between">
          <div className="flex flex-col gap-4">
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
                Generic: {drug.genericName} • Age Range: {drug.ageRange || "N/A"}
              </p>
            </div>
          </div>
          {/* <Link href={`/dosage-calculator?drugId=${drug.id}`}>
            <Button>
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Dosage
            </Button>
          </Link> */}
        </div>

        {/* Drug Overview Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dosage Forms</CardTitle>
              <Pill className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">{drug.dosageForm || "N/A"}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concentration</CardTitle>
              <Info className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">{drug.concentration || "N/A"}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Routes</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">{drug.dosageGuidelines.routes.join(", ") || "N/A"}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Frequency</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">{drug.dosageGuidelines.frequency || "N/A"}</div>
            </CardContent>
          </Card>
        </div>

        {/* Safety Alerts */}
        {drug.warnings.length > 0 && (
          <MedicalAlert type="caution" title="Important Safety Information">
            <ul className="list-disc list-inside space-y-1">
              {drug.warnings.map((warning: string, index: number) => (
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
                        <p className="text-lg font-semibold text-primary">{drug.dosageGuidelines.mgPerKg || "N/A"}</p>
                        <p className="text-sm text-muted-foreground">Milligrams per kilogram of body weight</p>
                      </div>
                    </div>

                    {drug.dosageGuidelines.mgPerM2 && drug.dosageGuidelines.mgPerM2 !== "Not typically calculated by BSA" && (
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
                          {drug.dosageGuidelines.maxDaily || "N/A"}
                        </p>
                        <p className="text-sm text-red-600 dark:text-red-400">Do not exceed this amount in 24 hours</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Administration Routes</h4>
                      <div className="flex flex-wrap gap-2">
                        {drug.dosageGuidelines.routes.map((route: string) => (
                          <Badge key={route} variant="secondary">
                            {route}
                          </Badge>
                        ))}
                        {drug.dosageGuidelines.routes.length === 0 && (
                          <p className="text-sm text-muted-foreground">No routes specified</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Frequency</h4>
                      <p className="text-sm">{drug.dosageGuidelines.frequency || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {drug.mechanism && (
                  <div>
                    <h4 className="font-semibold mb-2">Mechanism of Action</h4>
                    <p className="text-sm text-muted-foreground">{drug.mechanism}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold mb-2">Indication</h4>
                  <p className="text-sm">{drug.indication || "N/A"}</p>
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
                    {drug.contraindications.map((contraindication: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{contraindication}</span>
                      </li>
                    ))}
                    {drug.contraindications.length === 0 && (
                      <p className="text-sm text-muted-foreground">No contraindications specified</p>
                    )}
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
                    {drug.warnings.map((warning: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{warning}</span>
                      </li>
                    ))}
                    {drug.warnings.length === 0 && (
                      <p className="text-sm text-muted-foreground">No warnings specified</p>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {drug.storage && (
              <Card>
                <CardHeader>
                  <CardTitle>Storage & Handling</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{drug.storage}</p>
                </CardContent>
              </Card>
            )}
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
                  {drug.interactions.map((interaction: string, index: number) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <p className="text-sm">{interaction}</p>
                    </div>
                  ))}
                  {drug.interactions.length === 0 && (
                    <p className="text-sm text-muted-foreground">No interactions specified</p>
                  )}
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
                    {(drug.sideEffects?.common || []).map((effect: string, index: number) => (
                      <li key={index} className="text-sm">
                        • {effect}
                      </li>
                    ))}
                    {(!drug.sideEffects?.common || drug.sideEffects.common.length === 0) && (
                      <p className="text-sm text-muted-foreground">No common side effects specified</p>
                    )}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-red-600">Serious Side Effects</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {(drug.sideEffects?.serious || []).map((effect: string, index: number) => (
                      <li key={index} className="text-sm">
                        • {effect}
                      </li>
                    ))}
                    {(!drug.sideEffects?.serious || drug.sideEffects.serious.length === 0) && (
                      <p className="text-sm text-muted-foreground">No serious side effects specified</p>
                    )}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-yellow-600">Rare Side Effects</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {(drug.sideEffects?.rare || []).map((effect: string, index: number) => (
                      <li key={index} className="text-sm">
                        • {effect}
                      </li>
                    ))}
                    {(!drug.sideEffects?.rare || drug.sideEffects.rare.length === 0) && (
                      <p className="text-sm text-muted-foreground">No rare side effects specified</p>
                    )}
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
                  {drug.monitoring.map((parameter: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm">{parameter}</span>
                    </li>
                  ))}
                  {drug.monitoring.length === 0 && (
                    <p className="text-sm text-muted-foreground">No monitoring parameters specified</p>
                  )}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}