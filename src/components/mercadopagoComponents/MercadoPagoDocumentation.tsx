import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, ExternalLink, Shield } from "lucide-react";

const MercadoPagoDocumentation = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recursos y Documentación</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/landing"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors"
          >
            <ExternalLink className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium">Checkout Pro</p>
              <p className="text-sm text-muted-foreground">Documentación API</p>
            </div>
          </a>

          <a
            href="https://www.mercadopago.com.ar/developers/es/docs/security/oauth/introduction"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors"
          >
            <Shield className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium">OAuth</p>
              <p className="text-sm text-muted-foreground">
                Autorización segura
              </p>
            </div>
          </a>

          <a
            href="https://www.mercadopago.com.ar/developers/panel"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors"
          >
            <Settings className="h-5 w-5 text-purple-600" />
            <div>
              <p className="font-medium">Panel</p>
              <p className="text-sm text-muted-foreground">
                Gestiona credenciales
              </p>
            </div>
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default MercadoPagoDocumentation;
