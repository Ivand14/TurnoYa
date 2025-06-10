import { Booking } from "@/types";
import { create } from "zustand";
import {
  createBooking,
  delete_booking,
  get_booking,
  get_user_booking,
} from "@/apis/booking_apis";
import { socket } from "@/utils/socket";

interface BookingContext {
  booking: Booking[];
  userBooking: Booking[];
  loading: boolean;
  error: string | null;
  selectedDate: Date;
  setSelectedDate:(date:Date) => void
  fetchCreateBooking: (booking: Booking) => Promise<void>;
  fetchGetBooking: (businessId: string) => Promise<void>;
  fetchGetUserBooking: (userId: string) => Promise<void>;
  fetchDeleteBooking: (bookingId: string) => Promise<void>;
}

socket.on("new_book",({action,reserva})=>{
  console.log("socket listen:",action,reserva);
  useBookingContext.setState((state) => {
    if (action === "crear") {
      console.log("reserva creada");
      return { booking: [...state.booking, reserva] };
    }
    return {};
  })
})

export const useBookingContext = create<BookingContext>((set) => ({
  booking: [],
  userBooking: [],
  loading: false,
  error: null,
  selectedDate: new Date(),
  setSelectedDate: (date: Date) => set({ selectedDate: date }),

  fetchCreateBooking: async (booking: Booking) => {
    set({ loading: true, error: null });
    try {
      const responseCreate = await createBooking(booking);
      if (responseCreate.status === 200) {
        socket.emit("new_book",{action:"crear",reserva:booking})
        set((state) => ({
          booking: [...state.booking, responseCreate.details],
          loading: false,
          error: null,
        }));
      } else {
        set({
          loading: false,
          error: responseCreate.data.message || "Error creating booking",
        });
      }
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
    }
  },
  fetchGetBooking: async (businessId: string) => {
    set({ loading: true, error: null });
    try {
      const responseGetBook = await get_booking(businessId);
      if (responseGetBook.status === 200) {
        set((state) => ({
          booking: responseGetBook.details,
          loading: false,
          error: null,
        }));
      } else {
        set({
          booking: [],
          loading: false,
          error: responseGetBook.data.message || "Error fetching bookings",
        });
      }
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
    }
  },
  fetchGetUserBooking: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const responseGetUserBook = await get_user_booking(userId);
      if (responseGetUserBook.status === 200) {
        set((state) => ({
          userBooking: responseGetUserBook.details,
          loading: false,
          error: null,
        }));
      } else {
        set({
          userBooking: [],
          loading: false,
          error:
            responseGetUserBook.data.message || "Error fetching user bookings",
        });
      }
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
    }
  },
  fetchDeleteBooking: async (bookingId: string, businessId?: string) => {
    set({ loading: true, error: null });
    try {
      const deletedBookin = await delete_booking(bookingId);
      if (deletedBookin.status === 200) {
        set((state) => ({
          booking: state.booking.filter((book) => book.id !== bookingId),
          userBooking: state.userBooking.filter(
            (book) => book.id !== bookingId
          ),
          loading: false,
          error: null,
        }));
      } else {
        set({
          loading: false,
          error: deletedBookin.data.message || "Error deleting booking",
        });
      }
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
    }
  },
}));

