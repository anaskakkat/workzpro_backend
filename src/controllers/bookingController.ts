import { NextFunction, Request, Response } from "express";
import BookingUsecase from "../use-cases/bookingUsecase";

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
      // console.log("getUserBookings---touched", req.params.id);
      const booking = await this._BookingUseCase.getUserBookings(req.params.id);
      return res
        .status(booking.status)
        .json({ message: booking.message, booking: booking.booking });
    } catch (error) {
      next(error);
    }
  }
  async getBookingsByDate(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log("getBookingsByDate---touched", req.params);
      const { id, date } = req.params;
      const booking = await this._BookingUseCase.getBookingsByDate(id, date);
      return res.status(booking.status).json(booking);
    } catch (error) {
      next(error);
    }
  }
  async processPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const bookingId = req.params.id;
      // console.log("payment---touched", bookingId);

      const updatedBooking = await this._BookingUseCase.processPayment(
        bookingId
      );

      res.status(200).json(updatedBooking);
    } catch (error) {
      next(error);
    }
  }
  async addReview(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log("addReview---touched", req.body);
      const { userId, bookingId, rating, comment } = req.body;
      const newReview = await this._BookingUseCase.addReview(
        userId,
        bookingId,
        rating,
        comment
      );
      res.status(200).json(newReview.message);
    } catch (error) {
      next(error);
    }
  }
  async updateReview(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("addReview---touched", req.body);
      const { userId, reviewId, rating, comment } = req.body;
      const updatedReview = await this._BookingUseCase.updateReview(
        reviewId,
        rating,
        comment
      );
      res.status(200).json(updatedReview.message);
    } catch (error) {
      next(error);
    }
  }
}

export default BookingController;
