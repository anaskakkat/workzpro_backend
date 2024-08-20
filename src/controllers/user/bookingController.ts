import { NextFunction, Request, Response } from "express";
import BookingUsecase from "../../use-cases/user/bookingUsecase";

class BookingController {
  private _BookingUseCase: BookingUsecase;

  constructor(bookingUseCase: BookingUsecase) {
    this._BookingUseCase = bookingUseCase;
  }

  async getBooking(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log('getBooking---touched',req.params.id);
      const bookingData = await this._BookingUseCase.getBooking(req.params.id);
      return res.status(200).json(bookingData);
    } catch (error) {
      next(error);
    }
  }
  async getBookingWorker(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log('getBooking---touched',req.params.id);
      const bookingData = await this._BookingUseCase.getBookingWorker(req.params.id);
      return res.status(200).json(bookingData);
    } catch (error) {
      next(error);
    }
  }
}

export default BookingController;
