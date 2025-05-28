import { get_all_businessHrs, get_all_employees, get_all_sch } from "@/apis/employee_schedule.apis";

import { create } from "zustand";
import { get_booking } from "@/apis/booking_apis";
import { get_services } from "@/apis/services.api";

export const useStoreApis = create((set) => ({
    allBookings: [],
    employees: [],
    schedules: [],
    schedulesHrs: [],
    services: [],
    isLoading: false,

    fetchData: async (businessId:string) => {
        set({ isLoading: true });

        try {
            const [employeesResponse, schedulesResponse, businessHrsResponse, businessServices, businessBooking] = await Promise.all([
                get_all_employees(businessId),
                get_all_sch(businessId),
                get_all_businessHrs(businessId),
                get_services(businessId),
                get_booking(businessId)
            ]);

            set({
                employees: employeesResponse.data.details,
                schedules: schedulesResponse.data.details,
                schedulesHrs: businessHrsResponse.data.details,
                services: businessServices.data.details,
                allBookings: businessBooking.details,
                isLoading: false,
            });
        } catch (error) {
            console.error("Error al obtener datos:", error);
            set({ isLoading: false });
        }
    },
}));


