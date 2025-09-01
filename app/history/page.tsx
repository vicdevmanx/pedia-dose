import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, User, AlertTriangle, FileText, TrendingUp } from "lucide-react"

// Mock data for patient history
const patientHistory = [
  {
    id: 1,
    patientName: "Emma Johnson",
    patientId: "P001",
    age: 8,
    weight: 25,
    date: "2024-01-15",
    time: "14:30",
    drug: "Amoxicillin",
    dosage: "250mg",
    route: "Oral",
    frequency: "TID",
    prescriber: "Dr. Smith",
    status: "Completed",
    sideEffects: "None reported",
    notes: "Patient tolerated well",
  },
  {
    id: 2,
    patientName: "Michael Chen",
    patientId: "P002",
    age: 12,
    weight: 40,
    date: "2024-01-15",
    time: "16:45",
    drug: "Ibuprofen",
    dosage: "200mg",
    route: "Oral",
    frequency: "QID",
    prescriber: "Dr. Johnson",
    status: "In Progress",
    sideEffects: "Mild nausea",
    notes: "Monitor for GI symptoms",
  },
]

const auditTrail = [
  {
    id: 1,
    timestamp: "2024-01-15 14:30:22",
    user: "Dr. Smith",
    role: "Doctor",
    action: "Created prescription",
    details: "Amoxicillin 250mg TID for Emma Johnson",
    patientId: "P001",
  },
  {
    id: 2,
    timestamp: "2024-01-15 14:35:15",
    user: "Pharmacist Jones",
    role: "Pharmacist",
    action: "Dispensed medication",
    details: "Verified and dispensed Amoxicillin 250mg",
    patientId: "P001",
  },
  {
    id: 3,
    timestamp: "2024-01-15 15:00:10",
    user: "Nurse Wilson",
    role: "Nurse",
    action: "Administered medication",
    details: "First dose administered, no adverse reactions",
    patientId: "P001",
  },
]

export default function HistoryPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-medical-primary">Patient History & Monitoring</h1>
          <p className="text-muted-foreground">Comprehensive medication history and audit trails</p>
        </div>
        <Button className="bg-medical-primary hover:bg-medical-primary/90">
          <FileText className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      <Tabs defaultValue="history" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="history">Patient History</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Medication History
              </CardTitle>
              <CardDescription>Complete record of all prescriptions and administrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <Input placeholder="Search by patient name or ID..." className="flex-1" />
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="discontinued">Discontinued</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {patientHistory.map((record) => (
                  <Card key={record.id} className="border-l-4 border-l-medical-primary">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{record.patientName}</h3>
                            <Badge variant="outline">{record.patientId}</Badge>
                            <Badge variant={record.status === "Completed" ? "default" : "secondary"}>
                              {record.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Drug:</span>
                              <p className="font-medium">{record.drug}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Dosage:</span>
                              <p className="font-medium">
                                {record.dosage} {record.frequency}
                              </p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Route:</span>
                              <p className="font-medium">{record.route}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Prescriber:</span>
                              <p className="font-medium">{record.prescriber}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {record.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {record.time}
                            </div>
                          </div>
                          {record.sideEffects !== "None reported" && (
                            <div className="flex items-center gap-2 text-sm">
                              <AlertTriangle className="w-4 h-4 text-medical-warning" />
                              <span className="text-medical-warning">Side Effects: {record.sideEffects}</span>
                            </div>
                          )}
                          {record.notes && <p className="text-sm text-muted-foreground">Notes: {record.notes}</p>}
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Audit Trail
              </CardTitle>
              <CardDescription>Complete log of all system actions and user activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditTrail.map((entry) => (
                  <Card key={entry.id} className="border-l-4 border-l-medical-accent">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{entry.role}</Badge>
                            <span className="font-medium">{entry.user}</span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{entry.timestamp}</span>
                          </div>
                          <p className="font-medium">{entry.action}</p>
                          <p className="text-sm text-muted-foreground">{entry.details}</p>
                          <Badge variant="secondary">Patient: {entry.patientId}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Safety Reports</CardTitle>
                <CardDescription>Generate comprehensive safety analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full bg-transparent" variant="outline">
                    Adverse Events Report
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline">
                    Dosage Safety Analysis
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline">
                    Drug Interaction Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Usage Reports</CardTitle>
                <CardDescription>Track medication usage patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full bg-transparent" variant="outline">
                    Prescription Volume
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline">
                    Drug Utilization
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline">
                    Provider Activity
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Compliance Reports</CardTitle>
                <CardDescription>Monitor adherence and compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full bg-transparent" variant="outline">
                    Administration Compliance
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline">
                    Missed Doses Report
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline">
                    Protocol Adherence
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Prescriptions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-medical-success">+12%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Adverse Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-medical-warning">+3</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Safety Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-medical-danger">+2</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.2%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-medical-success">+1.2%</span> from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Prescription Trends
              </CardTitle>
              <CardDescription>Most prescribed medications and trending patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Amoxicillin</p>
                    <p className="text-sm text-muted-foreground">Antibiotic</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">342 prescriptions</p>
                    <p className="text-sm text-medical-success">+15% this month</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Ibuprofen</p>
                    <p className="text-sm text-muted-foreground">NSAID</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">298 prescriptions</p>
                    <p className="text-sm text-medical-success">+8% this month</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Acetaminophen</p>
                    <p className="text-sm text-muted-foreground">Analgesic</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">256 prescriptions</p>
                    <p className="text-sm text-muted-foreground">-2% this month</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
