import * as Dialog from "@radix-ui/react-dialog";

import {
  get_all_employees,
  get_employee_id
} from "@/apis/employee_schedule.apis";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Cross2Icon } from "@radix-ui/react-icons";
import { EditableForm } from "../editableForm";
import { Employee } from "@/types/dashboard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Service } from "@/types";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "./textarea";
import { get_services } from "@/apis/services.api";

interface editProps {
    service: Service;
    employeesAvailable: Employee[];
}

const EditService: React.FC<editProps> = ({ service, employeesAvailable }) => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [employeeInService, setEmployeeInService] = useState<Employee[]>([]);
    const [serviceId, setServiceId] = useState<string>("");

    const fetch = async () => {
        const responseEmployees = await get_services(service.businessId);
        setEmployees(responseEmployees.data.details);
        setServiceId(service.id);
    };

    const matchService = async () => {
        if (!serviceId) return;

        const employeeInServ = employees.find((emp) => emp.id === serviceId);

        if (!employeeInServ) {
        return;
        }

        const employeePromises =
        employeeInServ.allowedEmployeeIds?.map(async (id) => {
            const employeeById = await get_employee_id(id);
            return employeeById.data.details;
        }) || [];

        const employeesData = await Promise.all(employeePromises);
        setEmployeeInService(employeesData.flat());
    };

    useEffect(() => {
        if (employees.length > 0 && serviceId) {
        matchService();
        }
    }, [employees, serviceId]);


    const unavailableEmployees = employeesAvailable.filter(
        (empAv) => !employeeInService.some((emp) => emp.id === empAv.id)
    );

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
                employeesInService ={employeeInService}
                unavailableEmployees={unavailableEmployees}
            />

            <div className="mt-4 flex justify-end gap-2">
                <Dialog.Close asChild>
                <Button className="rounded-md border bg-white border-gray-300 px-4 py-2 text-sm text-gray-600 transition hover:bg-slate-100 focus:outline-none">
                    Cancelar
                </Button>
                </Dialog.Close>
                <Button className="w-auto">Guardar cambios</Button>
            </div>

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
