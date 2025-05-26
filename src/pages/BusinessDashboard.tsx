import { Booking, Service } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Employee, Schedule } from "@/types/dashboard";
import { Navigate, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  business_hours,
  create_employee,
  create_schedule,
  delete_business_hours,
  delete_schedule,
  get_all_businessHrs,
  get_all_employees,
  get_all_sch,
  patch_business_hrs,
  patch_employee
} from "@/apis/employee_schedule.apis";
import {
  create_service,
  delete_service,
  get_services
} from "@/apis/services.api";
import { mockEmployees, mockSchedules } from "@/data/dashboardData";
import { useEffect, useState } from "react";

import { Calendar } from "@/components/Calendar";
import DailyBookings from "@/components/dashboarBusiness/DailyBookings";
import EmployeeForm from "@/components/dashboarBusiness/EmployeeForm";
import EmployeeList from "@/components/dashboarBusiness/EmployeeList";
import { Footer } from "@/components/Footer";
import { Logged } from "@/context/logged";
import { Navbar } from "@/components/Navbar";
import ScheduleForm from "@/components/dashboarBusiness/ScheduleForm";
import ScheduleList from "@/components/dashboarBusiness/ScheduleList";
import ServiceForm from "@/components/dashboarBusiness/ServiceForm";
import ServiceList from "@/components/dashboarBusiness/ServiceList";
import StatsOverview from "@/components/dashboarBusiness/StatsOverview";
import UpcomingBookings from "@/components/dashboarBusiness/UpcomingBookings";
import { compnay_logged } from "@/context/current_company";
import { getDashboardStats } from "@/utils/dashboardUtils";
import { mockBookings } from "@/data/mockData";
import { set } from "date-fns";
import { toast } from "sonner";

// Import dashboard components

// Import types and utility functions

const BusinessDashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [schedulesHrs, setSchedulesHrs] = useState<Schedule[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const { company } = compnay_logged();
  const { businessId } = useParams();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const { setIsLogged, isLogged } = Logged();
  const [services, setServices] = useState<Service[]>([]);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  const fetchData = async () => {
    try {
      const employeesResponse = await get_all_employees(businessId);
      const schedulesResponse = await get_all_sch(businessId);
      const businessHrsResponse = await get_all_businessHrs(businessId);
      const businessServices = await get_services(businessId);

      setEmployees(employeesResponse.data.details);
      setSchedules(schedulesResponse.data.details);
      setSchedulesHrs(businessHrsResponse.data.details);
      setServices(businessServices.data.details);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  console.log(services);

  // Form state for new employee
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    status: "active",
    businessId: businessId
  });

  // Form state for new schedule
  const [newSchedule, setNewSchedule] = useState<Schedule>({
    employeeId: "",
    day: "Lunes",
    startTime: "09:00",
    endTime: "17:00",
    isBusinessHours: false
  });

  // Fetch bookings for the business
  useEffect(() => {
    fetchData();
    const now = new Date();

    // Filtrar reservas por empresa
    const businessBookings = mockBookings.filter(
      (booking) => booking.businessId === company.id
    );

    // Obtener reservas futuras
    const upcoming = businessBookings.filter(
      (booking) => new Date(booking.start) > now
    );

    // Ordenar por fecha
    upcoming.sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
    );

    setBookings(businessBookings);
    setUpcomingBookings(upcoming);

    fetchData();
  }, [company, businessId]);

  // Redirect if not a business user
  if (!isLogged || !company || company.rol !== "business") {
    return <Navigate to="/login" />;
  }

  // Filter bookings for selected date
  const bookingsForSelectedDate = bookings.filter((booking) => {
    const bookingDate = new Date(booking.start);
    return (
      bookingDate.getDate() === selectedDate.getDate() &&
      bookingDate.getMonth() === selectedDate.getMonth() &&
      bookingDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  // Cancel booking handler
  const handleCancelBooking = (bookingId: string) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status: "cancelled" } : booking
      )
    );

    setUpcomingBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status: "cancelled" } : booking
      )
    );

    toast.success("Reserva cancelada correctamente");
  };

  // Employee form handlers
  const handleEmployeeFormChange = (field: string, value: string) => {
    setNewEmployee((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddEmployee = async () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.position) {
      toast.error("Por favor complete los campos obligatorios");
      return;
    }
    const response = await create_employee(newEmployee);
    fetchData();

    setNewEmployee({
      name: "",
      email: "",
      phone: "",
      position: "",
      status: "active",
      businessId: businessId
    });
    toast.success("Empleado agregado correctamente");
  };

  // Toggle employee status
  const handleToggleEmployeeStatus = async (employeeId: string) => {
    try {
      const employee_search = employees.find((empl) => empl.id === employeeId);
      const currentStatus = employee_search.status;

      console.log(`Estado actual: ${currentStatus}`);

      // Lógica para cambiar el estado
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === employeeId ? { ...emp, status: newStatus } : emp
        )
      );
      toast.success("Estado del empleado actualizado");
      await patch_employee(employee_search.id, newStatus);
    } catch (error) {
      console.log(error);
    }
  };

  // Schedule form handlers
  const handleScheduleFormChange = (field: string, value: string) => {
    setNewSchedule((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSchedule = async () => {
    if (newSchedule.isBusinessHours) {
      // Business hours case
      if (!newSchedule.day || !newSchedule.startTime || !newSchedule.endTime) {
        toast.error("Por favor complete todos los campos");
        return;
      }

      const newScheduleEntry: Schedule = {
        id: `sch-${Date.now()}`,
        day: newSchedule.day,
        startTime: newSchedule.startTime,
        endTime: newSchedule.endTime,
        businessId: businessId
      };

      if (editingSchedule) {
        // Update existing schedule
        const response = await patch_business_hrs(
          editingSchedule.id,
          newScheduleEntry
        );
        console.log(response);
        setSchedulesHrs((prevSchedules) =>
          prevSchedules.map((schedule) =>
            schedule.id === editingSchedule.id ? newScheduleEntry : schedule
          )
        );
        toast.success("Horario de atención actualizado correctamente");
        setEditingSchedule(null);
      } else {
        const response_business_hours = await business_hours(newScheduleEntry);

        if (response_business_hours.data.status === 200) {
          setSchedulesHrs((prevSch) => [...prevSch, newScheduleEntry]);
        }
      }
    } else {
      // Employee schedule case
      if (
        !newSchedule.employeeId ||
        !newSchedule.day ||
        !newSchedule.startTime ||
        !newSchedule.endTime
      ) {
        toast.error("Por favor complete todos los campos");
        return;
      }

      const employee = employees.find(
        (emp) => emp.id === newSchedule.employeeId
      );

      if (!employee) {
        toast.error("Empleado no encontrado");
        return;
      }

      const newScheduleEntry: Schedule = {
        id: `sch-${Date.now()}`,
        employeeId: newSchedule.employeeId,
        employee: employee.name,
        day: newSchedule.day,
        startTime: newSchedule.startTime,
        endTime: newSchedule.endTime,
        // isBusinessHours: false,
        businessId: businessId
      };

      const response = await create_schedule(newScheduleEntry);
      setSchedules((prevSchedules) => [...prevSchedules, newScheduleEntry]);
      toast.success("Horario agregado correctamente");
    }

    setNewSchedule({
      employeeId: "",
      day: "Lunes",
      startTime: "09:00",
      endTime: "17:00",
      isBusinessHours: newSchedule.isBusinessHours
    });
  };

  // Delete schedule
  const handleDeleteSchedule = async (scheduleId: string) => {
    try {
      await delete_business_hours(scheduleId);
      await delete_schedule(scheduleId);
      setSchedulesHrs((prev) => prev.filter((sch) => sch.id !== scheduleId));
      setSchedules((prev) => prev.filter((sch) => sch.id !== scheduleId));
      toast.success("Horario eliminado correctamente");
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditSchedule = (schedule: Schedule) => {
    console.log(schedule);
    setEditingSchedule(schedule);
    setNewSchedule({
      employeeId: schedule.employeeId,
      day: schedule.day,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      isBusinessHours: true
    });
  };

  // Service handlers
  const handleAddService = async (serviceData: Service) => {
    const newService: Service = {
      id: `service-${Date.now()}`,
      businessId: businessId,
      name_service: serviceData.name_service,
      description: serviceData.description,
      duration: serviceData.duration,
      price: serviceData.price,
      active: serviceData.active
    };
    const response = await create_service(newService);
    console.log(response)
    if(response.status === 200){
      setServices([...services, newService]);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    console.log(serviceId)
    try {
      const response = await delete_service(serviceId);

      if (response.data.status === 200) {
        setServices((prevServices) => 
          prevServices.filter((prev) => prev.id !== serviceId)
        );
        console.log(services)
        toast.success("Servicio eliminado");
      } else {
        toast.error("No se pudo eliminar el servicio");
      }
    } catch (error) {
      toast.error("Error en la solicitud");
    }
  };

  // Calculate dashboard statistics
  const stats = getDashboardStats(bookings, employees);

  // Get active employees for schedule form
  const activeEmployees =
    Array.isArray(employees) &&
    employees?.filter((emp) => emp.status === "active");

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard de Empresa</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="services">Servicios</TabsTrigger>
            <TabsTrigger value="employees">Empleados</TabsTrigger>
            <TabsTrigger value="schedules">Horarios</TabsTrigger>
            <TabsTrigger value="bookings">Reservas</TabsTrigger>
          </TabsList>

          {/* Tab: Resumen */}
          <TabsContent value="overview" className="space-y-8">
            <StatsOverview stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Calendario</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      selectedDate={selectedDate}
                      onSelectDate={setSelectedDate}
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                <DailyBookings
                  selectedDate={selectedDate}
                  bookings={bookingsForSelectedDate}
                  onCancelBooking={handleCancelBooking}
                />
              </div>
            </div>
          </TabsContent>
          {/* Tab: Services */}
          <TabsContent value="services" className="space-y-8">
            <ServiceForm
              businessId={businessId || ""}
              onSubmit={handleAddService}
            />

            <ServiceList
              services={services}
              onDelete={handleDeleteService}
            />
          </TabsContent>

          {/* Tab: Empleados */}
          <TabsContent value="employees" className="space-y-8">
            <EmployeeForm
              newEmployee={newEmployee}
              onChange={handleEmployeeFormChange}
              onSubmit={handleAddEmployee}
            />

            <EmployeeList
              employees={employees}
              onToggleStatus={handleToggleEmployeeStatus}
            />
          </TabsContent>

          {/* Tab: Horarios */}
          <TabsContent value="schedules" className="space-y-8">
            <ScheduleForm
              newSchedule={newSchedule}
              activeEmployees={activeEmployees}
              onChange={handleScheduleFormChange}
              onSubmit={handleAddSchedule}
            />

            <ScheduleList
              schedules={schedules}
              schedulesHrs={schedulesHrs}
              onDelete={handleDeleteSchedule}
              onEdit={handleEditSchedule}
            />
          </TabsContent>

          {/* Tab: Reservas */}
          <TabsContent value="bookings">
            <UpcomingBookings
              bookings={upcomingBookings}
              onCancelBooking={handleCancelBooking}
            />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default BusinessDashboard;
