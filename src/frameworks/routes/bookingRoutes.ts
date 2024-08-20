import express, { Router } from "express";
import BookingRepository from "../../repository/user/bookingRepository";
import BookingUsecase from "../../use-cases/user/bookingUsecase";
import BookingController from "../../controllers/user/bookingController";
import authenticateToken from "../middlewares/authenticateToken ";

const bookingRouter = express.Router();

//repository's------------
const bookingRepository = new BookingRepository();

//usecases----------
const bookingUsecase  = new BookingUsecase(bookingRepository);

//controller-----
const bookingController = new BookingController(bookingUsecase);

bookingRouter.use(authenticateToken);

bookingRouter.get("/:id/userId", (req, res, next) => {    
  bookingController.getBooking(req, res, next); 
});
bookingRouter.get("/:id/WorkerId", (req, res, next) => {    
  bookingController.getBookingWorker(req, res, next); 
});

export default bookingRouter