import { NextFunction, Request, Response } from "express";
import BookingUsecase from "../../use-cases/user/bookingUsecase";

class BookingController {
  private _BookingUseCase: BookingUsecase;

  constructor(bookingUseCase: BookingUsecase) {
    this._BookingUseCase = bookingUseCase;
  }

  async bookingData(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log("services---touched", req.params.id);
      // console.log("services---touched", req.body);
      const booking = await this._BookingUseCase.bookingData(
        req.params.id,
        req.body
      );
      return res
        .status(booking.status)
        .json({ message: booking.message, bookingId: booking.bookingId });
    } catch (error) {
      next(error);
    }
  }
  async getbookingData(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log("getbookingData---touched", req.params.id);
      const booking = await this._BookingUseCase.getbookingData(req.params.id);
      return res
        .status(booking.status)
        .json({ message: booking.message, booking: booking.booking });
    } catch (error) {
      next(error);
    }
  }
  async getUserBookings(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("getUserBookings---touched", req.params.id);
      const booking = await this._BookingUseCase.getUserBookings(req.params.id);
      return res
        .status(booking.status)
        .json({ message: booking.message, booking: booking.booking });
    } catch (error) {
      next(error);
    }
  }
}

export default BookingController;
