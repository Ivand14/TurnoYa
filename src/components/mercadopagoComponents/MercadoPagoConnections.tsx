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
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300">
        {/* Header */}
        <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl shadow-lg shadow-blue-500/25 flex-shrink-0">
            <Link className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent leading-tight">
              Métodos de Conexión
            </h3>
            <p className="text-sm sm:text-base text-gray-500 mt-0.5 sm:mt-1 leading-relaxed">
              Elige cómo conectar tu cuenta de MercadoPago
            </p>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4 sm:space-y-6"
        >
          <TabsList className="grid w-full grid-cols-1 bg-gray-50 p-1 rounded-xl sm:rounded-2xl h-auto">
            <TabsTrigger
              value="oauth"
              className="flex items-center gap-2 rounded-lg sm:rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm h-10 sm:h-12 text-sm sm:text-base"
            >
              <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>OAuth</span>
            </TabsTrigger>
          </TabsList>

          {/* OAuth Tab */}
          <TabsContent value="oauth" className="space-y-4 sm:space-y-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-emerald-900 mb-1 sm:mb-2 text-sm sm:text-base">
                    Método Recomendado
                  </h4>
                  <p className="text-emerald-800 text-xs sm:text-sm leading-relaxed">
                    Conecta tu cuenta de MercadoPago de forma segura sin
                    compartir tus credenciales. Este método es más seguro y
                    fácil de gestionar.
                  </p>
                </div>
              </div>
            </div>

            {isConnected === false ? (
              <div className="space-y-4 sm:space-y-6">
                <div className="text-center p-6 sm:p-8 border-2 border-dashed border-gray-200 rounded-xl sm:rounded-2xl">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl mx-auto mb-3 sm:mb-4 flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                    Conectar con OAuth
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                    Autoriza de forma segura el acceso a tu cuenta de
                    MercadoPago
                  </p>
                  <Button
                    onClick={handleOAuthAuthorization}
                    disabled={isLoading}
                    className="w-full sm:w-auto h-10 sm:h-12 px-4 sm:px-6 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 text-sm sm:text-base"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                    ) : (
                      <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
                    )}
                    <span className="truncate">Conectar con MercadoPago</span>
                  </Button>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 sm:p-6 rounded-xl sm:rounded-2xl">
                  <h4 className="font-semibold text-blue-900 mb-3 sm:mb-4 text-sm sm:text-base">
                    ¿Qué sucede cuando me conecto?
                  </h4>
                  <ul className="text-xs sm:text-sm text-blue-800 space-y-2 sm:space-y-2">
                    <li className="flex items-start gap-2 sm:gap-3">
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-600 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                      <span className="leading-relaxed">
                        Serás redirigido a MercadoPago para autorizar el acceso
                      </span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3">
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-600 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                      <span className="leading-relaxed">
                        No compartimos tus credenciales
                      </span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3">
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-600 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                      <span className="leading-relaxed">
                        Puedes revocar el acceso en cualquier momento
                      </span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3">
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-600 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                      <span className="leading-relaxed">
                        Obtenemos solo los permisos necesarios para procesar
                        pagos
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-emerald-900 text-sm sm:text-base">
                      Cuenta Conectada
                    </h4>
                    <p className="text-emerald-800 text-xs sm:text-sm leading-relaxed">
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
