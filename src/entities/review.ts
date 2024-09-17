import mongoose from "mongoose";

interface IReview extends Document {
  user: mongoose.Schema.Types.ObjectId;
  booking: mongoose.Schema.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

export default IReview;
