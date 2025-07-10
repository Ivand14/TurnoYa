import React from "react";
import {
  AlertCircle,
  UserCheck,
  Mail,
  Phone,
  User,
  IdCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { salesmanData } from "@/context/MercadoPagoContext/salesmanContext";
import MercadoPagoAvatar from "./MercadoPagoAvatar";

interface OAuthAccountProps {
  oauthAccount: salesmanData;
  handleRevokeAuthorization: () => void;
}

const OAuthConnectionStatus: React.FC<OAuthAccountProps> = ({
  oauthAccount,
  handleRevokeAuthorization,
}) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br rounded-2xl shadow-lg shadow-emerald-500/25">
            {!oauthAccount.picture_url.startsWith("https") ? (
              <UserCheck className="w-7 h-7 text-white" />
            ) : (
              <MercadoPagoAvatar picture_url={oauthAccount.picture_url} />
            )}
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Cuenta Conectada
            </h3>
            <p className="text-gray-500 mt-1">
              Información de la cuenta de MercadoPago conectada
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Phone className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Celular</div>
              <div className="font-semibold text-gray-900">
                {oauthAccount.phone}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Email</div>
              <div className="font-semibold text-gray-900">
                {oauthAccount.email}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Nombre</div>
              <div className="font-semibold text-gray-900">
                {oauthAccount.brand_name}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
              <IdCard className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Identificación</div>
              <div className="font-semibold text-gray-900">
                {oauthAccount.identification.type}:{" "}
                {oauthAccount.identification.number}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRevokeAuthorization}
            className="h-10 px-4 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Revocar Autorización
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OAuthConnectionStatus;
