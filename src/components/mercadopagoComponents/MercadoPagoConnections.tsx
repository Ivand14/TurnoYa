import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  AlertCircle,
  ExternalLink,
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
}

const MercadoPagoConnections: React.FC<MercadoPagoConnectionsProps> = ({
  isLoading,
  handleOAuthAuthorization,
  isConnected,
}) => {
  const [activeTab, setActiveTab] = useState("oauth");

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

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-1 bg-gray-50 p-1 rounded-2xl">
            <TabsTrigger
              value="oauth"
              className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Shield />
              OAuth
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
                  <h4 className="font-semibold text-emerald-900 mb-2">
                    Método Recomendado
                  </h4>
                  <p className="text-emerald-800 text-sm">
                    Conecta tu cuenta de MercadoPago de forma segura sin
                    compartir tus credenciales. Este método es más seguro y
                    fácil de gestionar.
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
                    Autoriza de forma segura el acceso a tu cuenta de
                    MercadoPago
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
                    <h4 className="font-semibold text-emerald-900">
                      Cuenta Conectada
                    </h4>
                    <p className="text-emerald-800 text-sm">
                      Tu cuenta está conectada y lista para procesar pagos.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MercadoPagoConnections;
