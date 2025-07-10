import React, { useState } from "react";
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
  Menu,
  X,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Company {
  id: string;
  company_name: string;
  email: string;
  logo?: string;
}

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  company: Company;
}

const ResponsiveSidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  company,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogOut = () => {
    // Simplified logout - in real app you'd handle this properly
    console.log("Logging out...");
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

  const handleMenuClick = (itemId: string) => {
    onTabChange(itemId);
    setIsMobileOpen(false); // Close mobile menu after selection
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg hover:bg-slate-800 transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed lg:sticky top-0 left-0 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col z-50 transition-all duration-300 ease-in-out",
          // Mobile styles
          "lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop collapse styles
          isCollapsed ? "lg:w-20" : "lg:w-72",
          // Mobile width
          "w-72z"
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleCollapse}
                className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg"
              >
                <Calendar className="w-6 h-6 text-white" />
              </button>
              {!isCollapsed && (
                <div className="transition-opacity duration-200">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    TurnosYa
                  </h1>
                </div>
              )}
            </div>

            {/* Close button for mobile */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Collapse button for desktop */}
            {/* <button
              onClick={toggleCollapse}
              className="hidden lg:block p-1 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button> */}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={cn(
                  "group w-full flex items-center px-4 py-3 rounded-xl text-left transition-all duration-200 hover:scale-105 transform",
                  isActive
                    ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-xl shadow-blue-500/25"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50 backdrop-blur-sm",
                  isCollapsed ? "justify-center" : "space-x-3"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-transform duration-200",
                    isActive && "scale-110",
                    !isActive && "group-hover:scale-105"
                  )}
                />
                {!isCollapsed && (
                  <span className="font-medium transition-all duration-200">
                    {item.label}
                  </span>
                )}

                {/* Active indicator */}
                {isActive && !isCollapsed && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/50 backdrop-blur-sm">
          {/* Company Info */}
          <div
            className={cn(
              "flex items-center px-4 py-3 mb-3 bg-slate-800/50 rounded-xl backdrop-blur-sm",
              isCollapsed ? "justify-center" : "space-x-3"
            )}
          >
            <Avatar className="w-10 h-10">
              <AvatarImage src={company.logo} alt={company.company_name} />
              <AvatarFallback className="bg-gradient-to-br from-green-400 to-blue-500 text-white font-semibold">
                {company.company_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {company.company_name}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {company.email}
                </p>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogOut}
            className={cn(
              "group w-full flex items-center px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 border border-transparent transition-all duration-200 hover:scale-105 transform",
              isCollapsed ? "justify-center" : "space-x-3"
            )}
            title={isCollapsed ? "Cerrar Sesión" : undefined}
          >
            <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
            {!isCollapsed && (
              <span className="text-sm font-medium">Cerrar Sesión</span>
            )}
          </button>
        </div>
      </div>

      {/* Spacer for collapsed sidebar on desktop */}
      <div
        className={cn(
          "hidden lg:block transition-all duration-300",
          isCollapsed ? "w-20" : "w-72"
        )}
      />
    </>
  );
};

export default ResponsiveSidebar;
