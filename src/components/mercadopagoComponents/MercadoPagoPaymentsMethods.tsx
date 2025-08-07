import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import mercadopagosvg from "@/assets/mercado-pago.svg"

const MercadoPagoPaymentsMethods = () => {
  return (
    <Card className="max-w-4xl mx-auto bg-white rounded-3xl p-8 shadow-sm border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300">
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
