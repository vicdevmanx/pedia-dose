"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, XCircle, Bell } from "lucide-react"
import { cn } from "@/lib/utils"

interface Alert {
  id: string
  type: "safe" | "caution" | "danger"
  title: string
  message: string
  timestamp: Date
  read: boolean
  priority: "low" | "medium" | "high"
}

interface AlertContextType {
  alerts: Alert[]
  addAlert: (alert: Omit<Alert, "id" | "timestamp" | "read">) => void
  markAsRead: (id: string) => void
  clearAlert: (id: string) => void
  unreadCount: number
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [activeModal, setActiveModal] = useState<Alert | null>(null)

  const addAlert = useCallback((alertData: Omit<Alert, "id" | "timestamp" | "read">) => {
    const newAlert: Alert = {
      ...alertData,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
    }

    setAlerts((prev) => [newAlert, ...prev])

    if (alertData.type === "danger" || alertData.priority === "high") {
      setActiveModal(newAlert)
    }
  }, [])

  const markAsRead = useCallback((id: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, read: true } : alert)))
  }, [])

  const clearAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }, [])

  const unreadCount = alerts.filter((alert) => !alert.read).length

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "safe":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "caution":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "danger":
        return <XCircle className="h-5 w-5 text-red-600" />
    }
  }

  const getAlertColors = (type: Alert["type"]) => {
    switch (type) {
      case "safe":
        return "border-green-200 bg-green-50 text-green-800"
      case "caution":
        return "border-yellow-200 bg-yellow-50 text-yellow-800"
      case "danger":
        return "border-red-200 bg-red-50 text-red-800"
    }
  }

  return (
    <AlertContext.Provider value={{ alerts, addAlert, markAsRead, clearAlert, unreadCount }}>
      {children}

      <Dialog open={!!activeModal} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className={cn("max-w-md", activeModal && getAlertColors(activeModal.type))}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {activeModal && getAlertIcon(activeModal.type)}
              {activeModal?.title}
            </DialogTitle>
            <DialogDescription className="text-current">{activeModal?.message}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                if (activeModal) markAsRead(activeModal.id)
                setActiveModal(null)
              }}
            >
              Acknowledge
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AlertContext.Provider>
  )
}

export function useAlerts() {
  const context = useContext(AlertContext)
  if (!context) {
    throw new Error("useAlerts must be used within AlertProvider")
  }
  return context
}

export function AlertBell() {
  const { unreadCount } = useAlerts()

  return (
    <div className="relative">
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500">
          {unreadCount > 9 ? "9+" : unreadCount}
        </Badge>
      )}
    </div>
  )
}
