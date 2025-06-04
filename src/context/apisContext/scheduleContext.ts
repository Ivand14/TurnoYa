import { business_hours, create_schedule, delete_business_hours, delete_schedule, get_all_businessHrs, get_all_sch, patch_business_hrs } from '@/apis/employee_schedule.apis';
import { Schedule } from '@/types/dashboard';
import {create} from 'zustand';


interface ScheduleContext {
    schedules: Schedule[];
    businessHours: Schedule[];
    loading: boolean;
    error: string | null;
    fetchCreateSchedule: (schedule: Schedule) => Promise<void>;
    fetchGetAllSchedules: (businessId: string) => Promise<void>;
    fetchDeleteSchedule: (id: string) => Promise<void>;
    fetchBusinessHours: (schedule: Schedule) => Promise<void>;
    fetchDeleteBusinessHours: (id: string) => Promise<void>;
    fetchGetAllBusinessHours: (businessId: string) => Promise<void>;
    fetchPatchBusinessHours: (id: string, schedule: Schedule) => Promise<void>;
}


export const useScheduleContext = create<ScheduleContext>((set) => ({
    schedules: [],
    businessHours: [],
    loading: false,
    error: null,

    fetchCreateSchedule: async (schedule) => {
        set({loading: true, error: null});
        try {
            const responseCreate = await create_schedule(schedule);
            if(responseCreate?.data){
                set((state) => ({
                    schedules: [...state.schedules, responseCreate.data],
                    loading: false,
                    error: null
                }));
            }else {
                set({loading: false, error: 'Failed to create schedule'});
            }
        } catch (error) {
            set({
                loading: false,
                error: error instanceof Error ? error.message : 'An unexpected error occurred'
            });
        }
    },

    fetchGetAllSchedules: async (businessId) => {
        set({loading: true, error: null});
        try {
            const responseGetSch = await get_all_sch(businessId);
            if(responseGetSch?.data) {
                set({
                    schedules: responseGetSch.data,
                    loading: false,
                    error: null
                });
            }
            else {
                set({loading: false, error: 'Failed to fetch schedules'});
            }
        } catch (error) {
            set({
                loading: false,
                error: error instanceof Error ? error.message : 'An unexpected error occurred'
            });
        }
        
    },

    fetchDeleteSchedule: async (id) => {
        set({loading: true, error: null});
        try {
            const responseDelete = await delete_schedule(id);
            if(responseDelete?.data) {
                set((state) => ({
                    schedules: state.schedules.filter(schedule => schedule.id !== id),
                    loading: false,
                    error: null
                }));
            } else {
                set({loading: false, error: 'Failed to delete schedule'});
            }
        } catch (error) {
            set({
                loading: false,
                error: error instanceof Error ? error.message : 'An unexpected error occurred'
            });
        }
    },

    fetchBusinessHours: async (schedule) => {
        set({loading: true, error: null});
        try {
            const responseBusinessHours = await business_hours(schedule);
            if(responseBusinessHours?.data) {
                set((state) => ({
                    businessHours: [...state.businessHours, responseBusinessHours.data],
                    loading: false,
                    error: null
                }));
            } else {
                set({loading: false, error: 'Failed to create business hours'});
            }
        } catch (error) {
            set({
                loading: false,
                error: error instanceof Error ? error.message : 'An unexpected error occurred'
            });
        }
    },

    fetchDeleteBusinessHours: async (id) => {
        set({loading: true, error: null});
        try {
            const responseDeleteBusinessHours = await delete_business_hours(id);
            if(responseDeleteBusinessHours?.data) {
                set((state) => ({
                    businessHours: state.businessHours.filter(businessHour => businessHour.id !== id),
                    loading: false,
                    error: null
                }));
            } else {
                set({loading: false, error: 'Failed to delete business hours'});
            }
        } catch (error) {
            set({
                loading: false,
                error: error instanceof Error ? error.message : 'An unexpected error occurred'
            });
        }
    },

    fetchGetAllBusinessHours: async (businessId:string) => {
        set({loading: true, error: null});
        try {
            const responseGetBusinessHours = await get_all_businessHrs(businessId);
            if(responseGetBusinessHours?.data) {
                set({
                    businessHours: responseGetBusinessHours.data.details,
                    loading: false,
                    error: null
                });
            } else {
                set({loading: false, error: 'Failed to fetch business hours'});
            }
        } catch (error) {
            set({
                loading: false,
                error: error instanceof Error ? error.message : 'An unexpected error occurred'
            });
        }
    },

    fetchPatchBusinessHours: async (id, schedule) => {
        set({loading: true, error: null});
        try {
            const responsePatchBusinessHours = await patch_business_hrs(id, schedule);
            if(responsePatchBusinessHours?.data) {
                set((state) => ({
                    businessHours: state.businessHours.map(businessHour => 
                        businessHour.id === id ? {...businessHour, ...responsePatchBusinessHours.data} : businessHour
                    ),
                    loading: false,
                    error: null
                }));
            } else {
                set({loading: false, error: 'Failed to update business hours'});
            }
        } catch (error) {
            set({
                loading: false,
                error: error instanceof Error ? error.message : 'An unexpected error occurred'
            });
        }
    },

}));