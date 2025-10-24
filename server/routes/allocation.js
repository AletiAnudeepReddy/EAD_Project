// server/routes/allocation.js
import express from "express";
import Allocation from "../models/Allocation.js";
import Student from "../models/Student.js";
import Room from "../models/Room.js";
import mongoose from "mongoose";
const router = express.Router();

/**
 * POST /allocate
 * body: { studentId, roomId }
 * - checks: student not already allocated, room has capacity
 * - creates Allocation doc, updates Student.roomId and Room.currentOccupancy & status
 */
router.post("/allocate", async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { studentId, roomId } = req.body;
    if (!studentId || !roomId) return res.status(400).json({ message: "studentId and roomId required" });

    await session.withTransaction(async () => {
      // reload inside transaction
      const student = await Student.findById(studentId).session(session);
      const room = await Room.findById(roomId).session(session);

      if (!student) throw { status: 404, message: "Student not found" };
      if (!room) throw { status: 404, message: "Room not found" };

      // check student allocation
      const existingAlloc = await Allocation.findOne({ student: student._id }).session(session);
      if (existingAlloc) throw { status: 400, message: "Student already assigned a room" };

      // check room capacity
      if (room.currentOccupancy >= room.capacity) throw { status: 400, message: "Room already full" };

      // create allocation
      const allocation = new Allocation({ student: student._id, room: room._id });
      await allocation.save({ session });

      // update room occupancy
      room.currentOccupancy += 1;
      room.status = room.currentOccupancy >= room.capacity ? "Filled" : "Vacant";
      await room.save({ session });

      // update student
      student.roomId = room._id;
      await student.save({ session });

      res.status(201).json({ message: "Allocated", allocation });
    });
  } catch (err) {
    console.error(err);
    if (err && err.status) return res.status(err.status).json({ message: err.message });
    return res.status(500).json({ message: "Server error" });
  } finally {
    session.endSession();
  }
});

// GET allocations (with details)
router.get("/", async (req, res) => {
  try {
    const allocations = await Allocation.find()
      .populate("student", "name rollNumber")
      .populate("room", "roomNumber hostelName")
      .sort({ createdAt: -1 });
    return res.json(allocations);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Deallocate (remove allocation)
router.post("/deallocate", async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { allocationId } = req.body;
    if (!allocationId) return res.status(400).json({ message: "allocationId required" });

    await session.withTransaction(async () => {
      const alloc = await Allocation.findById(allocationId).session(session);
      if (!alloc) throw { status: 404, message: "Allocation not found" };

      const room = await Room.findById(alloc.room).session(session);
      const student = await Student.findById(alloc.student).session(session);

      // remove allocation
      await alloc.remove({ session });

      // decrement room occupancy
      if (room) {
        room.currentOccupancy = Math.max(0, (room.currentOccupancy || 0) - 1);
        room.status = room.currentOccupancy >= room.capacity ? "Filled" : "Vacant";
        await room.save({ session });
      }

      // clear student's roomId
      if (student) {
        student.roomId = null;
        await student.save({ session });
      }

      res.json({ message: "Deallocated" });
    });
  } catch (err) {
    console.error(err);
    if (err && err.status) return res.status(err.status).json({ message: err.message });
    return res.status(500).json({ message: "Server error" });
  } finally {
    session.endSession();
  }
});

export default router;
