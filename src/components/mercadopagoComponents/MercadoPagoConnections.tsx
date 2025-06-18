import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface OAuthAccount {
  user_id: string;
  nickname: string;
  email: string;
  first_name: string;
  last_name: string;
  site_id: string;
  country_id: string;
}

interface MercadoPagoConnectionsProps {
  oauthAccount: OAuthAccount;
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Métodos de Conexión
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="oauth" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              OAuth (Recomendado)
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Manual
            </TabsTrigger>
          </TabsList>

          {/* OAuth Tab */}
          <TabsContent value="oauth" className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Método Recomendado:</strong> Conecta tu cuenta de
                MercadoPago de forma segura sin compartir tus credenciales. Este
                método es más seguro y fácil de gestionar.
              </AlertDescription>
            </Alert>

            {!oauthAccount ? (
              <div className="space-y-4">
                <div className="text-center p-6 border-2 border-dashed rounded-lg">
                  <Shield className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Conectar con OAuth
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Autoriza de forma segura el acceso a tu cuenta de
                    MercadoPago
                  </p>
                  <Button
                    onClick={handleOAuthAuthorization}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <ExternalLink className="h-4 w-4" />
                    )}
                    Conectar con MercadoPago
                  </Button>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    ¿Qué sucede cuando me conecto?
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>
                      • Serás redirigido a MercadoPago para autorizar el acceso
                    </li>
                    <li>• No compartimos tus credenciales</li>
                    <li>• Puedes revocar el acceso en cualquier momento</li>
                    <li>
                      • Obtenemos solo los permisos necesarios para procesar
                      pagos
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Tu cuenta está conectada y lista para procesar pagos.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          {/* Manual Tab */}
          <TabsContent value="manual" className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Este método requiere que ingreses manualmente tus credenciales.
                Recomendamos usar OAuth para mayor seguridad.
              </AlertDescription>
            </Alert>

            {/* Test Mode Toggle */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <TestTube className="h-5 w-5 text-gray-600" />
                <div>
                  <Label className="text-base font-medium">
                    Modo de Prueba
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Usa credenciales de prueba para hacer tests
                  </p>
                </div>
              </div>
              <Switch checked={isTestMode} onCheckedChange={setIsTestMode} />
            </div>

            {/* Access Token */}
            <div className="space-y-2">
              <Label htmlFor="access-token" className="flex items-center gap-2">
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
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowAccessToken(!showAccessToken)}
                >
                  {showAccessToken ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Tu Access Token privado para procesar pagos
              </p>
            </div>

            {/* Public Key */}
            <div className="space-y-2">
              <Label htmlFor="public-key" className="flex items-center gap-2">
                <Banknote className="h-4 w-4" />
                Public Key {isTestMode ? "(TEST)" : "(PRODUCCIÓN)"}
              </Label>
              <Input
                id="public-key"
                placeholder={isTestMode ? "TEST-..." : "APP_USR-..."}
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Tu Public Key para inicializar el checkout (opcional)
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleTestConnection}
                disabled={isLoading || !accessToken}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                Probar Conexión
              </Button>

              <Button
                variant="outline"
                onClick={handleSaveSettings}
                disabled={!accessToken}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Guardar Configuración
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {isConnected && (
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="destructive"
              onClick={handleDisconnect}
              className="flex items-center gap-2"
            >
              <AlertCircle className="h-4 w-4" />
              Desconectar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MercadoPagoConnections;
