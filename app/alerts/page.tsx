"use client"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, CheckCircle, XCircle, Clock, User, Pill } from "lucide-react"
import { useState, useEffect } from "react"
import { MedicalAlert } from "@/components/medical-alert"

interface Alert {
  id: string
  type: "safe" | "caution" | "danger"
  title: string
  message: string
  timestamp: Date
  read: boolean
  priority: "low" | "medium" | "high"
  category: "dosage" | "allergy" | "interaction" | "system"
  patientId?: string
  patientName?: string
}

const generateAlerts = (): Alert[] => [
  {
    id: "1",
    type: "danger",
    title: "Critical Drug Allergy Alert",
    message:
      "Patient Emma Johnson has a severe penicillin allergy. Prescription for Amoxicillin requires immediate review.",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
    priority: "high",
    category: "allergy",
    patientId: "1",
    patientName: "Emma Johnson",
  },
  {
    id: "2",
    type: "caution",
    title: "Dosage Verification Required",
    message: "Acetaminophen dosage for Michael Chen (40.2kg) is at upper limit. Consider monitoring.",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    read: false,
    priority: "medium",
    category: "dosage",
    patientId: "2",
    patientName: "Michael Chen",
  },
  {
    id: "3",
    type: "caution",
    title: "Drug Interaction Warning",
    message: "Potential interaction between prescribed Albuterol and new Propranolol prescription.",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: true,
    priority: "medium",
    category: "interaction",
  },
  {
    id: "4",
    type: "safe",
    title: "Prescription Verified",
    message: "All safety checks passed for Ibuprofen prescription for Sarah Williams.",
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    read: true,
    priority: "low",
    category: "dosage",
    patientId: "3",
    patientName: "Sarah Williams",
  },
  {
    id: "5",
    type: "danger",
    title: "System Alert",
    message: "Drug database update required. Some dosage calculations may be outdated.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    priority: "high",
    category: "system",
  },
]

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "unread" | "high">("all")

  useEffect(() => {
    const loadAlerts = () => {
      setLoading(true)
      setTimeout(() => {
        setAlerts(generateAlerts())
        setLoading(false)
      }, 500)
    }

    loadAlerts()

    const interval = setInterval(() => {
      setAlerts((prev) => {
        const updated = [...prev]
        if (Math.random() > 0.8) {
          const newAlert: Alert = {
            id: Date.now().toString(),
            type: Math.random() > 0.7 ? "danger" : Math.random() > 0.5 ? "caution" : "safe",
            title: "New Safety Alert",
            message: "A new safety alert has been generated.",
            timestamp: new Date(),
            read: false,
            priority: "medium",
            category: "system",
          }
          updated.unshift(newAlert)
        }
        return updated
      })
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const markAsRead = (id: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, read: true } : alert)))
  }

  const clearAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }

  const getFilteredAlerts = () => {
    switch (filter) {
      case "unread":
        return alerts.filter((alert) => !alert.read)
      case "high":
        return alerts.filter((alert) => alert.priority === "high")
      default:
        return alerts
    }
  }

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "safe":
        return <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
      case "caution":
        return <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
      case "danger":
        return <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
    }
  }

  const getAlertBadgeColor = (type: Alert["type"]) => {
    switch (type) {
      case "safe":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "caution":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "danger":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    }
  }

  const getCategoryIcon = (category: Alert["category"]) => {
    switch (category) {
      case "dosage":
        return <Pill className="h-4 w-4 flex-shrink-0" />
      case "allergy":
        return <AlertTriangle className="h-4 w-4 flex-shrink-0" />
      case "interaction":
        return <XCircle className="h-4 w-4 flex-shrink-0" />
      case "system":
        return <Clock className="h-4 w-4 flex-shrink-0" />
      default:
        return <AlertTriangle className="h-4 w-4 flex-shrink-0" />
    }
  }

  const filteredAlerts = getFilteredAlerts()
  const unreadCount = alerts.filter((alert) => !alert.read).length
  const highPriorityCount = alerts.filter((alert) => alert.priority === "high" && !alert.read).length

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-sm sm:text-base text-muted-foreground">Loading safety alerts...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col items-start gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Safety Alerts</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Monitor critical safety notifications and drug alerts</p>
          </div>
          <div className="flex gap-2">
            <Badge variant={unreadCount > 0 ? "destructive" : "secondary"} className="text-xs sm:text-sm">
              {unreadCount} Unread
            </Badge>
            {highPriorityCount > 0 && (
              <Badge variant="destructive" className="text-xs sm:text-sm">
                {highPriorityCount} High Priority
              </Badge>
            )}
          </div>
        </div>

        {/* Critical Alerts */}
        {highPriorityCount > 0 && (
          <MedicalAlert type="danger" title="Critical Alerts Require Attention">
            You have {highPriorityCount} high-priority safety alert{highPriorityCount !== 1 ? "s" : ""} that require
            immediate attention.
          </MedicalAlert>
        )}

        {/* Filter Tabs */}
        <Tabs value={filter} onValueChange={(value) => setFilter(value as typeof filter)} className="space-y-4">
          <TabsList className="flex overflow-x-auto whitespace-nowrap">
            <TabsTrigger value="all" className="flex-1 min-w-[100px] text-xs sm:text-sm">
              All Alerts ({alerts.length})
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex-1 min-w-[100px] text-xs sm:text-sm">
              Unread ({unreadCount})
            </TabsTrigger>
            <TabsTrigger value="high" className="flex-1 min-w-[100px] text-xs sm:text-sm">
              High Priority ({alerts.filter((a) => a.priority === "high").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="space-y-4">
            {filteredAlerts.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-8 sm:py-12">
                  <div className="text-center">
                    <CheckCircle className="h-8 w-8 sm:h-12 sm:w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-base sm:text-lg font-semibold mb-2">No Alerts</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      {filter === "all"
                        ? "No safety alerts at this time."
                        : filter === "unread"
                          ? "All alerts have been read."
                          : "No high priority alerts."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredAlerts.map((alert) => (
                  <Card key={alert.id} className={`${!alert.read ? "border-l-4 border-l-primary" : ""}`}>
                    <CardHeader className="pb-2 sm:pb-3">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                        <div className="flex items-start gap-2 sm:gap-3">
                          {getAlertIcon(alert.type)}
                          <div className="space-y-1 sm:space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <CardTitle className="text-sm sm:text-base">{alert.title}</CardTitle>
                              <Badge className={`${getAlertBadgeColor(alert.type)} text-xs sm:text-sm`}>
                                {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                              </Badge>
                              {!alert.read && (
                                <Badge variant="outline" className="text-xs">
                                  New
                                </Badge>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                {getCategoryIcon(alert.category)}
                                {alert.category.charAt(0).toUpperCase() + alert.category.slice(1)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {alert.timestamp.toLocaleTimeString()}
                              </div>
                              {alert.patientName && (
                                <div className="flex items-center gap-1">
                                  <User className="h-4 w-4" />
                                  {alert.patientName}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {!alert.read && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => markAsRead(alert.id)}
                              className="min-w-[80px] h-8 text-xs sm:text-sm"
                            >
                              Mark Read
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => clearAlert(alert.id)}
                            className="min-w-[80px] h-8 text-xs sm:text-sm"
                          >
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs sm:text-sm">{alert.message}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}