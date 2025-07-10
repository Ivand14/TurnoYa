import { CreditCard, CheckCircle, AlertCircle } from "lucide-react";

interface MpHeaderProps {
  isConnected: boolean;
}

const MercadoPagoHeader: React.FC<MpHeaderProps> = ({ isConnected }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/25">
              <CreditCard className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Configuración de MercadoPago
              </h3>
              <p className="text-gray-500 mt-1">
                Conecta tu cuenta de MercadoPago para recibir pagos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isConnected ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-200">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">
                  Conectado
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full border border-orange-200">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-700">
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
