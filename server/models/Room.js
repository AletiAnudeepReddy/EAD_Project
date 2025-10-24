// server/models/Room.js
import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const RoomSchema = new Schema({
  roomNumber: { type: String, required: true, unique: true, index: true },
  hostelName: { type: String, required: true },
  capacity: { type: Number, required: true, min: 1, default: 1 },
  currentOccupancy: { type: Number, default: 0 },
  status: { type: String, enum: ["Vacant", "Filled"], default: "Vacant" },
}, { timestamps: true });

export default models.Room || model("Room", RoomSchema);
