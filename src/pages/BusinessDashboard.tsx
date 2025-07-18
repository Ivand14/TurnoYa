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

import { Calendar } from "@/components/Calendar";
import StatsOverview from "@/components/dashboarBusiness/StatsOverview";
import DailyBookings from "@/components/dashboarBusiness/DailyBookings";
import UpcomingBookings from "@/components/analytics/UpcomingBookings";
import EmployeeForm from "@/components/dashboarBusiness/EmployeeForm";
import EmployeeList from "@/components/dashboarBusiness/EmployeeList";
import ScheduleForm from "@/components/dashboarBusiness/ScheduleForm";
import ScheduleList from "@/components/dashboarBusiness/ScheduleList";
import ServiceForm from "@/components/dashboarBusiness/ServiceForm";
import ServiceList from "@/components/dashboarBusiness/ServiceList";
import MercadoPagoSettings from "@/components/mercadopagoComponents/MercadoPagoSettings";
import {
  salesmanContext,
  salesmanData,
} from "@/context/MercadoPagoContext/salesmanContext";
import Statistics from "@/components/dashboarBusiness/Statistics";
import AccountSettings from "@/components/dashboarBusiness/AccountSettings";

import ResponsiveSidebar from "@/components/SideBarContent";
import Onboarding from "@/components/Onboarding";

const BusinessDashboard = () => {
  const { company } = compnay_logged();
  const { businessId } = useParams();
  const { isLogged } = Logged();
  const [oauthAccount, setOauthAccount] = useState<salesmanData | null>(null);
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "resume";
  });
  const [showOnboarding, setShowOnboarding] = useState(false);

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

  const {
    fetchAccessTokenData,
    brand_name,
    accountType,
    email,
    phone,
    picture_url,
    identification,
  } = salesmanContext();

  const handleTabChange = (activeTab: string) => {
    setActiveTab(activeTab);
  };

  const handleOnboardingToggle = () => {
    setShowOnboarding(!showOnboarding);
  };

  const fetchData = useCallback(async () => {
    await fetchGetBooking(businessId);
    await fetchGetAllSchedules(businessId);
    await fetchGetAllBusinessHours(businessId);
    await fetchGetAllEmployees(businessId);
    await fetchGetServices(businessId);
    await fetchAccessTokenData(businessId);
  }, [businessId]);

  useEffect(() => {
    fetchData();
  }, [businessId]);

  useEffect(() => {
    setOauthAccount({
      brand_name,
      accountType,
      email,
      phone,
      picture_url,
      identification,
    });
  }, [brand_name, accountType, email, phone, picture_url, identification]);

  useEffect(() => {
    fetchGetServices(businessId);
  }, []);

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

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

  return (
    <div className="flex  min-h-screen">
      {/* <Navbar /> */}
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar with Onboarding Integration */}
        <ResponsiveSidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onToggleOnboarding={handleOnboardingToggle}
        />

        {/* Onboarding Component */}
        <Onboarding
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          isCollapsed={false}
        />
      </div>
      <div className="flex flex-col w-full">
        <main className="flex-1 container mx-auto px-4 py-8">
          {/* activeTab: Resumen */}
          {activeTab === "resume" && (
            <div className="space-y-8 ">
              <h1 className="font-bold h-20 p-2 text-3xl font-sans">
                Dashboard de {company.company_name}
              </h1>
              <StatsOverview stats={stats} />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <DailyBookings
                    bookings={booking}
                    onCancelBooking={handleCancelBooking}
                    selectedDate={selectedDate}
                  />
                </div>
                <div className="lg:col-span-1">
                  <Calendar
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    daysOfWeek={[
                      "dom",
                      "lun",
                      "mar",
                      "mié",
                      "jue",
                      "vie",
                      "sáb",
                    ]}
                  />
                </div>
              </div>
            </div>
          )}

          {/* activeTab: Servicios */}
          {activeTab === "service" && (
            <div>
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
            </div>
          )}

          {/* activeTab: Empleados */}
          {activeTab === "employees" && (
            <div>
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
            </div>
          )}

          {/* activeTab: Horarios */}
          {activeTab === "schedules" && (
            <div>
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
            </div>
          )}

          {/* activeTab: Reservas */}
          {activeTab === "booking" && (
            <UpcomingBookings
              bookings={booking}
              onCancelBooking={handleCancelBooking}
            />
          )}

          {activeTab === "wallet" && (
            <div>
              <MercadoPagoSettings
                businessId={businessId}
                oauthAccount={oauthAccount}
                setOauthAccount={setOauthAccount}
              />
            </div>
          )}

          {activeTab === "statistics" && (
            <div>
              <Statistics booking={booking} businessId={businessId} />
            </div>
          )}

          {activeTab === "configuracion" && (
            <div>
              <AccountSettings />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BusinessDashboard;
