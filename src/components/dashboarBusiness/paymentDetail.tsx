import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  FileText,
  Copy,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { compnay_logged } from "@/context/current_company";

interface PaymentDetailProps {
  paymentId: string;
  note: string;
}

export const PaymentDetails: React.FC<PaymentDetailProps> = ({
  paymentId,
  note,
}) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { company } = compnay_logged();


  const handleCopyPaymentId = async () => {
    try {
      await navigator.clipboard.writeText(paymentId);
      setCopied(true);
      toast({
        title: "¡Copiado!",
        description: "Payment ID copiado al portapapeles",
        duration: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo copiar el Payment ID",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 font-medium">
          <CreditCard className="mr-2 h-4 w-4" />
          Detalles del pago
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-0 shadow-2xl">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-6 pb-4">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  Detalles del pago
                </DialogTitle>
                <Badge variant="secondary" className="mt-1 text-xs">
                  Información de transacción
                </Badge>
              </div>
            </div>

            <DialogDescription className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {company ? "Aquí encontrarás el ID del pago y cualquier nota dejada por el cliente":"Aquí encontrarás el ID del pago y tus notas "}.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          {/* Payment ID Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Info className="h-4 w-4" />
              Payment ID
            </div>
            <div className="group relative">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <code className="text-sm font-mono text-gray-900 dark:text-gray-100 break-all">
                  {paymentId}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyPaymentId}
                  className="ml-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {copied ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Note Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <FileText className="h-4 w-4" />
              Nota del cliente
            </div>
            <div className="min-h-[80px] p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              {note ? (
                <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
                  {note}
                </p>
              ) : (
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm italic">
                    No hay notas disponibles
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Info Banner */}
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Puedes comparar este Payment ID con el proporcionado por el
                cliente para verificar la transacción.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
