"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Bell, Palette, Save } from "lucide-react"
import { useAlerts } from "@/components/alerts/alert-system"

interface UserSettings {
  fullName: string
  email: string
  role: string
  notifications: {
    safetyAlerts: boolean
    prescriptionUpdates: boolean
    systemMaintenance: boolean
  }
  preferences: {
    theme: string
    language: string
    timezone: string
  }
}

export default function SettingsPage() {
  const { addAlert } = useAlerts()
  const [settings, setSettings] = useState<UserSettings>({
    fullName: "",
    email: "",
    role: "",
    notifications: {
      safetyAlerts: true,
      prescriptionUpdates: true,
      systemMaintenance: false,
    },
    preferences: {
      theme: "system",
      language: "en",
      timezone: "UTC",
    },
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      setSettings((prev) => ({
        ...prev,
        fullName: user.fullName || "",
        email: user.email || "",
        role: user.role || "",
      }))
    }
  }, [])

  const handleSave = async () => {
    setIsLoading(true)
    setError("")

    try {
      // Simulate saving settings
      setTimeout(() => {
        const userData = localStorage.getItem("user")
        if (userData) {
          const user = JSON.parse(userData)
          const updatedUser = { ...user, fullName: settings.fullName }
          localStorage.setItem("user", JSON.stringify(updatedUser))
        }

        addAlert({
          type: "safe",
          title: "Settings Saved",
          message: "Your preferences have been updated successfully",
          priority: "low",
        })

        setIsLoading(false)
      }, 1000)
    } catch (err) {
      setError("Failed to save settings")
      setIsLoading(false)
    }
  }

  const updateNotification = (key: keyof typeof settings.notifications, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }))
  }

  const updatePreference = (key: keyof typeof settings.preferences, value: string) => {
    setSettings((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: value },
    }))
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and system settings</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={settings.fullName}
                    onChange={(e) => setSettings((prev) => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={settings.email} disabled className="bg-muted" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={settings.role.charAt(0).toUpperCase() + settings.role.slice(1)}
                  disabled
                  className="bg-muted"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose which notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Safety Alerts</Label>
                  <p className="text-sm text-muted-foreground">Critical safety warnings and drug alerts</p>
                </div>
                <Switch
                  checked={settings.notifications.safetyAlerts}
                  onCheckedChange={(checked) => updateNotification("safetyAlerts", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Prescription Updates</Label>
                  <p className="text-sm text-muted-foreground">Updates on prescription status changes</p>
                </div>
                <Switch
                  checked={settings.notifications.prescriptionUpdates}
                  onCheckedChange={(checked) => updateNotification("prescriptionUpdates", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>System Maintenance</Label>
                  <p className="text-sm text-muted-foreground">Scheduled maintenance and system updates</p>
                </div>
                <Switch
                  checked={settings.notifications.systemMaintenance}
                  onCheckedChange={(checked) => updateNotification("systemMaintenance", checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance & Preferences
              </CardTitle>
              <CardDescription>Customize your interface preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={settings.preferences.theme}
                    onValueChange={(value) => updatePreference("theme", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={settings.preferences.language}
                    onValueChange={(value) => updatePreference("language", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
