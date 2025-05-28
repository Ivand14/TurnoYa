import { Employee, Schedule } from '@/types/dashboard';

import { API_URL } from "./api_url";
import axios from "axios";
import { toast } from "sonner";

export const create_employee = async (employee: Employee) => {
    const url = `${API_URL}/new_employee`
    const response = await axios.post(url, employee)
    return response
}

export const get_all_employees = async (businessId: string) => {
    const url = `${API_URL}/all_employee/${businessId}`
    const response = await axios.get(url)
    return response
}

export const get_employee_id = async (id: string) => {
    const url = `${API_URL}/get_employee_id/${id}`
    const response = await axios.get(url)
    return response
}

export const create_schedule = async (schedule: Schedule) => {
    const url = `${API_URL}/schedule`
    const response = await axios.post(url, schedule)
    return response
}

export const get_all_sch = async (businessId: string) => {
    const url = `${API_URL}/all_schedule/${businessId}`
    const response = await axios.get(url)
    return response
}

export const patch_employee = async (id: string, status: string) => {
    const url = `${API_URL}/employee_status`;

    try {
        const response = await axios.patch(url, { id, status });
        return response.data;  // Devuelve solo los datos de la respuesta
    } catch (error) {
        console.error("Error al actualizar empleado:", error);
        return { error: "No se pudo actualizar el empleado" };  // Devuelve un mensaje claro
    }
};

export const delete_schedule = async (id: string) => {
    try {
        const url = `${API_URL}/delete_schedule`
        const response = await axios.delete(url, {
            data:{id:id}
        })
        return response
    } catch (error) {
        console.log(error)
    }
}


export const business_hours = async(schedule:Schedule) => {
    try {
        const url = `${API_URL}/business_hours`
        const response = await axios.post(url,schedule)
        return response
    } catch (error) {
        console.log(error)
    }
}

export const delete_business_hours = async (id: string) => {
    try {
        const url = `${API_URL}/business_hours_delete`
        const response = await axios.delete(url, {
            data:{id:id}
        })
        return response
    } catch (error) {
        console.log(error)
    }
}

export const get_all_businessHrs = async (businessId: string) => {
    const url = `${API_URL}/all_business_hours/${businessId}`
    const response = await axios.get(url)

    return response
}

export const patch_business_hrs = async (id: string, schedule:Schedule) => {
    const url = `${API_URL}/update_business_hours`;

    try {
        const response = await axios.patch(url, { id, schedule });
        return response.data;  // Devuelve solo los datos de la respuesta
    } catch (error) {
        console.error("Error al actualizar horario:", error);
        return { error: "No se pudo actualizar el horario" };  // Devuelve un mensaje claro
    }
};