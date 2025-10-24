// server/models/Student.js
import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const StudentSchema = new Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true, index: true },
  department: { type: String },
  gender: { type: String, enum: ["Male", "Female", "Other"], default: "Other" },
  roomId: { type: mongoose.Types.ObjectId, ref: "Room", default: null },
  contact: { type: String },
}, { timestamps: true });

export default models.Student || model("Student", StudentSchema);
