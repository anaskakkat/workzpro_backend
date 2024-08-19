import { CostumeError } from "../../frameworks/middlewares/customError";
import BookingRepository from "../../repository/user/bookingRepository";

class BookingUsecase {
  private _bookingRepository: BookingRepository;

  constructor(bookingReopsitory: BookingRepository) {
    this._bookingRepository = bookingReopsitory;
  }

  async getBooking(id: string) {
    try {
      const bookings = await this._bookingRepository.findBookingsByUserId(id);      
      if (!bookings) {
        throw new CostumeError(400, "not fetched bookings data");
      }
      return bookings;
    } catch (error) {
      throw error;
    }
  }
}

export default BookingUsecase;
