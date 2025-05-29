import * as Dialog from "@radix-ui/react-dialog";

import { get_services, patchService } from "@/apis/services.api";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";
import EditableForm from './../editableForm';
import { Employee } from "@/types/dashboard";
import { Service } from "@/types";
import {
    get_employee_id
} from "@/apis/employee_schedule.apis";
import { toast } from "sonner";

interface editProps {
    service: Service;
    employeesAvailable: Employee[];
}

const EditService: React.FC<editProps> = ({ service, employeesAvailable }) => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [serviceId, setServiceId] = useState<string>("");
    const[loading,setLoading] = useState<boolean>(true)


    const fetch = async () => {
        const responseEmployees = await get_services(service.businessId);
        setEmployees(responseEmployees.data.details);
        setServiceId(service.id);
    };

    const handleUpdateService = async (form: Service) => {;
    try {
        const responseUpdate = await patchService(form, serviceId);
        if (responseUpdate?.data?.status === 200) {
            setLoading(true)
            toast.success("Cambios guardados");
        }
        setLoading(false);
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
            className="flex items-center gap-2 rounded-md bg-gray-100 p-2 text-sm font-medium text-gray-600 transition hover:bg-gray-200 hover:text-gray-800 focus-visible:outline-none"
            >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M12.146 1.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1 0 .708L11.707 6H10V4.293l2.146-2.147zM9 5h1v1h1v1h1v1h1v5a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6zm0 1H3v5h6V6z" />
            </svg>
            Editar
            </Button>
        </Dialog.Trigger>
        <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
            <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl focus:outline-none">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
                Editar Servicio
            </Dialog.Title>
            <Dialog.Description className="mb-4 text-sm text-gray-600">
                Modifica la información de tu servicio.
            </Dialog.Description>
            
            <EditableForm
                service={service}
                employeesAvailable={employeesAvailable}
                onUpdateService={handleUpdateService}
                loading={loading}
            />

            <Dialog.Close asChild>
                <button
                className="absolute right-4 top-4 rounded-full p-1 text-gray-600 transition hover:bg-gray-200 focus:outline-none"
                aria-label="Cerrar"
                >
                <Cross2Icon />
                </button>
            </Dialog.Close>
            </Dialog.Content>
        </Dialog.Portal>
        </Dialog.Root>
    );
};

export default EditService;
