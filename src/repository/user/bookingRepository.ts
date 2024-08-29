import mongoose from "mongoose";
import IBooking from "../../entities/booking";
import BookingModel from "../../frameworks/models/bookingsModel";
import { generateId } from "../../frameworks/utils/generateId";

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
    // console.log("id--", id);
    return BookingModel.find({ userId: id })
      .populate("userId")
      .populate("workerId")
      .populate("service");
  }
}

export default BookingRepository;
