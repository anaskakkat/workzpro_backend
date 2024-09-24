import IBooking from "../entities/booking";
import {
  STRIPE_ENDPOINT_SECRET,
  STRIPE_SECRET_KEY,
} from "../frameworks/constants/env";
import { CostumeError } from "../frameworks/middlewares/customError";
import PaymentModel from "../frameworks/models/paymentModel";
import { calculatePayment } from "../frameworks/utils/calculatePayment";
import BookingRepository from "../repository/bookingRepository";
import Stripe from "stripe";
import { IStripe } from "./interfaces/users/IStripe";
const stripe = new Stripe(STRIPE_SECRET_KEY);
class BookingUsecase {
  private _bookingRepository: BookingRepository;
  private stripePayments: IStripe;

  constructor(bookingReopsitory: BookingRepository, stripePayments: IStripe) {
    this._bookingRepository = bookingReopsitory;
    this.stripePayments = stripePayments;
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
      const booking = await this._bookingRepository.findBookingById(userId);
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

      console.log("booking----------", booking.length);

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
      return {
        status: 200,
        booking,
      };
    } catch (error) {
      throw error;
    }
  }
  async processPayment(bookingId: string) {
    const booking = await this._bookingRepository.findBookingById(bookingId);

    // console.log("---processPayment---booking----------", booking);
    if (!booking) {
      throw new CostumeError(404, "Booking not found");
    }
    const totalAmount = booking.service.amount;
    const userId = booking.userId._id;
    const workerId = booking.workerId._id;
    // console.log(
    //   "---processPayment---booking----------",
    //   userId,
    //   workerId,
    //   totalAmount
    // );

    // payment save
    const { workerAmount, adminProfit } = calculatePayment(totalAmount);
    const payment = new PaymentModel({
      userId,
      workerId,
      totalAmount,
      workerAmount,
      adminProfit,
    });
    const paymentData = await payment.save();
    // console.log("---processPayment---paymentData----------", paymentData);
    await this._bookingRepository.updatePaymentDetails(
      bookingId,
      paymentData._id as string
    );
    // Create Stripe Checkout session

    const session = await this.stripePayments.makePayment(
      paymentData.totalAmount,
      booking.service.service
    );

    return {
      status: 200,
      url: session,
    };
  }
  async addReview(
    userId: string,
    bookingId: string,
    rating: number,
    comment: string,
    workerId: string
  ) {
    try {
      const review = await this._bookingRepository.addReview(
        userId,
        bookingId,
        rating,
        comment,
        workerId
      );
      const updatedBooking = await this._bookingRepository.addReviewIdToBooking(
        bookingId,
        review._id
      );
      // console.log("updatedBooking--", updatedBooking);
      if (!updatedBooking) {
        throw new CostumeError(400, "not updated booking");
      }
      return {
        status: 200,
        message: "Review Added",
      };
    } catch (error) {
      throw error;
    }
  }
  async updateReview(reviewId: string, rating: number, comment: string) {
    try {
      const review = await this._bookingRepository.updateReview(
        reviewId,
        rating,
        comment
      );

      if (!review) {
        throw new CostumeError(400, "not updated review");
      }

      return {
        status: 200,
        message: "Review Updated",
      };
    } catch (error) {
      throw error;
    }
  }
  async fetchReviews(workerId: string) {
    try {
      const review = await this._bookingRepository.findFetchReviews(workerId);

      if (!review) {
        throw new CostumeError(400, "not fethed  reviews data");
      }

      return {
        status: 200,
        message: "Review fethed",
        review,
      };
    } catch (error) {
      throw error;
    }
  }

  async handleStripeWebhook(req: any, bookingId: string) {
    // console.log("---updatePayment---bookingId----------", bookingId);
    try {
      const verifyPayment = await this.stripePayments.verifySucessOfWebhook(
        req
      );
      console.log("---verifyPayment---", verifyPayment);

      if (verifyPayment) {
        const updatedBooking  = await this._bookingRepository.updatePayment(
          bookingId
        );
        console.log("-updatePayment---updatedPayment--", updatedBooking);

        if (!updatedBooking) {
          throw new CostumeError(400, "Booking not found");
        }
        if (updatedBooking.paymentDetails) {
          const paymentDetailsId = updatedBooking.paymentDetails._id; 
          await this._bookingRepository.updatePaymentDetailsStatus(paymentDetailsId);
        }
      }
    } catch (error) {
      throw error;
    }
  }

  // async updatePayment(bookingId: string) {
  //   console.log("---updatePayment---bookingId----------", bookingId);

  //   try {
  //     const updatedPayment = await this._bookingRepository.updatePayment(
  //       bookingId
  //     );
  //     console.log(
  //       "-----updatePayment---updatedPayment----------",
  //       updatedPayment
  //     );

  //     if (!updatedPayment) {
  //       throw new CostumeError(400, "Booking not found");
  //     }
  //     return {
  //       status: 200,
  //       message: "Payment Success",
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}

export default BookingUsecase;
