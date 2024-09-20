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
      req.app.locals.bookingId = bookingId;
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
    const stripe = new Stripe(STRIPE_SECRET_KEY);
    console.log('id------------',req.app.locals.bookingId);
    
    let event = req.body;
    const endpointSecret =
      "whsec_940bb197ba5228daa037e1e506cb5302b0d8352c81d9f10fc137ba9e3edb5855";

    console.log(event);
    if (endpointSecret) {
      const sig: any = req.headers["stripe-signature"];
      try {
        const payloadString = JSON.stringify(req.body, null, 2);
        const paymentIntentId = req.body?.data?.object?.payment_intent;
        console.log(paymentIntentId, "paymentn inteten");
        const header = stripe.webhooks.generateTestHeaderString({
          payload: payloadString,
          secret: endpointSecret,
        });
        event = stripe.webhooks.constructEvent(
          payloadString,
          header,
          endpointSecret
        );

        if (paymentIntentId) {
          console.log("pymnt intnt");
          const paymentIntentResponse = await stripe.paymentIntents.retrieve(
            paymentIntentId
          );
          const paymentIntent = paymentIntentResponse;
          if (paymentIntentResponse.latest_charge) {
            const chargeId = paymentIntentResponse.latest_charge;
            console.log(chargeId, "koooooooooo");
            req.app.locals.chargeId = chargeId;
          } else {
            return null;
          }
        }
      } catch (err) {
        console.log("errrrr", err);
        throw err;
      }
    }

    console.log(event.type);
    if (event.type == "checkout.session.completed") {
      console.log("hdfjhdjhf");
      const updatePAymentstatus=await this._BookingUseCase.updatePayment(req.app.locals.bookingId)
      
    }
  }
}

export default BookingController;
