"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function Parametres() {
  const router = useRouter()
  const { toast } = useToast()
  const [resetDialogOpen, setResetDialogOpen] = useState(false)

  const handleResetData = () => {
    // Supprimer toutes les données du localStorage
    localStorage.removeItem("vehicles")
    localStorage.removeItem("interventions")

    setResetDialogOpen(false)

    toast({
      title: "Données réinitialisées",
      description: "Toutes les données ont été supprimées avec succès.",
    })

    // Rediriger vers la page d'accueil
    router.push("/")
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#1A1A1A]">
      {/* Header */}
      <header className="bg-[#212121] p-4 shadow-md flex items-center">
        <Button variant="ghost" size="icon" className="mr-2 text-white" onClick={() => router.back()}>
          <ArrowLeft className="h-6 w-6" />
          <span className="sr-only">Retour</span>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-white">Paramètres</h1>
          <p className="text-gray-400">Configuration de l'application</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <Card className="bg-[#212121] border-[#333333] shadow-md mb-4">
          <CardHeader>
            <CardTitle className="text-white">À propos</CardTitle>
            <CardDescription className="text-gray-400">Informations sur l'application</CardDescription>
          </CardHeader>
          <CardContent className="text-gray-300">
            <p className="mb-2">
              <strong>Nom:</strong> Garage BET
            </p>
            <p className="mb-2">
              <strong>Version:</strong> 1.0.0
            </p>
            <p>
              <strong>Description:</strong> Application de gestion pour garage militaire
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#212121] border-[#333333] shadow-md">
          <CardHeader>
            <CardTitle className="text-white">Gestion des données</CardTitle>
            <CardDescription className="text-gray-400">Options de réinitialisation</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  Réinitialiser toutes les données
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#212121] text-white border-[#333333]">
                <DialogHeader>
                  <DialogTitle>Réinitialiser les données</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Cette action supprimera définitivement toutes les données de l'application. Cette action est
                    irréversible.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setResetDialogOpen(false)}
                    className="border-[#333333] text-gray-300"
                  >
                    Annuler
                  </Button>
                  <Button variant="destructive" onClick={handleResetData}>
                    Confirmer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <p className="text-gray-400 text-sm mt-2">
              Attention: Cette action supprimera tous les véhicules et interventions enregistrés.
            </p>
          </CardContent>
        </Card>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-[#1A1A1A] border-t border-[#333333] p-2">
        <div className="flex justify-around">
          <Button variant="ghost" className="flex flex-col items-center text-white" onClick={() => router.push("/")}>
            <Shield className="h-6 w-6" />
            <span className="text-xs mt-1">Accueil</span>
          </Button>
        </div>
      </nav>
    </div>
  )
}
