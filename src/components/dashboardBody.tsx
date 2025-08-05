import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { BookingUserCard } from "@/components/BookingUserCard";
import { Calendar } from "@/components/Calendar";
import { Booking } from "@/types";
import { es } from "date-fns/locale";
import { Navbar } from "./Navbar";
import StatsOverview from "./dashboarBusiness/StatsOverview";
import { DashboardStats } from "@/types/dashboard";


interface dashProps {
  upcomingBookings: Booking[];
  pastBookings: Booking[];
  stats: DashboardStats;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  servicesUser: Record<string, any>;
  bookingsForSelectedDate: Booking[];
  handleCancelBooking: (bookingId: string) => Promise<void>;
}

function DashboardBody({
  upcomingBookings,
  pastBookings,
  stats,
  selectedDate,
  setSelectedDate,
  servicesUser,
  bookingsForSelectedDate,
  handleCancelBooking,
}: dashProps) {
  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      {/* <h1 className="text-3xl font-bold mb-6">Dashboard de {user.user_data.name}</h1> */}
      <div className="mb-20">
        <Navbar />
      </div>

      <div className="w-full mb-8">
        {/* Estadísticas */}
        <StatsOverview stats={stats} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendario y vista diaria */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Calendario</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                daysOfWeek={["dom", "lun", "mar", "mié", "jue", "vie", "sáb"]}
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>
                Reservas para{" "}
                {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bookingsForSelectedDate.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bookingsForSelectedDate.map((booking) => (
                    <BookingUserCard
                      key={booking.id}
                      booking={booking}
                      service={servicesUser[booking.id]}
                      onCancel={handleCancelBooking}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">
                    No hay reservas para esta fecha
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Listado de reservas */}
      <div className="mt-8">
        <Tabs defaultValue="upcoming">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Mis Reservas</h2>
            <TabsList>
              <TabsTrigger value="upcoming">Próximas</TabsTrigger>
              <TabsTrigger value="past">Pasadas</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="upcoming">
            {upcomingBookings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingBookings.map((booking) => (
                  <BookingUserCard
                    key={booking.id}
                    booking={booking}
                    service={servicesUser[booking.serviceId]}
                    onCancel={handleCancelBooking}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No tienes próximas reservas</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            {pastBookings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastBookings.map((booking) => (
                  <BookingUserCard
                    key={booking.id}
                    booking={booking}
                    service={servicesUser[booking.serviceId]}
                    onCancel={handleCancelBooking}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No tienes reservas pasadas</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

export default DashboardBody;
