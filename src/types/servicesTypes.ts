import { Heart, Palette, Scissors, Sparkles, Star, Zap } from "lucide-react";

export const PREDEFINED_CATEGORIES = [
  {
    id: "cabello",
    name: "Cabello",
    icon: Scissors,
    color: "bg-gradient-to-br from-purple-500 to-pink-600",
    description: "Cortes, peinados, tratamientos capilares",
  },
  {
    id: "unas",
    name: "Uñas",
    icon: Sparkles,
    color: "bg-gradient-to-br from-pink-500 to-rose-600",
    description: "Manicura, pedicura, nail art",
  },
  {
    id: "estetica",
    name: "Estética",
    icon: Star,
    color: "bg-gradient-to-br from-blue-500 to-cyan-600",
    description: "Tratamientos faciales, limpieza",
  },
  {
    id: "maquillaje",
    name: "Maquillaje",
    icon: Palette,
    color: "bg-gradient-to-br from-orange-500 to-red-600",
    description: "Maquillaje profesional, eventos",
  },
  {
    id: "masajes",
    name: "Masajes",
    icon: Heart,
    color: "bg-gradient-to-br from-green-500 to-teal-600",
    description: "Relajantes, terapéuticos, deportivos",
  },
  {
    id: "depilacion",
    name: "Depilación",
    icon: Zap,
    color: "bg-gradient-to-br from-yellow-500 to-orange-600",
    description: "Láser, cera, definitiva",
  },
];