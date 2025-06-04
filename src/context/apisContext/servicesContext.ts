import { create_service, delete_service, get_services, patchService } from '@/apis/services.api';
import { Service } from '@/types';
import {create} from 'zustand';


interface ServicesContext {
    services: Service[];
    loading: boolean;
    error: string | null;
    fetchCreateService: (service: Service) => Promise<void>;
    fetchGetServices: (businessId: string) => Promise<void>;
    fetchDeleteService: (id: string) => Promise<void>;
    fetchPatchService: (data: Service, serviceId: string) => Promise<void>;
}


export const useServicesContext = create<ServicesContext>((set) => ({
    services: [],
    loading: false,
    error: null,

    fetchCreateService: async (service) => {
        set({loading: true, error: null});
        try {
            const responseCreate = await create_service(service);
            if (responseCreate?.data) {
                set((state) => ({
                    services: [...state.services, responseCreate.data],
                    loading: false,
                    error: null
                }));
            } else {
                set({loading: false, error: 'Failed to create service'});
            }
        } catch (error) {
            set({
                loading: false,
                error: error instanceof Error ? error.message : 'An unexpected error occurred'
            });
        }
    },

    fetchGetServices: async (businessId) => {
        set({loading: true, error: null});
        try {
            const responseGetServices = await get_services(businessId);
            if (responseGetServices?.data) {
                set({
                    services: responseGetServices.data,
                    loading: false,
                    error: null
                });
            } else {
                set({loading: false, error: 'Failed to fetch services'});
            }
        } catch (error) {
            set({
                loading: false,
                error: error instanceof Error ? error.message : 'An unexpected error occurred'
            });
        }
    },

    fetchDeleteService: async (id) => {
        set({loading: true, error: null});
        try {
            const responseDelete = await delete_service(id);
            if (responseDelete?.data) {
                set((state) => ({
                    services: state.services.filter(service => service.id !== id),
                    loading: false,
                    error: null
                }));
            } else {
                set({loading: false, error: 'Failed to delete service'});
            }
        } catch (error) {
            set({
                loading: false,
                error: error instanceof Error ? error.message : 'An unexpected error occurred'
            });
        }
    },

    fetchPatchService: async (data, serviceId) => {
        set({loading: true, error: null});
        try {
            const responsePatch = await patchService(data, serviceId);
            if (responsePatch?.data) {
                set((state) => ({
                    services: state.services.map(service =>
                        service.id === serviceId ? {...service, ...data} : service
                    ),
                    loading: false,
                    error: null
                }));
            } else {
                set({loading: false, error: 'Failed to update service'});
            }
        } catch (error) {
            set({
                loading: false,
                error: error instanceof Error ? error.message : 'An unexpected error occurred'
            });
        }
    },


}));