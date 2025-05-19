"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Car, Plus, Shield, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

export default function Interventions() {
  const router = useRouter()
  const { toast } = useToast()
  const [interventions, setInterventions] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [newIntervention, setNewIntervention] = useState({
    id: "",
    vehicleId: "",
    vehicleName: "",
    date: "",
    technician: "",
    description: "",
    cost: "",
  })
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    // Charger les interventions et véhicules depuis le localStorage
    const savedInterventions = localStorage.getItem("interventions")
    const savedVehicles = localStorage.getItem("vehicles")

    if (savedInterventions) {
      setInterventions(JSON.parse(savedInterventions))
    }

    if (savedVehicles) {
      setVehicles(JSON.parse(savedVehicles))
    }
  }, [])

  const saveInterventions = (updatedInterventions) => {
    localStorage.setItem("interventions", JSON.stringify(updatedInterventions))
    setInterventions(updatedInterventions)
  }

  const handleAddIntervention = () => {
    if (!newIntervention.vehicleId || !newIntervention.date || !newIntervention.description || !newIntervention.cost) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      })
      return
    }

    // Trouver le nom du véhicule
    const vehicle = vehicles.find((v) => v.id === newIntervention.vehicleId)

    const interventionToAdd = {
      ...newIntervention,
      id: Date.now().toString(),
      vehicleName: vehicle ? vehicle.name : "Véhicule inconnu",
    }

    const updatedInterventions = [...interventions, interventionToAdd]
    saveInterventions(updatedInterventions)

    setNewIntervention({
      id: "",
      vehicleId: "",
      vehicleName: "",
      date: "",
      technician: "",
      description: "",
      cost: "",
    })

    setDialogOpen(false)

    toast({
      title: "Intervention ajoutée",
      description: "L'intervention a été ajoutée avec succès.",
    })
  }

  const handleDeleteIntervention = (id) => {
    const updatedInterventions = interventions.filter((i) => i.id !== id)
    saveInterventions(updatedInterventions)

    toast({
      title: "Intervention supprimée",
      description: "L'intervention a été supprimée avec succès.",
    })
  }

  // Formater la date pour l'affichage
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString("fr-FR", options)
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#1A1A1A]">
      {/* Header */}
      <header className="bg-[#212121] p-4 shadow-md">
        <h1 className="text-2xl font-bold text-white">Interventions</h1>
        <p className="text-gray-400">Maintenance et réparations</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-200">Liste des interventions</h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#4D7C0F] hover:bg-[#3F6212]">
                <Plus className="h-5 w-5 mr-1" /> Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#212121] text-white border-[#333333]">
              <DialogHeader>
                <DialogTitle>Ajouter une intervention</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicle">Véhicule</Label>
                  <Select
                    onValueChange={(value) => setNewIntervention({ ...newIntervention, vehicleId: value })}
                    value={newIntervention.vehicleId}
                  >
                    <SelectTrigger className="bg-[#2A2A2A] border-[#333333] text-white">
                      <SelectValue placeholder="Sélectionner un véhicule" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2A2A2A] border-[#333333] text-white">
                      {vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.name} ({vehicle.registrationNumber})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newIntervention.date}
                    onChange={(e) => setNewIntervention({ ...newIntervention, date: e.target.value })}
                    className="bg-[#2A2A2A] border-[#333333] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="technician">Technicien</Label>
                  <Input
                    id="technician"
                    value={newIntervention.technician}
                    onChange={(e) => setNewIntervention({ ...newIntervention, technician: e.target.value })}
                    className="bg-[#2A2A2A] border-[#333333] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newIntervention.description}
                    onChange={(e) => setNewIntervention({ ...newIntervention, description: e.target.value })}
                    className="bg-[#2A2A2A] border-[#333333] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Coût (€)</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={newIntervention.cost}
                    onChange={(e) => setNewIntervention({ ...newIntervention, cost: e.target.value })}
                    className="bg-[#2A2A2A] border-[#333333] text-white"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                    className="border-[#333333] text-gray-300"
                  >
                    Annuler
                  </Button>
                  <Button onClick={handleAddIntervention} className="bg-[#4D7C0F] hover:bg-[#3F6212]">
                    Ajouter
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {interventions.length > 0 ? (
          <div className="space-y-3">
            {interventions.map((intervention) => (
              <Card key={intervention.id} className="bg-[#212121] border-[#333333] shadow-md">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-white">{intervention.vehicleName}</h3>
                      </div>
                      <p className="text-sm text-gray-400">{formatDate(intervention.date)}</p>
                      <p className="text-sm text-gray-300 mt-2">{intervention.description}</p>
                      {intervention.technician && (
                        <p className="text-xs text-gray-400 mt-1">Technicien: {intervention.technician}</p>
                      )}
                      <p className="text-lg font-semibold text-[#84cc16] mt-2">
                        {Number.parseFloat(intervention.cost).toFixed(2)} €
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-400 hover:bg-red-900/20"
                        onClick={() => handleDeleteIntervention(intervention.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mb-4 opacity-50"
            >
              <path d="m14.7 6.3 1 1 4-4-1-1z" />
              <path d="M12 8 7 3 3 7l5 5" />
              <path d="M7 9 4 6" />
              <path d="M16 12a4 4 0 0 1-8 0v-2h8z" />
              <path d="M16 17h-1a2 2 0 0 0-2 2v1a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1a2 2 0 0 0-2-2H6" />
            </svg>
            <p>Aucune intervention enregistrée</p>
            <p className="text-sm">Ajoutez votre première intervention</p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-[#1A1A1A] border-t border-[#333333] p-2">
        <div className="flex justify-around">
          <Button variant="ghost" className="flex flex-col items-center text-gray-400" onClick={() => router.push("/")}>
            <Shield className="h-6 w-6" />
            <span className="text-xs mt-1">Accueil</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center text-gray-400"
            onClick={() => router.push("/vehicules")}
          >
            <Car className="h-6 w-6" />
            <span className="text-xs mt-1">Véhicules</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center text-white"
            onClick={() => router.push("/interventions")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="m14.7 6.3 1 1 4-4-1-1z" />
              <path d="M12 8 7 3 3 7l5 5" />
              <path d="M7 9 4 6" />
              <path d="M16 12a4 4 0 0 1-8 0v-2h8z" />
              <path d="M16 17h-1a2 2 0 0 0-2 2v1a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1a2 2 0 0 0-2-2H6" />
            </svg>
            <span className="text-xs mt-1">Interventions</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center text-gray-400"
            onClick={() => router.push("/bilan")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M3 3v18h18" />
              <path d="M7 16h2" />
              <path d="M11 12h2" />
              <path d="M15 8h2" />
              <path d="M7 12h2" />
              <path d="M11 8h2" />
              <path d="M15 16h2" />
            </svg>
            <span className="text-xs mt-1">Bilan</span>
          </Button>
        </div>
      </nav>
    </div>
  )
}
