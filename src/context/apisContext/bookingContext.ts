import { Booking } from "@/types";
import { create } from "zustand";
import {
  createBooking,
  delete_booking,
  get_booking,
  get_user_booking,
  patch_status_book,
} from "@/apis/booking_apis";
import { socket } from "@/utils/socket";
import { match } from "assert";

interface BookingContext {
  booking: Booking[];
  userBooking: Booking[];
  loading: boolean;
  error: string | null;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  fetchCreateBooking: (booking: Booking) => Promise<void>;
  fetchGetBooking: (businessId: string) => Promise<void>;
  fetchGetUserBooking: (userId: string) => Promise<void>;
  fetchDeleteBooking: (bookingId: string) => Promise<void>;
  fetchPatchStatusBooking: (
    booking_id: string,
    new_status: string
  ) => Promise<void>;
}

socket.on("new_book", ({ action, reserva }) => {
  useBookingContext.setState((state) => {
    if (action === "crear") {
      return { booking: [...state.booking, reserva] };
    } else if (action === "cancel") {
      return {
        booking: state.booking.filter((bk) => bk.id !== reserva),
      };
    }
    return {};
  });
});

socket.on("update_status", ({ action, updates }) => {
  if (action === "update" && Array.isArray(updates)) {
    useBookingContext.setState((state) => ({
      booking: state.booking.map((bk) => {
        const match = updates.find((u) => u.id === bk.id);
        return match ? match : bk;
      }),
    }));
  }
});

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
        socket.emit("new_book", { action: "crear", reserva: booking });
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
  fetchPatchStatusBooking: async (booking_id: string, new_status: string) => {
    set({ loading: true, error: null });
    try {
      const responsePatch = await patch_status_book(booking_id, new_status);
      if (responsePatch?.status === 200) {
        const updatedBooking = responsePatch?.details;
        set((state) => ({
          booking: state.booking.map((bk) =>
            bk.id === updatedBooking.id ? updatedBooking : bk
          ),
          loading: false,
          error: null,
        }));
        socket.emit("update_status", {
          action: "update",
          updates: updatedBooking,
        });
      } else {
        set({
          loading: false,
          error: responsePatch.data.message || "Error updating booking status",
        });
      }
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
    }
  },
}));
