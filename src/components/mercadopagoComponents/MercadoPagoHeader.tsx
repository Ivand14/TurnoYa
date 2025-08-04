import { CreditCard, CheckCircle, AlertCircle } from "lucide-react";

interface MpHeaderProps {
  isConnected: boolean;
}

const MercadoPagoHeader: React.FC<MpHeaderProps> = ({ isConnected }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl shadow-lg shadow-blue-500/25 flex-shrink-0">
              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent leading-tight">
                Configuración de MercadoPago
              </h3>
              <p className="text-sm sm:text-base text-gray-500 mt-0.5 sm:mt-1 leading-relaxed">
                Conecta tu cuenta de MercadoPago para recibir pagos
              </p>
            </div>
          </div>

          <div className="flex items-center justify-start sm:justify-end">
            {isConnected ? (
              <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-50 rounded-full border border-emerald-200 flex-shrink-0">
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                <span className="text-xs sm:text-sm font-medium text-emerald-700 whitespace-nowrap">
                  Conectado
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-50 rounded-full border border-orange-200 flex-shrink-0">
                <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600" />
                <span className="text-xs sm:text-sm font-medium text-orange-700 whitespace-nowrap">
                  Desconectado
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MercadoPagoHeader;
