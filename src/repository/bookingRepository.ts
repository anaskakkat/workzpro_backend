import mongoose from "mongoose";
import BookingModel from "../frameworks/models/bookingsModel";
import IBooking from "../entities/booking";
import { generateId } from "../frameworks/utils/generateId";

class BookingRepository {
  async findBookingsById(id: string) {
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
    return BookingModel.find({ userId: id })
      .populate("userId")
      .populate({
        path: "workerId",
        populate: {
          path: "service",
        },
      })
      .populate("service")
      .sort({ bookingDate: -1 })
      .exec();
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
        // .populate("userId")
        // .populate({
        //   path: "workerId",
        //   populate: {
        //     path: "service",
        //   },
        // })
        // .populate("service")
        // .sort({ bookingDate: -1 })
        .exec()
    );
  }
}

export default BookingRepository;
