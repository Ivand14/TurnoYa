import { create_employee, get_all_employees, patch_employee } from '@/apis/employee_schedule.apis';
import { Employee } from '@/types/dashboard';
import {create} from 'zustand';


interface EmployeeContext {
    allEmployees: Employee[];
    employeeById: Employee | null;
    loading: boolean;
    error: string | null;
    fetchCreateEmployee: (employee: Employee) => Promise<void>;
    fetchGetAllEmployees: (businessId: string) => Promise<void>;
    fetchGetEmployeeById: (id: string) => Promise<void>;
    fetchPatchEmployee: (id: string, status: string) => Promise<void>;
}

export const useEmployeeContext = create<EmployeeContext>((set) => ({
    allEmployees: [],
    employeeById: null,
    loading: false,
    error: null,

    fetchCreateEmployee: async(employee:Employee) => {
        set({ loading: true, error: null });
        try {
            const responseCreateEmployee = await create_employee(employee);
            if(responseCreateEmployee?.data){
                set((state) => ({
                    allEmployees: [...state.allEmployees, responseCreateEmployee.data.details],
                    loading: false,
                    error: null
                }));
            }else {
                set({
                    loading: false,
                    error: responseCreateEmployee?.data?.message || 'Error creating employee',
                    allEmployees: []
                });
            }
        } catch (error) {
            console.error("Error creating employee:", error);
            set({ error: "Failed to create employee", loading: false });
            
        }
    },

    fetchGetAllEmployees: async (businessId: string) => {
        set({ loading: true, error: null });
        try {
            const responseGetAllEmployees = await get_all_employees(businessId);
            if (responseGetAllEmployees?.data) {
                set({ allEmployees: responseGetAllEmployees.data.details, loading: false, error: null });
            } else {
                set({ allEmployees: [], loading: false, error: "Error fetching employees" });
            }
        } catch (error) {
            set({ loading: false, error: error instanceof Error ? error.message : "Unknown error" });
        }
    },

    fetchGetEmployeeById: async (id: string) => {
        set({ loading: true, error: null });
        try {
            const responseGetEmployeeById = await get_all_employees(id);
            if (responseGetEmployeeById?.data) {
                set({ employeeById: responseGetEmployeeById.data.details, loading: false, error: null });
            } else {
                set({ employeeById: null, loading: false, error: "Error fetching employee by ID" });
            }
        } catch (error) {
            set({ loading: false, error: error instanceof Error ? error.message : "Unknown error" });
        }
    },

    fetchPatchEmployee: async (id: string, status: string) => {
        
        try {
            const response = await patch_employee(id, status);
            response.data ?
            set((state) => ({
                allEmployees: state.allEmployees.map((employee) =>
                    employee.id === id ? { ...employee, status: response.data.status } : employee
                ),
                loading: false,
                error: null
            })) :
            set({
                loading: false,
                error: response?.data?.message || 'Error updating employee',
                allEmployees: []
            });
        } catch (error) {
            console.error("Error updating employee:", error);
            set({ error: "Failed to update employee", loading: false });
        }
    },

    

}));