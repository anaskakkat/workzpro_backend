import { log } from "console";
import IBooking from "../entities/booking";
import { CostumeError } from "../frameworks/middlewares/customError";
import BookingRepository from "../repository/bookingRepository";

class BookingUsecase {
  private _bookingRepository: BookingRepository;

  constructor(bookingReopsitory: BookingRepository) {
    this._bookingRepository = bookingReopsitory;
  }

  async bookingData(userId: string, bookingData: IBooking) {
    try {
      const booking = await this._bookingRepository.saveBooking(
        userId,
        bookingData
      );
      if (!booking) {
        throw new CostumeError(400, "not Saved  booking data");
      }
      return {
        status: 200,
        bookingId: booking._id,
        message: "Booking Saved",
      };
    } catch (error) {
      throw error;
    }
  }
  async getbookingData(userId: string) {
    try {
      const booking = await this._bookingRepository.findBookingsById(userId);
      if (!booking) {
        throw new CostumeError(400, "not fetching  booking data");
      }

      // console.log('booking----------',booking);

      return {
        status: 200,
        booking,
        message: "Booking fetched",
      };
    } catch (error) {
      throw error;
    }
  }
  async getUserBookings(userId: string) {
    try {
      const booking = await this._bookingRepository.findBookingsByUserId(
        userId
      );
      if (!booking) {
        throw new CostumeError(400, "not fetching  userBookings data");
      }

      console.log('booking----------',booking.length);

      return {
        status: 200,
        booking,
        message: "Booking fetched",
      };
    } catch (error) {
      throw error;
    }
  }
  async getBookingsByDate(workerid: string, date: string) {
    try {
      const booking = await this._bookingRepository.findBookingsByBookingId(
        workerid,
        date
      );
      if (!booking) {
        throw new CostumeError(400, "not fetching  userBookings data");
      }
      console.log("booking----------", booking);
      return {
        status: 200,
        booking,
      };
    } catch (error) {
      throw error;
    }
  }
}

export default BookingUsecase;
