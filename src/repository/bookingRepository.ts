import mongoose, { ObjectId, Types } from "mongoose";
import BookingModel from "../frameworks/models/bookingsModel";
import IBooking from "../entities/booking";
import { generateId } from "../frameworks/utils/generateId";
import ReviewModel from "../frameworks/models/reviewModel";
import PaymentModel from "../frameworks/models/paymentModel";

class BookingRepository {
  async findBookingById(id: string) {
    // console.log("id--", id);
    return BookingModel.findById(id)
      .populate("userId")
      .populate("workerId")
      .populate("service");
  }

  async saveBooking(userId: string, bookingData: IBooking) {
    let bookingNumber = generateId();
    const booking = {
      userId,
      workerId: bookingData.workerId,
      bookingNumber,
      description: bookingData.description,
      bookingDate: bookingData.bookingDate,
      slots: bookingData.slots,
      service: bookingData.service,
      address: bookingData.address,
    };
    return await BookingModel.create(booking);
  }
  async findBookingsByUserId(id: string) {
    return await BookingModel.find({ userId: id })
      .populate("userId")
      .populate({
        path: "workerId",
        populate: {
          path: "service",
        },
      })
      .populate("service")
      .populate("review")
      // .sort({ bookingDate: -1 });
      .sort({ createdAt: -1 });
  }
  async findBookingsByBookingId(workerId: string, date: string) {
    const targetDate = new Date(date);
    const formattedDate = targetDate.toISOString().split("T")[0];
    return (
      BookingModel.find({
        workerId: workerId,
        $expr: {
          $eq: [
            { $dateToString: { format: "%Y-%m-%d", date: "$bookingDate" } },
            formattedDate,
          ],
        },
      })
        .populate("userId")
        .populate({
          path: "workerId",
          populate: {
            path: "service",
          },
        })
        .populate("service")
        // .sort({ bookingDate: -1 })
        .sort({ createdAt: -1 })
        .exec()
    );
  }
  async addReview(
    userId: string,
    bookingId: string,
    rating: number,
    comment: string,
    workerId: string
  ) {
    const newReview = new ReviewModel({
      user: userId,
      booking: bookingId,
      rating,
      comment,
      workerId,
    });

    return await newReview.save();
  }
  async addReviewIdToBooking(bookingId: string, reviewId: Object) {
    return await BookingModel.findByIdAndUpdate(
      bookingId,
      { $set: { review: reviewId } },
      { new: true }
    );
  }
  async updateReview(reviewId: string, rating: number, comment: string) {
    return await ReviewModel.findOneAndUpdate(
      { _id: reviewId },
      { rating, comment },
      { new: true }
    );
  }
  async findFetchReviews(workerId: string) {
    return await ReviewModel.find({ workerId: workerId })
      .populate("user")
      .populate("workerId");
  }
  async updatePayment(bookingId: string) {
    return await BookingModel.findByIdAndUpdate(
      bookingId,
      { paymentStatus: "success", paymentDate: new Date() },
      { new: true }
    ).populate("paymentDetails");
  }
  // payment id save to booking
  async updatePaymentDetails(bookingId: string, paymentId: string) {
    return await BookingModel.findByIdAndUpdate(
      bookingId,
      { paymentDetails: paymentId },
      { new: true }
    );
  }
  // payment id updatePaymentDetailsStatus
  async updatePaymentDetailsStatus(paymentDetailsId: Types.ObjectId) {
    return await PaymentModel.findByIdAndUpdate(
      paymentDetailsId,
      { paymentStatus: "success" },
      { new: true }
    );
  }
}

export default BookingRepository;
