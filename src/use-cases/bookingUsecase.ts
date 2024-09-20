import IBooking from "../entities/booking";
import { STRIPE_SECRET_KEY } from "../frameworks/constants/env";
import { CostumeError } from "../frameworks/middlewares/customError";
import BookingRepository from "../repository/bookingRepository";
import Stripe from "stripe";
const stripe = new Stripe(STRIPE_SECRET_KEY);
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
    // console.log("booking----------", booking);
    if (!booking) {
      throw new CostumeError(404, "Booking not found");
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: booking.service.service,
              description: booking.description,
            },
            unit_amount: booking.service.amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:8000/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:8000/cancel`,
    });

    return {
      status: 200,
      url: session.url,
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
  async webhook(signature: string) {
    try {


   
    } catch (error) {
      throw error;
    }
  }
}

export default BookingUsecase;
