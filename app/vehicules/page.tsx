"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Car, ChevronRight, Plus, Shield, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"

export default function Vehicules() {
  const router = useRouter()
  const { toast } = useToast()
  const [vehicles, setVehicles] = useState([])
  const [newVehicle, setNewVehicle] = useState({
    id: "",
    name: "",
    type: "",
    registrationNumber: "",
    operational: true,
  })
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    // Charger les véhicules depuis le localStorage
    const savedVehicles = localStorage.getItem("vehicles")
    if (savedVehicles) {
      setVehicles(JSON.parse(savedVehicles))
    }
  }, [])

  const saveVehicles = (updatedVehicles) => {
    localStorage.setItem("vehicles", JSON.stringify(updatedVehicles))
    setVehicles(updatedVehicles)
  }

  const handleAddVehicle = () => {
    if (!newVehicle.name || !newVehicle.type || !newVehicle.registrationNumber) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      })
      return
    }

    const vehicleToAdd = {
      ...newVehicle,
      id: Date.now().toString(),
    }

    const updatedVehicles = [...vehicles, vehicleToAdd]
    saveVehicles(updatedVehicles)

    setNewVehicle({
      id: "",
      name: "",
      type: "",
      registrationNumber: "",
      operational: true,
    })

    setDialogOpen(false)

    toast({
      title: "Véhicule ajouté",
      description: `${vehicleToAdd.name} a été ajouté avec succès.`,
    })
  }

  const handleDeleteVehicle = (id) => {
    // Vérifier si le véhicule a des interventions associées
    const interventions = JSON.parse(localStorage.getItem("interventions") || "[]")
    const hasInterventions = interventions.some((i) => i.vehicleId === id)

    if (hasInterventions) {
      toast({
        title: "Impossible de supprimer",
        description: "Ce véhicule a des interventions associées. Supprimez d'abord les interventions.",
        variant: "destructive",
      })
      return
    }

    const updatedVehicles = vehicles.filter((v) => v.id !== id)
    saveVehicles(updatedVehicles)

    toast({
      title: "Véhicule supprimé",
      description: "Le véhicule a été supprimé avec succès.",
    })
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#1A1A1A]">
      {/* Header */}
      <header className="bg-[#212121] p-4 shadow-md">
        <h1 className="text-2xl font-bold text-white">Véhicules</h1>
        <p className="text-gray-400">Gestion de la flotte</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-200">Liste des véhicules</h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#4D7C0F] hover:bg-[#3F6212]">
                <Plus className="h-5 w-5 mr-1" /> Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#212121] text-white border-[#333333]">
              <DialogHeader>
                <DialogTitle>Ajouter un véhicule</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du véhicule</Label>
                  <Input
                    id="name"
                    value={newVehicle.name}
                    onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
                    className="bg-[#2A2A2A] border-[#333333] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type de véhicule</Label>
                  <Input
                    id="type"
                    value={newVehicle.type}
                    onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}
                    className="bg-[#2A2A2A] border-[#333333] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Numéro d'immatriculation</Label>
                  <Input
                    id="registrationNumber"
                    value={newVehicle.registrationNumber}
                    onChange={(e) => setNewVehicle({ ...newVehicle, registrationNumber: e.target.value })}
                    className="bg-[#2A2A2A] border-[#333333] text-white"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="operational"
                    checked={newVehicle.operational}
                    onCheckedChange={(checked) => setNewVehicle({ ...newVehicle, operational: checked })}
                  />
                  <Label htmlFor="operational">Opérationnel</Label>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                    className="border-[#333333] text-gray-300"
                  >
                    Annuler
                  </Button>
                  <Button onClick={handleAddVehicle} className="bg-[#4D7C0F] hover:bg-[#3F6212]">
                    Ajouter
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {vehicles.length > 0 ? (
          <div className="space-y-3">
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id} className="bg-[#212121] border-[#333333] shadow-md">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium text-white">{vehicle.name}</h3>
                      <p className="text-sm text-gray-400">
                        {vehicle.type} • {vehicle.registrationNumber}
                      </p>
                      <div className="mt-2">
                        <Badge className={vehicle.operational ? "bg-green-700" : "bg-red-700"}>
                          {vehicle.operational ? "Opérationnel" : "Non opérationnel"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-400 hover:bg-red-900/20"
                        onClick={() => handleDeleteVehicle(vehicle.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400"
                        onClick={() => router.push(`/vehicules/${vehicle.id}`)}
                      >
                        <ChevronRight className="h-5 w-5" />
                        <span className="sr-only">Détails</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Car className="h-12 w-12 mb-4 opacity-50" />
            <p>Aucun véhicule enregistré</p>
            <p className="text-sm">Ajoutez votre premier véhicule</p>
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
            className="flex flex-col items-center text-white"
            onClick={() => router.push("/vehicules")}
          >
            <Car className="h-6 w-6" />
            <span className="text-xs mt-1">Véhicules</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center text-gray-400"
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
