import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";


interface MpHeaderProps{
    isConnected:boolean
}

const MercadoPagoHeader:React.FC<MpHeaderProps> = ( isConnected ) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl">
                Configuración de MercadoPago
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Conecta tu cuenta de MercadoPago para recibir pagos
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Conectado
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="bg-orange-100 text-orange-800"
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                Desconectado
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default MercadoPagoHeader;
