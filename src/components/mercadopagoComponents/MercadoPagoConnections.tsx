
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  ExternalLink,
  Key,
  Banknote,
  TestTube,
  Link,
  Shield,
} from "lucide-react";
import { salesmanData } from "@/context/MercadoPagoContext/salesmanContext";

interface MercadoPagoConnectionsProps {
  oauthAccount: salesmanData;
  isLoading: boolean;
  handleOAuthAuthorization: () => void;
  isTestMode: boolean;
  setIsTestMode: React.Dispatch<React.SetStateAction<boolean>>;
  accessToken: string;
  setAccessToken: (value: string) => void;
  publicKey: string;
  setPublicKey: (value: string) => void;
  handleTestConnection: () => void;
  handleSaveSettings: () => void;
  isConnected: boolean;
  handleDisconnect: () => void;
}

const MercadoPagoConnections: React.FC<MercadoPagoConnectionsProps> = ({
  oauthAccount,
  isLoading,
  handleOAuthAuthorization,
  isTestMode,
  setIsTestMode,
  accessToken,
  setAccessToken,
  publicKey,
  setPublicKey,
  handleTestConnection,
  handleSaveSettings,
  isConnected,
  handleDisconnect,
}) => {
  const [activeTab, setActiveTab] = useState("oauth");
  const [showAccessToken, setShowAccessToken] = useState(false);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/25">
            <Link className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Métodos de Conexión
            </h3>
            <p className="text-gray-500 mt-1">
              Elige cómo conectar tu cuenta de MercadoPago
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-gray-50 p-1 rounded-2xl">
            <TabsTrigger 
              value="oauth" 
              className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Shield className="h-4 w-4" />
              OAuth (Recomendado)
            </TabsTrigger>
            <TabsTrigger 
              value="manual" 
              className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Key className="h-4 w-4" />
              Manual
            </TabsTrigger>
          </TabsList>

          {/* OAuth Tab */}
          <TabsContent value="oauth" className="space-y-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-emerald-900 mb-2">Método Recomendado</h4>
                  <p className="text-emerald-800 text-sm">
                    Conecta tu cuenta de MercadoPago de forma segura sin compartir tus credenciales. 
                    Este método es más seguro y fácil de gestionar.
                  </p>
                </div>
              </div>
            </div>

            {isConnected === false ? (
              <div className="space-y-6">
                <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-2xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Conectar con OAuth
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Autoriza de forma segura el acceso a tu cuenta de MercadoPago
                  </p>
                  <Button
                    onClick={handleOAuthAuthorization}
                    disabled={isLoading}
                    className="h-12 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <ExternalLink className="h-5 w-5 mr-2" />
                    )}
                    Conectar con MercadoPago
                  </Button>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl">
                  <h4 className="font-semibold text-blue-900 mb-4">
                    ¿Qué sucede cuando me conecto?
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      Serás redirigido a MercadoPago para autorizar el acceso
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      No compartimos tus credenciales
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      Puedes revocar el acceso en cualquier momento
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      Obtenemos solo los permisos necesarios para procesar pagos
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-emerald-900">Cuenta Conectada</h4>
                    <p className="text-emerald-800 text-sm">
                      Tu cuenta está conectada y lista para procesar pagos.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Manual Tab */}
          <TabsContent value="manual" className="space-y-6">
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-orange-900 mb-2">Configuración Manual</h4>
                  <p className="text-orange-800 text-sm">
                    Este método requiere que ingreses manualmente tus credenciales. 
                    Recomendamos usar OAuth para mayor seguridad.
                  </p>
                </div>
              </div>
            </div>

            {/* Test Mode Toggle */}
            <div className="flex items-center justify-between p-6 border border-gray-200 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                  <TestTube className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Modo de Prueba</h4>
                  <p className="text-sm text-gray-500">
                    Usa credenciales de prueba para hacer tests
                  </p>
                </div>
              </div>
              <Switch checked={isTestMode} onCheckedChange={setIsTestMode} />
            </div>

            {/* Access Token */}
            <div className="space-y-3">
              <Label htmlFor="access-token" className="flex items-center gap-2 text-base font-semibold">
                <Key className="h-4 w-4" />
                Access Token {isTestMode ? "(TEST)" : "(PRODUCCIÓN)"} *
              </Label>
              <div className="relative">
                <Input
                  id="access-token"
                  type={showAccessToken ? "text" : "password"}
                  placeholder={isTestMode ? "TEST-..." : "APP_USR-..."}
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  className="pr-12 h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2 h-8 w-8 p-0 hover:bg-gray-100"
                  onClick={() => setShowAccessToken(!showAccessToken)}
                >
                  {showAccessToken ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Tu Access Token privado para procesar pagos
              </p>
            </div>

            {/* Public Key */}
            <div className="space-y-3">
              <Label htmlFor="public-key" className="flex items-center gap-2 text-base font-semibold">
                <Banknote className="h-4 w-4" />
                Public Key {isTestMode ? "(TEST)" : "(PRODUCCIÓN)"}
              </Label>
              <Input
                id="public-key"
                placeholder={isTestMode ? "TEST-..." : "APP_USR-..."}
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500">
                Tu Public Key para inicializar el checkout (opcional)
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleTestConnection}
                disabled={isLoading || !accessToken}
                className="h-12 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/25"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <CheckCircle className="h-5 w-5 mr-2" />
                )}
                Probar Conexión
              </Button>

              <Button
                variant="outline"
                onClick={handleSaveSettings}
                disabled={!accessToken}
                className="h-12 px-6 rounded-xl border-gray-200 hover:bg-gray-50"
              >
                <Settings className="h-5 w-5 mr-2" />
                Guardar Configuración
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {isConnected && (
          <div className="flex gap-3 pt-6 border-t border-gray-200 mt-8">
            <Button
              variant="outline"
              onClick={handleDisconnect}
              className="h-12 px-6 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
            >
              <AlertCircle className="h-5 w-5 mr-2" />
              Desconectar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MercadoPagoConnections;
