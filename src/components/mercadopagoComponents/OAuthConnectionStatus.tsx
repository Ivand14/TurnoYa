import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { salesmanData } from "@/context/MercadoPagoContext/salesmanContext";



interface OAuthAccountProps {
  oauthAccount: salesmanData
  handleRevokeAuthorization: () => void
}




const OAuthConnectionStatus: React.FC<OAuthAccountProps> = ({oauthAccount,handleRevokeAuthorization}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-green-600" />
          Cuenta Conectada
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Celular</Label>
            <p className="text-sm text-muted-foreground">
              {oauthAccount.phone}
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium">Email</Label>
            <p className="text-sm text-muted-foreground">
              {oauthAccount.email}
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium">Nombre</Label>
            <p className="text-sm text-muted-foreground">
              {oauthAccount.brand_name}
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium">Identificacion</Label>
            <p className="text-sm text-muted-foreground">
              {oauthAccount.identification.type}:{oauthAccount.identification.number}
            </p>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleRevokeAuthorization}
            className="flex items-center gap-2"
          >
            <AlertCircle className="h-4 w-4" />
            Revocar Autorización
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OAuthConnectionStatus;
