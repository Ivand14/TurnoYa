import * as Dialog from "@radix-ui/react-dialog";

import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Employee } from "@/types/dashboard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Service } from "@/types";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { get_employee_id } from "@/apis/employee_schedule.apis";

interface EditableFormProps {
  service: Service;
  employeesAvailable: Employee[];
  onUpdateService: (form: Service) => void;
  loading: boolean;
}

const EditableForm: React.FC<EditableFormProps> = ({
  service,
  employeesAvailable,
  onUpdateService,
  loading,
}) => {
  const [updateService, setUpdateService] = useState(() => ({
    name_service: service.name_service,
    description: service.description,
    duration: service.duration || 30,
    price: service.price || 0,
    capacity: service.capacity || 0,
    requiresSpecificEmployee: service.requiresSpecificEmployee || false,
    allowedEmployeeIds: service.allowedEmployeeIds || [],
    businessId: service.businessId,
    active: service.active,
  }));
  const [employeeInService, setEmployeeInService] = useState<Employee[]>([]);
  const [othersEmployeeInService, setOthersEmployeeInService] = useState<
    Employee[]
  >([]);

  const handleEmployeeToggle = (id: string, checked: boolean) => {
    setUpdateService((prev) => ({
      ...prev,
      allowedEmployeeIds: checked
        ? [...prev.allowedEmployeeIds, id]
        : prev.allowedEmployeeIds.filter((empId) => empId !== id),
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onUpdateService(updateService);
  };

  const employData = async () => {
    const employeePromises = updateService.allowedEmployeeIds.map((empId) =>
      get_employee_id(empId)
    );
    const responses = await Promise.all(employeePromises);
    const employeesFetched = responses.map((res) => res.data.details);

    setEmployeeInService(employeesFetched);

    // Filtrar empleados disponibles fuera del loop
    const isAv = employeesAvailable.filter(
      (empAv) => !employeesFetched.some((emp) => emp.id === empAv.id)
    );

    setOthersEmployeeInService(isAv);
  };

  useEffect(() => {
    employData();
  }, []);

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-6">
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
            placeholder={updateService.name_service}
            value={updateService.name_service}
            onChange={(e) =>
              setUpdateService((prev) => ({
                ...prev,
                name_service: e.target.value,
              }))
            }
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
            placeholder={updateService.description}
            value={updateService.description}
            onChange={(e) =>
              setUpdateService((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
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
            placeholder={updateService.price.toString()}
            value={updateService.price}
            onChange={(e) =>
              setUpdateService((prev) => ({
                ...prev,
                price: Number(e.target.value),
              }))
            }
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
                allowedEmployeeIds: checked ? prev.allowedEmployeeIds : [],
              }))
            }
          />

          <Label
            htmlFor="requiresSpecificEmployee"
            className="block text-sm font-medium text-gray-700"
          >
            Requiere empleados específicos
          </Label>
        </div>

        {updateService.requiresSpecificEmployee && (
          <>
            <div className="grid gap-2">
              <Label className="block text-sm font-medium text-gray-700">
                Empleados autorizados:
              </Label>
              <div className="grid gap-2">
                {employeeInService.map((employee) => (
                  <div
                    key={employee.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={employee.id}
                      checked={updateService.allowedEmployeeIds.includes(
                        employee.id
                      )}
                      onCheckedChange={(checked) =>
                        handleEmployeeToggle(employee.id, checked as boolean)
                      }
                    />
                    <Label htmlFor={employee.id} className="text-sm">
                      {employee.name} - {employee.position}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label className="block text-sm font-medium text-gray-700">
                {othersEmployeeInService.length > 0
                  ? "Empleados disponibles:"
                  : "No hay empleados disponibles"}
              </Label>
              {othersEmployeeInService.length > 0 && (
                <div className="grid gap-2">
                  {othersEmployeeInService.map((employee) => (
                    <div
                      key={employee.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`employee-${employee.id}`}
                        checked={updateService.allowedEmployeeIds.includes(
                          employee.id
                        )}
                        onCheckedChange={(checked) =>
                          handleEmployeeToggle(employee.id, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`employee-${employee.id}`}
                        className="text-sm"
                      >
                        {employee.name} - {employee.position}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {!updateService.requiresSpecificEmployee && (
          <Input
            id="capacity"
            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder={updateService.capacity.toString()}
            type="number"
            value={
              updateService.requiresSpecificEmployee
                ? 0
                : updateService.capacity
            } 
            onChange={(e) =>
              setUpdateService((prev) => ({
                ...prev,
                capacity: prev.requiresSpecificEmployee
                  ? 0
                  : Number(e.target.value),
              }))
            }
          />
        )}

        <div className="mt-4 flex justify-end gap-2">
          <Dialog.Close asChild>
            <Button className="rounded-md border bg-white border-gray-300 px-4 py-2 text-sm text-gray-600 transition hover:bg-slate-100 focus:outline-none">
              Cancelar
            </Button>
          </Dialog.Close>
          <Button type="submit">Guardar cambios</Button>
        </div>
      </form>
    </div>
  );
};

export default EditableForm;
