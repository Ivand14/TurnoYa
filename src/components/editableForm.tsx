import React, { useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Employee } from "@/types/dashboard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Service } from "@/types";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface EditableFormProps {
    service: Service;
    employeesInService: Employee[];
    unavailableEmployees:Employee[]
    }

    export const EditableForm: React.FC<EditableFormProps> = ({
    service,
    employeesInService,
    unavailableEmployees
    }) => {
    const [updateService, setUpdateService] = useState(() => ({
        name: service.name_service,
        description: service.description,
        duration: service.duration || 30,
        price: service.price || 0,
        capacity: service.capacity || 0,
        requiresSpecificEmployee: service.requiresSpecificEmployee || false,
        allowedEmployeeIds: service.allowedEmployeeIds || []
    }));

    const handleEmployeeToggle = (id: string, checked: boolean) => {
        setUpdateService((prev) => ({
        ...prev,
        allowedEmployeeIds: checked
            ? [...prev.allowedEmployeeIds, id]
            : prev.allowedEmployeeIds.filter((empId) => empId !== id)
        }));
    };

    

    console.log(updateService);

    return (
        <div className="space-y-4">
        <div>
            <Label
            className="block text-sm font-medium text-gray-700"
            htmlFor="name"
            >
            Nombre
            </Label>
            <Input
            id="name"
            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            defaultValue={updateService.name}
            value={updateService.name}
            onChange={(e) => setUpdateService((prev) => ({
                ...prev,
                name: e.target.value
            }))}
            />
        </div>

        <div>
            <Label
            className="block text-sm font-medium text-gray-700"
            htmlFor="description"
            >
            Descripción
            </Label>
            <Textarea
            id="description"
            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={3}
            defaultValue={updateService.description}
            value={updateService.description}
            onChange={(e) => setUpdateService((prev) =>  ({
                ...prev,
                description:e.target.value}))}
            />
        </div>

        <div>
            <Label
            className="block text-sm font-medium text-gray-700"
            htmlFor="price"
            >
            Precio
            </Label>
            <Input
            id="price"
            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            defaultValue={updateService.price}
            value={updateService.price}
            onChange={(e) => setUpdateService((prev) =>  ({
                ...prev,
                price:parseInt(e.target.value)}))}
            />
        </div>

        <div className="flex items-center space-x-2">
            <Switch
            id="requiresSpecificEmployee"
            checked={updateService.requiresSpecificEmployee}
            onCheckedChange={(checked) =>
                setUpdateService((prev) => ({
                ...prev,
                requiresSpecificEmployee: checked,
                allowedEmployeeIds: checked ? prev.allowedEmployeeIds : []
                }))
            }
            />

            <Label htmlFor="requiresSpecificEmployee" className="block text-sm font-medium text-gray-700">
            Requiere empleados específicos
            </Label>
        </div>

        {updateService.requiresSpecificEmployee ? (
            <div className="grid gap-2">
            <Label className="block text-sm font-medium text-gray-700">Empleados que pueden realizar este servicio:</Label>
            <div className="grid  gap-2">
                {employeesInService.map((employee) => (
                <div key={employee.id} className="flex items-center space-x-2">
                    <Checkbox
                    id={`employee-${employee.id}`}
                    checked={updateService.allowedEmployeeIds.includes(employee.id)}
                    onCheckedChange={(checked) =>
                        handleEmployeeToggle(employee.id, checked as boolean)
                    }
                    />
                    <Label htmlFor={`employee-${employee.id}`} className="text-sm">
                    {employee.name} - {employee.position}
                    </Label>
                </div>
                ))}
            </div>
            </div>
        ) : (
            <div>
            <Label
                className="block text-sm font-medium text-gray-700"
                htmlFor="capacity"
            >
                Cantidad de turnos
            </Label>
            <Input
                id="capacity"
                className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                defaultValue={updateService.capacity}
                value={updateService.capacity}
                onChange={(e) => setUpdateService((prev) => ({
                    ...prev,
                    capacity: parseInt(e.target.value)
                }))}
            />
            </div>
        )}
        {
            updateService.requiresSpecificEmployee && (
                <div className="grid gap-2">
                <Label className="block text-sm font-medium text-gray-700">
                    {unavailableEmployees.length > 0 ?
                        "Empleados Disponibles:"
                        :
                        "No hay empleados disponibles"
                    }
                </Label>
                
                <div className="grid  gap-2">
                    {unavailableEmployees.map((employee) => (
                    <div key={employee.id} className="flex items-center space-x-2">
                        <Checkbox
                        id={`employee-${employee.id}`}
                        checked={updateService.allowedEmployeeIds.includes(employee.id)}
                        onCheckedChange={(checked) =>
                            handleEmployeeToggle(employee.id, checked as boolean)
                        }
                        />
                        <Label htmlFor={`employee-${employee.id}`} className="text-sm">
                        {employee.name} - {employee.position}
                        </Label>
                    </div>
                    ))}
                </div>
            </div>
            )
        }
        </div>
    );
    };
