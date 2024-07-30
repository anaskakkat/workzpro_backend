import mongoose, { Model, Schema, Document } from "mongoose";
import Admin from "../../entities/admin";

const adminSchema: Schema<Admin & Document> = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const adminModel: Model<Admin & Document> = mongoose.model<Admin & Document>(
  "Admin",
  adminSchema
);

export default adminModel;
