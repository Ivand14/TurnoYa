import { create } from "zustand";
import { Schedule } from "@/types/dashboard";
import {
  business_hours,
  create_schedule,
  delete_business_hours,
  delete_schedule,
  get_all_businessHrs,
  get_all_sch,
  patch_business_hrs,
} from "@/apis/employee_schedule.apis";
import { socket } from "@/utils/socket";

interface ScheduleContext {
  schedules: Schedule[];
  businessHours: Schedule[];
  newSchedule: Schedule;
  loading: boolean;
  error: string | null;
  setNewSchedule: (schedule: Schedule) => void;
  handleScheduleFormChange: (field: string, value: string) => void;
  handleAddSchedule: (sch: Schedule, businessId: string) => Promise<void>;
  fetchGetAllSchedules: (businessId: string) => Promise<void>;
  fetchDeleteSchedule: (id: string) => Promise<void>;
  fetchBusinessHours: (schedule: Schedule) => Promise<void>;
  fetchDeleteBusinessHours: (id: string) => Promise<void>;
  fetchGetAllBusinessHours: (businessId: string) => Promise<void>;
  fetchPatchBusinessHours: (id: string, schedule: Schedule) => Promise<void>;
}

socket.on("updateBusinessHrs", (updatedBusinessHoursList) => {

  const updatedBusinessHours = Array.isArray(updatedBusinessHoursList)
    ? updatedBusinessHoursList[0] 
    : updatedBusinessHoursList; 

  useScheduleContext.setState((state) => ({
    businessHours: state.businessHours.map((businessHour) =>
      businessHour.id === updatedBusinessHours.id
        ? { ...businessHour, ...updatedBusinessHours }
        : businessHour
    ),
  }));
});

export const useScheduleContext = create<ScheduleContext>((set, get) => ({
  schedules: [],
  businessHours: [],
  newSchedule: {
    employeeId: "",
    day: "Lunes",
    startTime: "09:00",
    endTime: "17:00",
    isBusinessHours: false,
  },
  loading: false,
  error: null,

  setNewSchedule: (schedule: Schedule) => {
    set({ newSchedule: schedule });
  },

  handleScheduleFormChange: (field, value) => {
    set((state) => ({
      newSchedule: { ...state.newSchedule, [field]: value },
    }));
  },

  handleAddSchedule: async (sch: Schedule, businessId) => {
    set({ loading: true, error: null });
    try {
      const newSch = {
        ...sch,
        id: `sch-${Date.now()}`,
        businessId: businessId,
      };
      const response = await business_hours(newSch);

      if (response?.data) {
        set((state) => ({
          businessHours: [...state.businessHours, response.data.details],
          loading: false,
          newSchedule: {
            employeeId: "",
            day: "Lunes",
            startTime: "09:00",
            endTime: "17:00",
            isBusinessHours: false,
          }, // ✅ Reset después de creación
        }));
      } else {
        set({ loading: false, error: "Error creando horario" });
      }
    } catch (error) {
      console.error("Error creando horario:", error);
      set({ loading: false, error: "Fallo al crear horario" });
    }
  },

  // ✅ Obtener todos los horarios
  fetchGetAllSchedules: async (businessId) => {
    set({ loading: true, error: null });
    try {
      const response = await get_all_sch(businessId);
      if (response?.data) {
        set({ schedules: response.data, loading: false });
      } else {
        set({ loading: false, error: "Error obteniendo horarios" });
      }
    } catch (error) {
      console.error("Error obteniendo horarios:", error);
      set({ loading: false, error: "Fallo al obtener horarios" });
    }
  },

  fetchDeleteSchedule: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await delete_schedule(id);
      if (response?.data) {
        set((state) => ({
          businessHours: state.businessHours.filter(
            (schedule) => schedule.id !== id
          ),
          loading: false,
        }));
      } else {
        set({ loading: false, error: "Error eliminando horario" });
      }
    } catch (error) {
      console.error("Error eliminando horario:", error);
      set({ loading: false, error: "Fallo al eliminar horario" });
    }
  },

  fetchBusinessHours: async (schedule) => {
    set({ loading: true, error: null });
    try {
      const response = await business_hours(schedule);
      if (response?.data) {
        set((state) => ({
          businessHours: [...state.businessHours, response.data],
          loading: false,
        }));
      } else {
        set({ loading: false, error: "Error creando horario de atención" });
      }
    } catch (error) {
      console.error("Error creando horario de atención:", error);
      set({ loading: false, error: "Fallo al crear horario de atención" });
    }
  },

  fetchDeleteBusinessHours: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await delete_business_hours(id);
      if (response?.data) {
        set((state) => ({
          businessHours: state.businessHours.filter(
            (businessHour) => businessHour.id !== id
          ),
          loading: false,
        }));
      } else {
        set({ loading: false, error: "Error eliminando horario de atención" });
      }
    } catch (error) {
      console.error("Error eliminando horario de atención:", error);
      set({ loading: false, error: "Fallo al eliminar horario de atención" });
    }
  },

  fetchGetAllBusinessHours: async (businessId) => {
    set({ loading: true, error: null });
    try {
      const response = await get_all_businessHrs(businessId);
      if (response?.data) {
        set({ businessHours: response.data.details, loading: false });
      } else {
        set({ loading: false, error: "Error obteniendo horarios de atención" });
      }
    } catch (error) {
      console.error("Error obteniendo horarios de atención:", error);
      set({ loading: false, error: "Fallo al obtener horarios de atención" });
    }
  },

  fetchPatchBusinessHours: async (id, schedule) => {
    set({ loading: true, error: null });
    try {
      const response = await patch_business_hrs(id, schedule);
      if (response?.status === 200) {
        set((state) => ({
          businessHours: state.businessHours.map((businessHour) => {
            return businessHour.id === id
              ? { ...businessHour, ...(response.details || {}) } // 👈 Agrega validación para evitar objetos vacíos
              : businessHour;
          }),
          loading: false,
        }));
        socket.emit("updateBusinessHrs", { id, schedule: response.details });
      } else {
        set({
          loading: false,
          error: "Error actualizando horario de atención",
        });
      }
    } catch (error) {
      console.error("Error actualizando horario de atención:", error);
      set({ loading: false, error: "Fallo al actualizar horario de atención" });
    }
  },
}));
