import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, ExternalLink, Banknote } from "lucide-react";

const MercadoPagoPaymentsMethods = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Métodos de Pago Disponibles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <CreditCard className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <p className="text-sm font-medium">Tarjetas</p>
            <p className="text-xs text-muted-foreground">Visa, Mastercard</p>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <Banknote className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <p className="text-sm font-medium">Efectivo</p>
            <p className="text-xs text-muted-foreground">Rapipago, PagoFácil</p>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <ExternalLink className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <p className="text-sm font-medium">Transferencia</p>
            <p className="text-xs text-muted-foreground">Banco a banco</p>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <CreditCard className="h-8 w-8 mx-auto mb-2 text-orange-600" />
            <p className="text-sm font-medium">Cuotas</p>
            <p className="text-xs text-muted-foreground">Sin interés</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MercadoPagoPaymentsMethods;
