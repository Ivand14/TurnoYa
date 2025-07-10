import React from "react";
import {
  Calendar,
  BarChart3,
  Users,
  Clock,
  Settings,
  Home,
  CreditCard,
  FileText,
  MapPin,
  LogOut,
} from "lucide-react";
import { Company, compnay_logged } from "@/context/current_company";
import MercadoPagoAvatar from "./mercadopagoComponents/MercadoPagoAvatar";
import { current_user } from "@/context/currentUser";
import { Logged } from "@/context/logged";
import { useNavigate } from "react-router-dom";
import { logout } from "@/lib/utils";
import { salesmanContext } from "@/context/MercadoPagoContext/salesmanContext";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  company: Company;
}

const SidebarLayout: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  company,
}) => {
  const { setUser } = current_user();
  const { setIsLogged } = Logged();
  const { setCompany } = compnay_logged();

  const navigate = useNavigate();

  const handleLogOut = () => {
    setIsLogged(false);
    setUser(null);
    setCompany(null);
    logout();
    localStorage.removeItem("salesman-store");
    salesmanContext.getState().clearSalesman();
    localStorage.removeItem("activeTab");
    navigate("/login");
  };

  const menuItems = [
    { id: "resume", label: "Dashboard", icon: Home },
    { id: "booking", label: "Reservas", icon: Calendar },
    { id: "employees", label: "Empleados", icon: Users },
    { id: "statistics", label: "Estadísticas", icon: BarChart3 },
    { id: "schedules", label: "Horarios", icon: Clock },
    { id: "service", label: "Servicios", icon: MapPin },
    { id: "wallet", label: "Pagos", icon: CreditCard },
    { id: "reportes", label: "Reportes", icon: FileText },
    { id: "configuracion", label: "Configuración", icon: Settings },
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col sticky top-0 left-0 rounded-tr-3xl rounded-br-3xl">
      {" "}
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">TurnosYa</h1>
          </div>
        </div>
      </div>
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 hover:bg-slate-800 ${
                activeTab === item.id
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center space-x-3 px-4 py-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <MercadoPagoAvatar picture_url={company.logo} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">
              {company.company_name}
            </p>
            <p className="text-xs text-slate-400">{company.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogOut}
          className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default SidebarLayout;
