import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import mercadopagosvg from "../../../public/mercado-pago.svg"

const MercadoPagoPaymentsMethods = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Métodos de Pago Disponibles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <img
              src={mercadopagosvg}
              alt="Logo Mercado Pago"
              className="w-52 h-auto"
            />
            <p className="text-sm font-medium">Mercado Pago</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MercadoPagoPaymentsMethods;
