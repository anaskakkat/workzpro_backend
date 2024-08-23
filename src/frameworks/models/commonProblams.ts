import mongoose, { Model, Schema, Document } from "mongoose";
import problams from "../../entities/problams";

const CommonProblamsSchema: Schema<problams & Document> = new Schema(
  {
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
    },
    problemName: {
      type: String,
    },
    estimatedHour: {
      type: Number,
    },
  },
  { timestamps: true }
);
const CommonProblemsModel: Model<problams & Document> = mongoose.model<
  problams & Document
>("CommonProblem", CommonProblamsSchema);

export default CommonProblemsModel;
