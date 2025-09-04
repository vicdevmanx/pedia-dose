"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  User,
  Pill,
  CheckCircle,
  AlertTriangle,
  Search,
} from "lucide-react";
import { useAlerts } from "@/components/alerts/alert-system";

interface MedicationSchedule {
  id: number;
  patient: string;
  age: number;
  medication: string;
  dose: string;
  route: string;
  time: string;
  status: "pending" | "completed" | "overdue" | "missed";
  prescribedBy: string;
  notes?: string;
}

export default function MedicationSchedulePage() {
  const { addAlert } = useAlerts();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMed, setSelectedMed] = useState<MedicationSchedule | null>(
    null
  );
  const [administrationNotes, setAdministrationNotes] = useState("");
  const [sideEffects, setSideEffects] = useState("");

  const [medications, setMedications] = useState<MedicationSchedule[]>([
    {
      id: 1,
      patient: "Emma Johnson",
      age: 8,
      medication: "Acetaminophen 160mg",
      dose: "160mg",
      route: "Oral",
      time: "09:00 AM",
      status: "pending",
      prescribedBy: "Dr. Smith",
    },
    {
      id: 2,
      patient: "Michael Chen",
      age: 5,
      medication: "Amoxicillin 250mg",
      dose: "250mg",
      route: "Oral",
      time: "09:30 AM",
      status: "completed",
      prescribedBy: "Dr. Johnson",
    },
    {
      id: 3,
      patient: "Sarah Williams",
      age: 12,
      medication: "Ibuprofen 200mg",
      dose: "200mg",
      route: "Oral",
      time: "10:00 AM",
      status: "pending",
      prescribedBy: "Dr. Brown",
    },
    {
      id: 4,
      patient: "David Brown",
      age: 6,
      medication: "Ceftriaxone 500mg",
      dose: "500mg",
      route: "IV",
      time: "10:30 AM",
      status: "overdue",
      prescribedBy: "Dr. Davis",
    },
  ]);

  const filteredMedications = medications.filter(
    (med) =>
      med.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.medication.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "missed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "overdue":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const handleAdminister = (med: MedicationSchedule) => {
    setMedications((prev) =>
      prev.map((m) =>
        m.id === med.id
          ? { ...m, status: "completed" as const, notes: administrationNotes }
          : m
      )
    );

    addAlert({
      type: "safe",
      title: "Medication Administered",
      message: `${med.medication} administered to ${med.patient}`,
      priority: "medium",
    });

    if (sideEffects.trim()) {
      addAlert({
        type: "caution",
        title: "Side Effects Reported",
        message: `${med.patient}: ${sideEffects}`,
        priority: "high",
      });
    }

    setSelectedMed(null);
    setAdministrationNotes("");
    setSideEffects("");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Medication Schedule
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage patient medication schedules and administration
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Today's Schedule
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {medications.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                {medications.filter((m) => m.status === "completed").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-yellow-600">
                {medications.filter((m) => m.status === "pending").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-red-600">
                {medications.filter((m) => m.status === "overdue").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Medication Schedule */}
        <Card className="p-0 border-0 outline-0 shadow-none">
          <CardHeader className="p-0 border-0 outline-0 shadow-none">
            <CardTitle className="text-xl sm:text-xl">
              Medication Schedule
            </CardTitle>
            <CardDescription className="text-sm">
              View and manage patient medication administrations
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 border-0 outline-0 shadow-none">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient name or medication..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full max-w-md"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredMedications.map((med) => (
                <div
                  key={med.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-lg"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div>
                      {" "}
                      <div className="flex items-center gap-2 mb-4">
                        {getStatusIcon(med.status)}
                        <span className="font-medium text-sm">{med.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />

                        <span className="font-semibold text-sm sm:text-base">
                          {med.patient}
                        </span>
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          ({med.age}y)
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Pill className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs sm:text-sm">
                          {med.medication}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {med.route}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Prescribed by {med.prescribedBy}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getStatusColor(med.status)} text-xs`}>
                      {med.status.charAt(0).toUpperCase() + med.status.slice(1)}
                    </Badge>
                    {(med.status === "pending" || med.status === "overdue") && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant={
                              med.status === "overdue"
                                ? "destructive"
                                : "default"
                            }
                            onClick={() => setSelectedMed(med)}
                          >
                            {med.status === "overdue" ? "Urgent" : "Administer"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[95vw] sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="text-lg sm:text-xl">
                              Administer Medication
                            </DialogTitle>
                            <DialogDescription className="text-sm">
                              Record administration for {med.patient}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="p-4 bg-muted rounded-lg">
                              <div className="font-semibold text-sm sm:text-base">
                                {med.medication}
                              </div>
                              <div className="text-xs sm:text-sm text-muted-foreground">
                                {med.dose} • {med.route} • {med.time}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Administration Notes
                              </label>
                              <Textarea
                                placeholder="Any notes about administration..."
                                value={administrationNotes}
                                onChange={(e) =>
                                  setAdministrationNotes(e.target.value)
                                }
                                className="min-h-[80px]"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Side Effects (if any)
                              </label>
                              <Textarea
                                placeholder="Report any observed side effects..."
                                value={sideEffects}
                                onChange={(e) => setSideEffects(e.target.value)}
                                className="min-h-[80px]"
                              />
                            </div>
                            <div className="flex flex-col sm:flex-row justify-end gap-2">
                              <Button
                                variant="outline"
                                onClick={() => setSelectedMed(null)}
                                className="w-full sm:w-auto"
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={() => handleAdminister(med)}
                                className="w-full sm:w-auto"
                              >
                                Confirm Administration
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
