// server/models/Allocation.js
import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const AllocationSchema = new Schema({
  student: { type: mongoose.Types.ObjectId, ref: "Student", required: true },
  room: { type: mongoose.Types.ObjectId, ref: "Room", required: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

AllocationSchema.index({ student: 1 }, { unique: true }); // ensure one allocation per student

export default models.Allocation || model("Allocation", AllocationSchema);
