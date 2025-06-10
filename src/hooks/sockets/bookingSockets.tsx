import { useEffect } from "react";
import { socket } from "@/utils/socket";
import { useBookingContext } from "@/context/apisContext/bookingContext";

const useWebSocketHandler = () => {
  useEffect(() => {
    socket.on("cancel_book", ({ bookingId }) => {
      useBookingContext.setState((state) => ({
        booking: state.booking.filter((book) => book.id !== bookingId),
        userBooking: state.userBooking.filter((book) => book.id !== bookingId),
      }));
    });

    return () => {
      socket.off("cancel_book");
    };
  }, []);
};

export default useWebSocketHandler;
