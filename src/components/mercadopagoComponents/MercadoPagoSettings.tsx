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
import { reauthenticateWithCredential } from "firebase/auth";

interface MercadoPagoSettingsProps {
  businessId: string;
  oauthAccount: salesmanData;
  setOauthAccount: (data: salesmanData) => void;
}

const MercadoPagoSettings: React.FC<MercadoPagoSettingsProps> = ({
  businessId,
  oauthAccount,
  setOauthAccount,
}) => {
  const [accessToken, setAccessToken] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [isTestMode, setIsTestMode] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { company } = compnay_logged();
  const { fetchDeleteMpAccount, clearSalesman } = salesmanContext();
  const mpAccount = localStorage.getItem("salesman-store");

  const connected = () => {
    const raw = localStorage.getItem("company");
    const companyData = raw ? JSON.parse(raw) : null;

    if (!companyData) return;

    if (mpAccount) {
      const updated = {
        ...companyData,
        mercado_pago_connect: true,
      };
      localStorage.setItem("company", JSON.stringify(updated));
      setIsConnected(true);
    }
  };

  useEffect(() => {
    connected();
  }, [mpAccount]);

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

  const handleRevokeAuthorization = async () => {
    await fetchDeleteMpAccount(businessId);
    setAccessToken("");
    setPublicKey("");
    setIsConnected(false);
    setOauthAccount(null);
    clearSalesman();
    localStorage.removeItem("salesman-store");
    const companyUpdate = localStorage.getItem("company");
    if (companyUpdate) {
      const companyData = JSON.parse(companyUpdate);
      const update = {
        ...companyData,
        mercado_pago_connect: false,
      };
      localStorage.setItem("company", JSON.stringify(update));
    }
    toast.success("Desconectado de MercadoPago");
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
      />

      {/* Payment Methods Preview */}
      {isConnected && <MercadoPagoPaymentsMethods />}

      {/* Documentation Links */}
      <MercadoPagoDocumentation />
    </div>
  );
};

export default MercadoPagoSettings;
