import express, { Router } from "express";
import BookingUsecase from "../../use-cases/bookingUsecase";
import BookingController from "../../controllers/bookingController";
import authenticateToken from "../middlewares/authenticateToken ";
import BookingRepository from "../../repository/bookingRepository";

const bookingRouter = express.Router();

//repository's------------
const bookingRepository = new BookingRepository();

//usecases----------
const bookingUsecase = new BookingUsecase(bookingRepository);

//controller-----
const bookingController = new BookingController(bookingUsecase);

bookingRouter.post("/add/:id", authenticateToken, (req, res, next) => {
  bookingController.bookingData(req, res, next);
});
bookingRouter.get("/:id", authenticateToken, (req, res, next) => {
  bookingController.getbookingData(req, res, next);
});
bookingRouter.get("/user/:id", authenticateToken, (req, res, next) => {
  bookingController.getUserBookings(req, res, next);
});

bookingRouter.get("/:id/date/:date", authenticateToken, (req, res, next) => {
  bookingController.getBookingsByDate(req, res, next);
});
bookingRouter.post("/payment/:id", authenticateToken, (req, res, next) => {
  bookingController.processPayment(req, res, next);
});
bookingRouter.post("/review", authenticateToken, (req, res, next) => {
  bookingController.addReview(req, res, next);
});
bookingRouter.patch("/review", authenticateToken, (req, res, next) => {
  bookingController.updateReview(req, res, next);
});
bookingRouter.get("/review/:workerId", authenticateToken, (req, res, next) => {
  bookingController.fetchReviews(req, res, next);
});
bookingRouter.post("/webhook",express.raw({type: 'application/json'}), (req, res, next) => {
  bookingController.webhook(req, res, next);
});

export default bookingRouter;
