"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Car, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function Bilan() {
  const router = useRouter()
  const [vehicles, setVehicles] = useState([])
  const [interventions, setInterventions] = useState([])
  const [selectedVehicle, setSelectedVehicle] = useState("all")
  const [selectedPeriod, setSelectedPeriod] = useState("all")
  const [chartData, setChartData] = useState([])
  const [totalExpenses, setTotalExpenses] = useState(0)

  useEffect(() => {
    // Charger les données depuis le localStorage
    const savedVehicles = localStorage.getItem("vehicles")
    const savedInterventions = localStorage.getItem("interventions")

    if (savedVehicles) {
      setVehicles(JSON.parse(savedVehicles))
    }

    if (savedInterventions) {
      setInterventions(JSON.parse(savedInterventions))
    }
  }, [])

  useEffect(() => {
    // Filtrer les interventions en fonction des sélections
    let filteredInterventions = [...interventions]

    // Filtrer par véhicule
    if (selectedVehicle !== "all") {
      filteredInterventions = filteredInterventions.filter((i) => i.vehicleId === selectedVehicle)
    }

    // Filtrer par période
    if (selectedPeriod !== "all") {
      const now = new Date()
      let startDate

      switch (selectedPeriod) {
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
          break
        case "quarter":
          startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
          break
        case "year":
          startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
          break
        default:
          startDate = new Date(0) // Début des temps
      }

      filteredInterventions = filteredInterventions.filter((i) => new Date(i.date) >= startDate)
    }

    // Calculer le total des dépenses
    const total = filteredInterventions.reduce((sum, i) => sum + Number.parseFloat(i.cost || 0), 0)
    setTotalExpenses(total)

    // Préparer les données pour le graphique
    const vehicleExpenses = {}

    filteredInterventions.forEach((intervention) => {
      const vehicleName = intervention.vehicleName
      if (!vehicleExpenses[vehicleName]) {
        vehicleExpenses[vehicleName] = 0
      }
      vehicleExpenses[vehicleName] += Number.parseFloat(intervention.cost || 0)
    })

    const data = Object.keys(vehicleExpenses).map((name) => ({
      name: name,
      montant: vehicleExpenses[name],
    }))

    setChartData(data)
  }, [interventions, selectedVehicle, selectedPeriod])

  return (
    <div className="flex flex-col min-h-screen bg-[#1A1A1A]">
      {/* Header */}
      <header className="bg-[#212121] p-4 shadow-md">
        <h1 className="text-2xl font-bold text-white">Bilan Financier</h1>
        <p className="text-gray-400">Analyse des dépenses</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <Card className="bg-[#212121] border-[#333333] shadow-md mb-4">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Véhicule</label>
                <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                  <SelectTrigger className="bg-[#2A2A2A] border-[#333333] text-white">
                    <SelectValue placeholder="Tous les véhicules" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2A2A2A] border-[#333333] text-white">
                    <SelectItem value="all">Tous les véhicules</SelectItem>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Période</label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="bg-[#2A2A2A] border-[#333333] text-white">
                    <SelectValue placeholder="Toutes les périodes" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2A2A2A] border-[#333333] text-white">
                    <SelectItem value="all">Toutes les périodes</SelectItem>
                    <SelectItem value="month">Dernier mois</SelectItem>
                    <SelectItem value="quarter">Dernier trimestre</SelectItem>
                    <SelectItem value="year">Dernière année</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#212121] border-[#333333] shadow-md mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-white">Dépenses totales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#84cc16]">{totalExpenses.toFixed(2)} FCFA</p>
          </CardContent>
        </Card>

        <Card className="bg-[#212121] border-[#333333] shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-white">Répartition des dépenses</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                    <XAxis dataKey="name" stroke="#999999" angle={-45} textAnchor="end" height={60} />
                    <YAxis stroke="#999999" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#2A2A2A", borderColor: "#333333", color: "white" }}
                      formatter={(value) => [`${value.toFixed(2)} FCFA`, "Montant"]}
                    />
                    <Bar dataKey="montant" fill="#84cc16" />
                  </BarChart>
                </ResponsiveContainer>
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
                  <path d="M3 3v18h18" />
                  <path d="M7 16h2" />
                  <path d="M11 12h2" />
                  <path d="M15 8h2" />
                  <path d="M7 12h2" />
                  <path d="M11 8h2" />
                  <path d="M15 16h2" />
                </svg>
                <p>Aucune donnée disponible</p>
                <p className="text-sm">Ajoutez des interventions pour voir les statistiques</p>
              </div>
            )}
          </CardContent>
        </Card>
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
            className="flex flex-col items-center text-white"
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
