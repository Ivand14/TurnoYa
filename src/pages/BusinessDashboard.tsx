import { useCallback, useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useBookingContext } from "@/context/apisContext/bookingContext";
import { useEmployeeContext } from "@/context/apisContext/employeeContext";
import { useScheduleContext } from "@/context/apisContext/scheduleContext";
import { useServicesContext } from "@/context/apisContext/servicesContext";
import { compnay_logged } from "@/context/current_company";
import { Logged } from "@/context/logged";
import { getDashboardStats } from "@/utils/dashboardUtils";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/Calendar";
import StatsOverview from "@/components/dashboarBusiness/StatsOverview";
import DailyBookings from "@/components/dashboarBusiness/DailyBookings";
import UpcomingBookings from "@/components/dashboarBusiness/UpcomingBookings";
import EmployeeForm from "@/components/dashboarBusiness/EmployeeForm";
import EmployeeList from "@/components/dashboarBusiness/EmployeeList";
import ScheduleForm from "@/components/dashboarBusiness/ScheduleForm";
import ScheduleList from "@/components/dashboarBusiness/ScheduleList";
import ServiceForm from "@/components/dashboarBusiness/ServiceForm";
import ServiceList from "@/components/dashboarBusiness/ServiceList";
import MercadoPagoSettings from "@/components/mercadopagoComponents/MercadoPagoSettings";

const BusinessDashboard = () => {
  const { company } = compnay_logged();
  const { businessId } = useParams();
  const { isLogged } = Logged();

  if (!isLogged || !company || company.rol !== "business") {
    return <Navigate to="/login" />;
  }

  const {
    booking,
    fetchGetBooking,
    fetchDeleteBooking,
    selectedDate,
    setSelectedDate,
  } = useBookingContext();

  const {
    allEmployees,
    fetchGetAllEmployees,
    newEmployee,
    handleEmployeeFormChange,
    handleAddEmployee,
    fetchDeleteEmployee,
  } = useEmployeeContext();

  const {
    schedules,
    businessHours,
    fetchGetAllSchedules,
    fetchGetAllBusinessHours,
    handleScheduleFormChange,
    handleAddSchedule,
    fetchDeleteSchedule,
    fetchPatchBusinessHours,
  } = useScheduleContext();

  const {
    services,
    fetchGetServices,
    fetchCreateService,
    fetchDeleteService,
    fetchPatchService,
  } = useServicesContext();

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "overview";
  });

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  const fetchData = useCallback(async () => {
    await fetchGetBooking(businessId);
    await fetchGetAllSchedules(businessId);
    await fetchGetAllBusinessHours(businessId);
    await fetchGetAllEmployees(businessId);
    await fetchGetServices(businessId);
  }, [businessId]);

  useEffect(() => {
    fetchData();
  }, [businessId]);

  useEffect(() => {
    fetchGetServices(businessId);
  }, []);

  const upcomingBookings = booking
    .filter(
      (b) => b.businessId === company.id && new Date(b.start) > new Date()
    )
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  const handleCancelBooking = async (bookingId: string) => {
    const bookingExists = booking.some(
      (b) => b.id === bookingId && b.businessId === company.id
    );
    if (!bookingExists) {
      toast.error("Error: La reserva no pertenece a tu negocio");
      return;
    }
    await fetchDeleteBooking(bookingId);
    toast.success("Reserva cancelada correctamente");
  };

  const stats = getDashboardStats(booking, allEmployees);
  console.log(stats);
  console.log(booking);

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
            <TabsTrigger value="wallet">Mi billetera</TabsTrigger>
          </TabsList>

          {/* Tab: Resumen */}
          <TabsContent value="overview" className="space-y-8">
            <StatsOverview stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <Calendar
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                  daysOfWeek={["dom", "lun", "mar", "mié", "jue", "vie", "sáb"]}
                />
              </div>
              <div className="lg:col-span-2">
                <DailyBookings
                  bookings={upcomingBookings}
                  onCancelBooking={handleCancelBooking}
                  selectedDate={selectedDate}
                />
              </div>
            </div>
          </TabsContent>

          {/* Tab: Servicios */}
          <TabsContent value="services">
            <ServiceForm
              onSubmit={fetchCreateService}
              employees={allEmployees}
              businessId={businessId}
            />
            <ServiceList
              services={services}
              onDelete={fetchDeleteService}
              employees={allEmployees}
              onEdit={fetchPatchService}
            />
          </TabsContent>

          {/* Tab: Empleados */}
          <TabsContent value="employees">
            <EmployeeForm
              newEmployee={newEmployee}
              onChange={handleEmployeeFormChange}
              onSubmit={handleAddEmployee}
              businessId={businessId}
            />
            <EmployeeList
              employees={allEmployees}
              onDeleteEmployee={fetchDeleteEmployee}
            />
          </TabsContent>

          {/* Tab: Horarios */}
          <TabsContent value="schedules">
            <ScheduleForm
              activeEmployees={allEmployees}
              onChange={handleScheduleFormChange}
              onSubmit={handleAddSchedule}
              businessId={businessId}
              onEdit={fetchPatchBusinessHours}
            />
            <ScheduleList
              schedules={schedules}
              schedulesHrs={businessHours}
              onDelete={fetchDeleteSchedule}
              onEdit={fetchPatchBusinessHours}
              businessId={businessId}
            />
          </TabsContent>

          {/* Tab: Reservas */}
          <TabsContent value="bookings">
            <UpcomingBookings
              bookings={upcomingBookings}
              onCancelBooking={handleCancelBooking}
            />
          </TabsContent>

          <TabsContent value="wallet">
            <MercadoPagoSettings businessId={businessId} />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default BusinessDashboard;
