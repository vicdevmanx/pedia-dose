"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DrugModal } from "@/components/modals/drug-modal"
import { Search, Pill, AlertTriangle, Eye, Filter, Plus, Edit } from "lucide-react"
import Link from "next/link"

const drugCategories = [
  "All Categories",
  "Analgesics",
  "Antibiotics",
  "NSAIDs",
  "Bronchodilators",
  "Antiemetics",
  "Antihistamines",
  "Corticosteroids",
]

export default function DrugsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedDrug, setSelectedDrug] = useState<any>(null)
  const [drugs, setDrugs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch drugs on mount and when filters change
  useEffect(() => {
    const fetchDrugs = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.set('search', searchTerm);
        if (selectedCategory !== 'All Categories') params.set('category', selectedCategory);

        const response = await fetch(`/api/drugs?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch drugs');
        const data = await response.json();
        setDrugs(data);
      } catch (err) {
        setError('Error fetching drugs');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDrugs();
  }, [searchTerm, selectedCategory]);

  const getCategoryColor = (category: string) => {
    const colors = {
      Analgesics: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      Antibiotics: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      NSAIDs: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      Bronchodilators: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      Antiemetics: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      Antihistamines: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
      Corticosteroids: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }

  const hasWarnings = (warnings: string[]) => {
    return warnings.length > 0
  }

  const handleAddDrug = async (newDrug: any) => {
    try {
      const response = await fetch('/api/drugs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDrug),
      });
      if (!response.ok) throw new Error('Failed to add drug');
      const addedDrug = await response.json();
      setDrugs([...drugs, addedDrug]);
      setShowAddModal(false);
    } catch (err) {
      console.error('Error adding drug:', err);
      setError('Error adding drug');
    }
  }

  const handleEditDrug = async (updatedDrug: any) => {
    try {
      const response = await fetch(`/api/drugs/${selectedDrug.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDrug),
      });
      if (!response.ok) throw new Error('Failed to update drug');
      const updated = await response.json();
      setDrugs(drugs.map((d) => (d.id === selectedDrug.id ? updated : d)));
      setShowEditModal(false);
      setSelectedDrug(null);
    } catch (err) {
      console.error('Error updating drug:', err);
      setError('Error updating drug');
    }
  }

  const handleDeleteDrug = async (id: string) => {
    try {
      const response = await fetch(`/api/drugs/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete drug');
      setDrugs(drugs.filter((d) => d.id !== id));
    } catch (err) {
      console.error('Error deleting drug:', err);
      setError('Error deleting drug');
    }
  }

  const openEditModal = (drug: any) => {
    setSelectedDrug(drug)
    setShowEditModal(true)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Drug Database</h1>
            <p className="text-muted-foreground">
              Comprehensive pediatric drug information including dosage guidelines and safety information
            </p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Drug
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Drugs</CardTitle>
              <Pill className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{drugs.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{drugCategories.length - 1}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Drugs</CardTitle>
              <Pill className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {drugs.filter((d) => d.status === "active").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Alert</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {drugs.filter((d) => hasWarnings(d.warnings)).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="p-0 border-0 outline-0 shadow-none">
          <CardHeader className="p-0 border-0 outline-0 shadow-none">
            <CardTitle>Drug Search</CardTitle>
            <CardDescription>Search by drug name, brand name, or indication</CardDescription>
          </CardHeader>
          <CardContent className="p-0 border-0 outline-0 shadow-none">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search drugs by name, brand, or indication..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {drugCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <div className="space-y-4">
                {drugs.map((drug) => (
                  <div
                    key={drug.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-4"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Pill className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">{drug.name}</h3>
                          <Badge className={getCategoryColor(drug.category)}>{drug.category}</Badge>
                          {hasWarnings(drug.warnings) && (
                            <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Warnings
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>
                            <span className="font-medium">Generic:</span> {drug.genericName}
                          </p>
                          <p>
                            <span className="font-medium">Brands:</span> {drug.brandNames.join(", ")}
                          </p>
                          <p>
                            <span className="font-medium">Form:</span> {drug.dosageForm}
                          </p>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Indication:</span> {drug.indication}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Age range: {drug.ageRange} • Concentration: {drug.concentration}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Link href={`/drugs/${drug.id}`} className="flex-1 sm:flex-none">
                        <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(drug)}
                        className="flex-1 sm:flex-none"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteDrug(drug.id)}
                        className="flex-1 sm:flex-none"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isLoading && drugs.length === 0 && (
              <div className="text-center py-8">
                <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No drugs found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || selectedCategory !== "All Categories"
                    ? "Try adjusting your search terms or filters"
                    : "Get started by adding your first drug"}
                </p>
                <Button onClick={() => setShowAddModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Drug
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <DrugModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSave={handleAddDrug} mode="add" />

        <DrugModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setSelectedDrug(null)
          }}
          onSave={handleEditDrug}
          drug={selectedDrug}
          mode="edit"
        />
      </div>
    </DashboardLayout>
  )
}