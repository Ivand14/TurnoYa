import React, { useEffect, useState } from "react";
import {
  User,
  Lock,
  Camera,
  Mail,
  Phone,
  MapPin,
  Save,
  Eye,
  EyeOff,
  Crown,
  SubscriptIcon,
} from "lucide-react";
import { toast } from "sonner";
import { compnay_logged } from "@/context/current_company";
import {
  cancelSubscription,
  subscripcionData,
} from "@/apis/MercadoPagoApis/subscription";
import { set } from "date-fns";
import PricingCards from "../pricingCards";
import ReactivateSubscription from "../subscriptions/reActivateSubscription";

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const { company } = compnay_logged();
  const [subscriptionData, setSubscriptionData] = useState(null);

  // Estados del formulario
  const [form, setForm] = useState({
    // Perfil
    name: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    logo: null as File | null,

    // Seguridad
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm((prev) => ({ ...prev, logo: file }));

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      address: "",
      description: "",
      logo: null,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Aquí iría la lógica para guardar los cambios
      console.log("Guardando cambios:", form);
      toast.success("Configuración guardada exitosamente");
    } catch (error) {
      console.log(error);
      toast.error("Error al guardar la configuración");
    } finally {
      resetForm();
      setIsLoading(false);
      setImagePreview("");
    }
  };

  const tabs = [
    { id: "profile", label: "Perfil", icon: User },
    { id: "security", label: "Seguridad", icon: Lock },
    { id: "subscription", label: "Suscripción", icon: Crown },
  ];

  const handleSubscription = async () => {
    try {
      setIsLoading(true);
      const subscriptionResponse = await subscripcionData(
        company["preapproval_id"]
      );
      const {
        plan_info: { summarized, ...plan_info },
      } = subscriptionResponse;
      setSubscriptionData(plan_info);
    } catch (error) {
      console.log(error);
      toast.error("Error al iniciar la suscripción");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "subscription") {
      handleSubscription();
    }
  }, [activeTab]);

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Información del Perfil
        </h2>
        <p className="text-gray-600">
          Actualiza tu información personal y de contacto
        </p>
      </div>

      {/* Foto de perfil */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="font-medium text-gray-900 mb-4">Foto de perfil</h3>
        <div className="flex items-center space-x-4">
          <div className="relative">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
            )}
            <label
              htmlFor="profile-upload"
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors"
            >
              <Camera className="w-3 h-3 text-white" />
            </label>
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Cambiar foto</p>
            <p className="text-xs text-gray-500">JPG, PNG máximo 2MB</p>
          </div>
        </div>
      </div>

      {/* Información básica */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="font-medium text-gray-900 mb-4">Información básica</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la empresa
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Mi Empresa S.A."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="email@empresa.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+1 234 567 8900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="123 Calle Principal, Ciudad"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Descripción de la empresa..."
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Configuración de Seguridad
        </h2>
        <p className="text-gray-600">
          Gestiona tu contraseña y configuración de seguridad
        </p>
      </div>

      {/* Cambiar contraseña */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="font-medium text-gray-900 mb-4">Cambiar contraseña</h3>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña actual
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nueva contraseña
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={form.newPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar nueva contraseña
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSubscriptionTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Gestión de Suscripción
        </h2>
        <p className="text-gray-600">
          Administra tu plan, facturación y opciones de suscripción
        </p>
      </div>

      {/* Estado actual de suscripción */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-900">Plan Actual</h3>
          <span
            className={`px-3 py-1  text-sm font-medium rounded-full ${
              subscriptionData?.status === "active"
                ? "text-green-800 bg-green-100"
                : "text-red-800 bg-red-100"
            }`}
          >
            {subscriptionData?.status === "active" ? " Activo" : "Inactivo"}
          </span>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <div className="flex items-center space-x-2">
            <Crown className="w-5 h-5 text-blue-600" />
            <span className="text-lg font-semibold text-gray-900">
              {subscriptionData?.status === "active"
                ? subscriptionData?.reason
                : "Sin suscripción activa"}
            </span>
          </div>
          <div className="text-gray-500">•</div>
          <span className="text-gray-600">
            {subscriptionData?.status === "active"
              ? `${subscriptionData?.auto_recurring?.transaction_amount}/${subscriptionData?.auto_recurring?.currency_id}`
              : "0$"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-gray-900">
              {subscriptionData?.status === "active" &&
                (() => {
                  const nextPaymentDate = new Date(
                    subscriptionData?.next_payment_date
                  );
                  const today = new Date();
                  // Calculate difference in milliseconds
                  const diffTime = nextPaymentDate.getTime() - today.getTime();
                  // Convert milliseconds to days
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  return diffDays > 0 ? `${diffDays}` : "0";
                })()}
            </div>
            <div className="text-sm text-gray-600">Días restantes</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-gray-900">
              {subscriptionData?.status === "active" &&
                new Date(
                  subscriptionData?.next_payment_date
                ).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                })}
            </div>
            <div className="text-sm text-gray-600">Próximo cobro</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-gray-900">
              {subscriptionData?.status === "active" &&
                subscriptionData?.payment_method_id === "account_money" &&
                "Saldo de cuenta"}
            </div>
            <div className="text-sm text-gray-600">Método de pago</div>
          </div>
        </div>
      </div>

      {/* Planes disponibles */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        {subscriptionData?.status === "cancelled" && (
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ¡Te extrañamos! 👋
            </h1>
            <p className="text-gray-600">
              Reactiva tu suscripción y vuelve a gestionar tu negocio sin
              límites
            </p>
          </div>
        )}
        <ReactivateSubscription status={subscriptionData?.status} />
      </div>

      {/* Historial de facturación */}
      {subscriptionData && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-4">
            Historial de Facturación
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 text-gray-600 font-medium">
                    Fecha
                  </th>
                  <th className="text-left py-3 text-gray-600 font-medium">
                    Descripción
                  </th>
                  <th className="text-left py-3 text-gray-600 font-medium">
                    Monto
                  </th>
                  <th className="text-left py-3 text-gray-600 font-medium">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 text-gray-900">
                    {new Date(
                      subscriptionData?.next_payment_date
                    ).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3 text-gray-900">
                    Plan {subscriptionData?.reason} -{" "}
                    {new Date(
                      subscriptionData?.next_payment_date
                    ).toLocaleDateString("es-ES", {
                      month: "long",
                    })}
                  </td>
                  <td className="py-3 text-gray-900">
                    ${subscriptionData?.auto_recurring?.transaction_amount}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full ${
                        subscriptionData?.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {subscriptionData?.status === "active"
                        ? "Pagado"
                        : "Cancelado"}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cancelar suscripción */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-sm font-bold">!</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-red-900 mb-2">
              Cancelar Suscripción
            </h3>
            <p className="text-red-800 text-sm mb-4">
              Si cancelas tu suscripción, perderás acceso a las funciones
              premium al final del período de facturación actual (12 Feb 2024).
            </p>
            <button
              onClick={() =>
                cancelSubscription(subscriptionData?.preapproval_plan_id).then(
                  () => {
                    toast.success("Suscripción cancelada correctamente");
                    setSubscriptionData(null);
                  }
                )
              }
              className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            >
              Cancelar Suscripción
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileTab();
      case "security":
        return renderSecurityTab();
      case "subscription":
        return renderSubscriptionTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Configuración de Cuenta
        </h1>
        <p className="text-gray-600">
          Gestiona tu perfil, seguridad y preferencias
        </p>
      </div>

      {/* Navegación por pestañas */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido de la pestaña */}
      <form onSubmit={handleSubmit}>
        {renderTabContent()}

        {/* Botón de guardar - solo para perfil y seguridad */}
        {activeTab !== "subscription" && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Guardar cambios</span>
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default AccountSettings;
