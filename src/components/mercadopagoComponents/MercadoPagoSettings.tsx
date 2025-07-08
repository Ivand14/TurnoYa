import React, { useState, useEffect } from "react";

import { toast } from "sonner";
import MercadoPagoHeader from "./MercadoPagoHeader";
import OAuthConnectionStatus from "./OAuthConnectionStatus";
import MercadoPagoConnections from "./MercadoPagoConnections";
import MercadoPagoDocumentation from "./MercadoPagoDocumentation";
import MercadoPagoPaymentsMethods from "./MercadoPagoPaymentsMethods";
import { compnay_logged } from "@/context/current_company";
import {
  salesmanContext,
  salesmanData,
} from "@/context/MercadoPagoContext/salesmanContext";

interface MercadoPagoSettingsProps {
  businessId: string;
}

const MercadoPagoSettings: React.FC<MercadoPagoSettingsProps> = ({
  businessId,
}) => {
  const [accessToken, setAccessToken] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [isTestMode, setIsTestMode] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [oauthAccount, setOauthAccount] = useState<salesmanData | null>(null);
  const { company } = compnay_logged();
  const {
    fetchAccessTokenData,
    brand_name,
    identification,
    picture_url,
    email,
    accountType,
    phone,
  } = salesmanContext();

  const fetchData = () => {
    fetchAccessTokenData(businessId);
    setOauthAccount({
      brand_name,
      identification,
      picture_url,
      email,
      accountType,
      phone,
    });
  };

  useEffect(() => {
    company?.mercado_pago_connect == true
      ? setIsConnected(true)
      : setIsConnected(false);
    fetchData();
  }, [businessId]);

  console.log(isConnected);

  const handleOAuthAuthorization = () => {
    const baseUrl =
      (window.location.href = `https://turnosya-backend.onrender.com/mercado_pago?businessId=${businessId}`);
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
      {isConnected && (
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
