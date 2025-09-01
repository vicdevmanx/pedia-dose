import type React from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface MedicalAlertProps {
  type: "safe" | "caution" | "danger"
  title?: string
  children: React.ReactNode
  className?: string
}

export function MedicalAlert({ type, title, children, className }: MedicalAlertProps) {
  const alertConfig = {
    safe: {
      icon: CheckCircle,
      className:
        "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200",
      iconClassName: "text-green-600 dark:text-green-400",
    },
    caution: {
      icon: AlertTriangle,
      className:
        "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
      iconClassName: "text-yellow-600 dark:text-yellow-400",
    },
    danger: {
      icon: XCircle,
      className: "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200",
      iconClassName: "text-red-600 dark:text-red-400",
    },
  }

  const config = alertConfig[type]
  const Icon = config.icon

  return (
    <Alert className={cn(config.className, className)}>
      <Icon className={cn("h-4 w-4", config.iconClassName)} />
      <AlertDescription>
        {title && <div className="font-semibold mb-1">{title}</div>}
        {children}
      </AlertDescription>
    </Alert>
  )
}
