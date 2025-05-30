"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Car, Settings, Shield } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState([]);
  const [interventions, setInterventions] = useState([]);

  useEffect(() => {
    // Charger les données depuis le localStorage
    const savedVehicles = localStorage.getItem("vehicles");
    const savedInterventions = localStorage.getItem("interventions");

    if (savedVehicles) {
      setVehicles(JSON.parse(savedVehicles));
    }

    if (savedInterventions) {
      setInterventions(JSON.parse(savedInterventions));
    }
  }, []);

  const operationalVehicles = vehicles.filter((v) => v.operational).length;
  const nonOperationalVehicles = vehicles.length - operationalVehicles;

  const recentInterventions = interventions.slice(0, 3);

  const totalExpenses = interventions.reduce(
    (sum, intervention) => sum + (Number.parseFloat(intervention.cost) || 0),
    0
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#1A1A1A]">
      {/* Header */}
      <header className="relative w-full h-64 overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <Image
          src="/background-image.jpeg"
          alt="Véhicule militaire"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 flex justify-between items-start p-4">
          <div className="flex flex-col">
            <h1
              className="text-3xl font-bold tracking-wider text-white"
              style={{ fontFamily: "monospace" }}
            >
              GARAGE BET
            </h1>
            <p className="text-gray-300 text-sm">Gestion de flotte militaire</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={() => router.push("/parametres")}
          >
            <Settings className="h-6 w-6" />
            <span className="sr-only">Paramètres</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 -mt-16 relative z-20">
        <Card className="bg-[#212121] border-[#333333] shadow-lg mb-4">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold text-gray-200 mb-3 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-[#4D7C0F]" />
              État de la flotte
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-[#2A2A2A] p-3 rounded-lg">
                <p className="text-sm text-gray-400">Total véhicules</p>
                <p className="text-2xl font-bold text-white">
                  {vehicles.length}
                </p>
              </div>
              <div className="bg-[#2A2A2A] p-3 rounded-lg">
                <p className="text-sm text-gray-400">Opérationnels</p>
                <p className="text-2xl font-bold text-green-500">
                  {operationalVehicles}
                </p>
              </div>
            </div>

            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">État opérationnel</span>
                <span className="text-gray-300">
                  {vehicles.length > 0
                    ? Math.round((operationalVehicles / vehicles.length) * 100)
                    : 0}
                  %
                </span>
              </div>
              <Progress
                value={
                  vehicles.length > 0
                    ? (operationalVehicles / vehicles.length) * 100
                    : 0
                }
                className="h-2 bg-[#333333]"
              />
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-400">Non opérationnels</p>
              <p className="text-2xl font-bold text-red-500">
                {nonOperationalVehicles}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#212121] border-[#333333] shadow-lg mb-4">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold text-gray-200 mb-3">
              Dépenses totales
            </h2>
            <p className="text-3xl font-bold text-[#84cc16]">
              {totalExpenses.toFixed(2)} FCFA
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#212121] border-[#333333] shadow-lg">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold text-gray-200 mb-3">
              Dernières interventions
            </h2>

            {recentInterventions.length > 0 ? (
              <div className="space-y-3">
                {recentInterventions.map((intervention, index) => (
                  <div
                    key={index}
                    className="bg-[#2A2A2A] p-3 rounded-lg"
                  >
                    <div className="flex justify-between">
                      <p className="text-gray-300 font-medium">
                        {intervention.vehicleName}
                      </p>
                      <p className="text-[#84cc16]">
                        {Number.parseFloat(intervention.cost).toFixed(2)} FCFA
                      </p>
                    </div>
                    <p className="text-sm text-gray-400">{intervention.date}</p>
                    <p className="text-sm text-gray-400 truncate">
                      {intervention.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-4">
                Aucune intervention enregistrée
              </p>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-[#1A1A1A] border-t border-[#333333] p-2">
        <div className="flex justify-around">
          <Button
            variant="ghost"
            className="flex flex-col items-center text-white"
            onClick={() => router.push("/")}
          >
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
  );
}
