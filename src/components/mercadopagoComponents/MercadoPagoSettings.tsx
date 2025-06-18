import React, { useState, useEffect } from "react";

import { toast } from "sonner";
import MercadoPagoHeader from "./MercadoPagoHeader";
import OAuthConnectionStatus from "./OAuthConnectionStatus";
import MercadoPagoConnections from "./MercadoPagoConnections";
import MercadoPagoDocumentation from "./MercadoPagoDocumentation";
import MercadoPagoPaymentsMethods from "./MercadoPagoPaymentsMethods";

interface OAuthAccount {
  user_id: string;
  nickname: string;
  email: string;
  first_name: string;
  last_name: string;
  site_id: string;
  country_id: string;
}

interface MercadoPagoSettingsProps {
  businessId: string;
}

const MercadoPagoSettings: React.FC<MercadoPagoSettingsProps> = ({businessId}) => {
  const [accessToken, setAccessToken] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [isTestMode, setIsTestMode] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [oauthAccount, setOauthAccount] = useState<OAuthAccount | null>(null);

  // OAuth Configuration
  const OAUTH_CONFIG = {
    client_id: "YOUR_APP_ID", // En producción esto vendría de las variables de entorno
    redirect_uri: `${window.location.origin}/business-dashboard`,
    scope: "read write",
    response_type: "code",
  };

  useEffect(() => {
    // Verificar si hay un código de autorización en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("code");
    const state = urlParams.get("state");

    if (authCode && state === "mp_oauth") {
      handleOAuthCallback(authCode);
      // Limpiar la URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleOAuthAuthorization = () => {
    const baseUrl = (window.location.href = `https://turnosya-backend.onrender.com/mercado_pago?businessId=${businessId}`);
  };

  const handleOAuthCallback = async (authCode: string) => {
    setIsLoading(true);

    try {
      // En un entorno real, esto se haría a través de una Edge Function en Supabase
      console.log("Procesando código de autorización:", authCode);

      // Simular intercambio de código por tokens
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockAccount: OAuthAccount = {
        user_id: "123456789",
        nickname: "mi_tienda_oauth",
        email: "tienda@ejemplo.com",
        first_name: "Juan",
        last_name: "Pérez",
        site_id: "MLA",
        country_id: "AR",
      };

      setOauthAccount(mockAccount);
      setIsConnected(true);
      setAccessToken("APP_USR-123456789-oauth-token");
      setPublicKey("APP_USR-123456789-public-key");
      toast.success("¡Autorización completada exitosamente!");
    } catch (error) {
      console.error("Error en OAuth callback:", error);
      toast.error("Error al procesar la autorización");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    if (!accessToken) {
      toast.error("Por favor conecta tu cuenta o ingresa tu Access Token");
      return;
    }

    setIsLoading(true);

    // Simular prueba de conexión
    setTimeout(() => {
      setIsConnected(true);
      setIsLoading(false);
      toast.success("Conexión exitosa con MercadoPago");
    }, 2000);
  };

  const handleSaveSettings = () => {
    if (!accessToken) {
      toast.error("Por favor completa los campos obligatorios");
      return;
    }

    // Aquí se guardarían las configuraciones
    toast.success("Configuración guardada correctamente");
  };

  const handleDisconnect = () => {
    setAccessToken("");
    setPublicKey("");
    setIsConnected(false);
    setOauthAccount(null);
    toast.success("Desconectado de MercadoPago");
  };

  const handleRevokeAuthorization = () => {
    // En un entorno real, esto revocaría los permisos en MercadoPago
    setOauthAccount(null);
    setIsConnected(false);
    setAccessToken("");
    setPublicKey("");
    toast.success("Autorización revocada correctamente");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <MercadoPagoHeader isConnected={isConnected} />
      {/* OAuth Connection Status */}
      {oauthAccount && (
        <OAuthConnectionStatus
          oauthAccount={oauthAccount}
          handleRevokeAuthorization={handleRevokeAuthorization}
        />
      )}

      {/* Connection Methods */}
      <MercadoPagoConnections
        oauthAccount={oauthAccount}
        isLoading={isLoading}
        handleOAuthAuthorization={handleOAuthAuthorization}
        isTestMode={isTestMode}
        setIsTestMode={setIsTestMode}
        accessToken={accessToken}
        setAccessToken={setAccessToken}
        publicKey={publicKey}
        setPublicKey={setPublicKey}
        handleTestConnection={handleTestConnection}
        handleSaveSettings={handleSaveSettings}
        isConnected={isConnected}
        handleDisconnect={handleDisconnect}
      />

      {/* Payment Methods Preview */}
      {isConnected && <MercadoPagoPaymentsMethods />}

      {/* Documentation Links */}
      <MercadoPagoDocumentation />
    </div>
  );
};

export default MercadoPagoSettings;
