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

bookingRouter.post("/:id", authenticateToken, (req, res, next) => {
  bookingController.bookingData(req, res, next);
});
bookingRouter.get("/:id", authenticateToken, (req, res, next) => {
  bookingController.getbookingData(req, res, next);
});
bookingRouter.get("/user/:id", authenticateToken, (req, res, next) => {
  bookingController.getUserBookings(req, res, next);
});

export default bookingRouter;
