import { NextFunction, Request, Response } from "express";
import BookingUsecase from "../use-cases/bookingUsecase";
import { STRIPE_SECRET_KEY } from "../frameworks/constants/env";
import { CostumeError } from "../frameworks/middlewares/customError";
import Stripe from "stripe";

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
      const { userId, bookingId, rating, comment, workerId } = req.body;
      const newReview = await this._BookingUseCase.addReview(
        userId,
        bookingId,
        rating,
        comment,
        workerId
      );
      res.status(200).json(newReview.message);
    } catch (error) {
      next(error);
    }
  }
  async updateReview(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("updateReview---touched", req.body);
      const { reviewId, rating, comment } = req.body;
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
  async fetchReviews(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log("fetchReviews---touched", req.params.workerId);
      const workerId = req.params.workerId;
      const reviews = await this._BookingUseCase.fetchReviews(workerId);
      console.log("all reviews--", reviews);

      res
        .status(200)
        .json({ message: reviews.message, reviews: reviews.review });
    } catch (error) {
      next(error);
    }
  }

  //stripe webhook-------------------------------------------------------------------------------
  async webhook(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("webhook---touched");

      const sig = req.headers["stripe-signature"];
      console.log("webhook-sig--", sig);
      if (!sig) {
        console.log("No Stripe signature found in the request");
        return res.status(400).send("Webhook signature missing");
      }
      const endpointSecret =STRIPE_SECRET_KEY;
      if (!endpointSecret) {
        console.log("Stripe webhook secret is missing");
        return res.status(500).send("Webhook secret is not configured");
      } 
      let event;
      try {
        event = Stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        console.log("Webhook event:", event);
      } catch (err) {
        console.log("Error verifying webhook signature:", err);
        // return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      // // Handle the event here (e.g., checkout.session.completed, payment_intent.succeeded)
      // switch (event.type) {
      //   case "checkout.session.completed":
      //     const session = event.data.object;
      //     console.log("Checkout session completed:", session);
      //     break;
      //   default:
      //     console.log(`Unhandled event type: ${event.type}`);
      // }

      res.json({ received: true });
    } catch (error) {
      next(error);
    }
  }
}

export default BookingController;
