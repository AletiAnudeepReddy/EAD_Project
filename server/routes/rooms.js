// server/routes/rooms.js
import express from "express";
import Room from "../models/Room.js";
import Student from "../models/Student.js";
const router = express.Router();

/* 🔹 Utility function to auto-update room status */
async function updateRoomStatus(roomId) {
  const room = await Room.findById(roomId);
  if (!room) return;

  const occupantCount = await Student.countDocuments({ roomId });
  room.currentOccupancy = occupantCount;
  room.status = occupantCount >= room.capacity ? "Filled" : "Vacant";
  await room.save();
}

// 🔹 Create room
router.post("/", async (req, res) => {
  try {
    const { roomNumber, hostelName, capacity } = req.body;
    if (!roomNumber || !hostelName || !capacity)
      return res.status(400).json({ message: "Missing fields" });

    const exists = await Room.findOne({ roomNumber });
    if (exists) return res.status(409).json({ message: "Room exists" });

    const r = new Room({
      roomNumber,
      hostelName,
      capacity,
      currentOccupancy: 0,
      status: "Vacant",
    });
    await r.save();
    return res.status(201).json(r);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Get all rooms
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find().lean();
    return res.json(rooms);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Get only vacant rooms
router.get("/vacant", async (req, res) => {
  try {
    const vacant = await Room.find({ status: "Vacant" });
    return res.json(vacant);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Update room details (auto re-checks status)
router.put("/:id", async (req, res) => {
  try {
    const updated = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Room not found" });

    // Auto adjust occupancy + status
    await updateRoomStatus(updated._id);

    const refreshed = await Room.findById(updated._id);
    return res.json(refreshed);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Delete room (only if no occupants)
router.delete("/:id", async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    if (room.currentOccupancy > 0)
      return res.status(400).json({ message: "Room has occupants" });

    await Room.findByIdAndDelete(room._id);

    // Optionally clear student assignments
    await Student.updateMany({ roomId: room._id }, { $set: { roomId: null } });

    return res.json({ message: "Room deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
