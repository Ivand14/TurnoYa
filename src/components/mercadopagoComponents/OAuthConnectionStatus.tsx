import React from "react";
import {
  AlertCircle,
  Mail,
  Phone,
  User,
  IdCard,
  UserCheck2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { salesmanData } from "@/context/MercadoPagoContext/salesmanContext";
import MercadoPagoAvatar from "./MercadoPagoAvatar";
import Loading from "../loading";

interface OAuthAccountProps {
  oauthAccount: salesmanData;
  handleRevokeAuthorization: () => void;
}

const OAuthConnectionStatus: React.FC<OAuthAccountProps> = ({
  oauthAccount,
  handleRevokeAuthorization,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300">
        {oauthAccount.accountType !== "" ? (
          <>
            {/* Header */}
            <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="flex-shrink-0">
                {oauthAccount.picture_url ? (
                  <MercadoPagoAvatar picture_url={oauthAccount.picture_url} />
                ) : (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center">
                    <UserCheck2 className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent leading-tight">
                  Cuenta Conectada
                </h3>
                <p className="text-sm sm:text-base text-gray-500 mt-0.5 sm:mt-1 leading-relaxed">
                  Información de la cuenta de MercadoPago conectada
                </p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {oauthAccount.phone && (
                <div className="flex items-center gap-3 p-3 sm:p-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs sm:text-sm text-gray-500">
                      Celular
                    </div>
                    <div className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                      {oauthAccount.phone}
                    </div>
                  </div>
                </div>
              )}

              {oauthAccount.email && (
                <div className="flex items-center gap-3 p-3 sm:p-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-50 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs sm:text-sm text-gray-500">
                      Email
                    </div>
                    <div className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                      {oauthAccount.email}
                    </div>
                  </div>
                </div>
              )}

              {oauthAccount.brand_name && (
                <div className="flex items-center gap-3 p-3 sm:p-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-50 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs sm:text-sm text-gray-500">
                      Nombre
                    </div>
                    <div className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                      {oauthAccount.brand_name}
                    </div>
                  </div>
                </div>
              )}

              {oauthAccount.identification && (
                <div className="flex items-center gap-3 p-3 sm:p-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-50 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <IdCard className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs sm:text-sm text-gray-500">
                      Identificación
                    </div>
                    <div className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                      {oauthAccount.identification.type}:{" "}
                      {oauthAccount.identification.number}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRevokeAuthorization}
                className="w-full sm:w-auto h-10 sm:h-10 px-4 rounded-lg sm:rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200 text-sm sm:text-base"
              >
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">Revocar Autorización</span>
              </Button>
            </div>
          </>
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
};

export default OAuthConnectionStatus;
