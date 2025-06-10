import { create } from "zustand";
import { Employee } from "@/types/dashboard";
import {
  create_employee,
  delete_employee,
  get_all_employees,
  patch_employee,
} from "@/apis/employee_schedule.apis";

interface EmployeeContext {
  allEmployees: Employee[];
  employeeById: Employee | null;
  loading: boolean;
  error: string | null;
  newEmployee: Employee;
  setNewEmployee: (field: string, value: string) => void;
  handleEmployeeFormChange: (field: string, value: string) => void;
  handleAddEmployee: () => Promise<void>;
  fetchGetAllEmployees: (businessId: string) => Promise<void>;
  fetchGetEmployeeById: (id: string) => Promise<void>;
  fetchPatchEmployee: (id: string, status: string) => Promise<void>;
  fetchDeleteEmployee: (id: string) => Promise<void>;
}

export const useEmployeeContext = create<EmployeeContext>((set, get) => ({
  allEmployees: [],
  employeeById: null,
  loading: false,
  error: null,
  newEmployee: {
    name: "",
    email: "",
    phone: "",
    position: "",
    status: "active",
    businessId: "",
  },

  // ✅ Actualiza el formulario del empleado
  setNewEmployee: (field, value) =>
    set((state) => ({
      newEmployee: { ...state.newEmployee, [field]: value },
    })),

  handleEmployeeFormChange: (field, value) =>
    set((state) => ({
      newEmployee: { ...state.newEmployee, [field]: value },
    })),

  // ✅ Agregar nuevo empleado
  handleAddEmployee: async () => {
    set({ loading: true, error: null });
    try {
      const response = await create_employee(get().newEmployee);
      if (response?.data) {
        set((state) => ({
          allEmployees: [...state.allEmployees, response.data.details],
          loading: false,
          newEmployee: {
            name: "",
            email: "",
            phone: "",
            position: "",
            status: "active",
            businessId: "",
          }, // ✅ Reset después de creación
        }));
      } else {
        set({
          loading: false,
          error: response?.data?.message || "Error creando empleado",
        });
      }
    } catch (error) {
      console.error("Error creando empleado:", error);
      set({ loading: false, error: "Fallo al crear empleado" });
    }
  },

  // ✅ Obtener todos los empleados de un negocio
  fetchGetAllEmployees: async (businessId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await get_all_employees(businessId);
      console.log(response);
      if (response?.data) {
        set({ allEmployees: response.data.details, loading: false });
      } else {
        set({
          allEmployees: [],
          loading: false,
          error: "Error obteniendo empleados",
        });
      }
    } catch (error) {
      console.error("Error obteniendo empleados:", error);
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  },

  // ✅ Obtener detalles de un empleado por ID
  fetchGetEmployeeById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await get_all_employees(id); // Verifica si esta API devuelve solo un empleado
      if (response?.data) {
        set({ employeeById: response.data.details, loading: false });
      } else {
        set({
          employeeById: null,
          loading: false,
          error: "Error obteniendo empleado por ID",
        });
      }
    } catch (error) {
      console.error("Error obteniendo empleado por ID:", error);
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  },

  // ✅ Actualizar estado de un empleado (Activo/Inactivo)
  fetchPatchEmployee: async (id: string, status: string) => {
    set({ loading: true, error: null });

    try {
      const response = await patch_employee(id, status);
      if (response?.data) {
        set((state) => ({
          allEmployees: state.allEmployees.map((employee) =>
            employee.id === id
              ? { ...employee, status: response.data.status }
              : employee
          ),
        }));
      } else {
        set({
          error: response?.data?.message || "Error actualizando empleado",
        });
      }
    } catch (error) {
      console.error("Error actualizando empleado:", error);
      set({ error: "Fallo al actualizar empleado" });
    }
  },

  fetchDeleteEmployee: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const deleteResponse = await delete_employee(id);
      if (deleteResponse?.data) {
        set((state) => ({
          allEmployees: state.allEmployees.filter((emp) => emp.id !== id),
          loading: false,
          error: null,
        }));
      }
    } catch (error) {
      console.error("Error obteniendo empleado por ID:", error);
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  },
}));
