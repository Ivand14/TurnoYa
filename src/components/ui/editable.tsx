import * as Dialog from "@radix-ui/react-dialog";
import { get_services } from "@/apis/services.api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import EditableForm from "../editableForm";
import { Employee } from "@/types/dashboard";
import { Service } from "@/types";
import { toast } from "sonner";
import { Edit3, X } from "lucide-react";

interface editProps {
  service: Service;
  employeesAvailable: Employee[];
  onEdit: (data: Service, serviceId: string) => void;
}

const EditService: React.FC<editProps> = ({
  service,
  employeesAvailable,
  onEdit,
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [serviceId, setServiceId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const fetch = async () => {
    try {
      const responseEmployees = await get_services(service.businessId);
      setEmployees(responseEmployees.data.details);
      setServiceId(service.id);
    } catch (error) {
      console.error("Error fetching services:", error);
      setEmployees(employeesAvailable);
      setServiceId(service.id);
    }
  };

  const handleUpdateService = async (form: Service) => {
    console.log("Updating service:", form);
    try {
      onEdit(form, serviceId);
      toast.success("Cambios guardados correctamente");
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      toast.error("Error al guardar cambios");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button
          onClick={fetch}
          variant="ghost"
          size="sm"
          className="group h-10 w-10 rounded-xl bg-gray-50 p-0 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
        >
          <Edit3 className="h-4 w-4 transition-transform group-hover:scale-110" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[95vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl shadow-2xl border border-gray-100 focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          {/* Header */}
          <div className="relative p-8 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Edit3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <Dialog.Title className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Editar Servicio
                </Dialog.Title>
                <Dialog.Description className="text-gray-500 mt-1">
                  Modifica la información de "{service.name_service}"
                </Dialog.Description>
              </div>
            </div>

            <Dialog.Close asChild>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-6 top-6 h-10 w-10 rounded-xl p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </Button>
            </Dialog.Close>
          </div>

          {/* Content */}
          <div className="p-8 max-h-[80vh] overflow-y-auto">
            <div className="max-w-2xl mx-auto">
              <EditableForm
                service={service}
                employeesAvailable={employeesAvailable}
                onUpdateService={handleUpdateService}
                loading={loading}
              />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default EditService;
