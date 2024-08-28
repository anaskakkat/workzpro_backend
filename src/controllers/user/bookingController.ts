import { NextFunction, Request, Response } from "express";
import BookingUsecase from "../../use-cases/user/bookingUsecase";

class BookingController {
  private _BookingUseCase: BookingUsecase;

  constructor(bookingUseCase: BookingUsecase) {
    this._BookingUseCase = bookingUseCase;
  }

 
}

export default BookingController;
