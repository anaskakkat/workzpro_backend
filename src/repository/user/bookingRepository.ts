import BookingModel from "../../frameworks/models/bookingsModel";

class BookingRepository {
  async findBookingsByUserId(id: string) {
    return BookingModel.find({ userId: id })
      .populate("selectedSlot")
      .populate("workerId");
  }
  async findBookingsByWorkerId(id: string) {
    return BookingModel.find({ workerId: id })
      .populate("selectedSlot")
      .populate("workerId");
  }
}

export default BookingRepository;
