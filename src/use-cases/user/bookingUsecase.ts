import { CostumeError } from "../../frameworks/middlewares/customError";
import BookingRepository from "../../repository/user/bookingRepository";

class BookingUsecase {
  private _bookingRepository: BookingRepository;

  constructor(bookingReopsitory: BookingRepository) {
    this._bookingRepository = bookingReopsitory;
  }


}

export default BookingUsecase;
