import express from "express";
import Allocation from "../models/Allocation.js";
import Student from "../models/Student.js";
import Room from "../models/Room.js";
import mongoose from "mongoose";

const router = express.Router();

// helper: check if replica set enabled
const isReplicaSet = () => mongoose.connection.client.topology.s.replset;

// ✅ Allocate Room
router.post("/allocate", async (req, res) => {
  const { studentId, roomId } = req.body;
  if (!studentId || !roomId)
    return res.status(400).json({ message: "studentId and roomId required" });

  let session;
  try {
    if (isReplicaSet()) session = await mongoose.startSession();

    const runOps = async () => {
      const student = await Student.findById(studentId).session(session || null);
      const room = await Room.findById(roomId).session(session || null);

      if (!student) throw { status: 404, message: "Student not found" };
      if (!room) throw { status: 404, message: "Room not found" };

      const existingAlloc = await Allocation.findOne({ student: student._id }).session(session || null);
      if (existingAlloc) throw { status: 400, message: "Student already assigned a room" };

      if (room.currentOccupancy >= room.capacity) throw { status: 400, message: "Room already full" };

      const allocation = new Allocation({ student: student._id, room: room._id });
      await allocation.save({ session });

      room.currentOccupancy += 1;
      room.status = room.currentOccupancy >= room.capacity ? "Filled" : "Vacant";
      await room.save({ session });

      student.roomId = room._id;
      await student.save({ session });

      res.status(201).json({ message: "Room allocated successfully", allocation });
    };

    if (session) {
      await session.withTransaction(runOps);
    } else {
      await runOps();
    }

  } catch (err) {
    console.error("Allocation error:", err);
    if (err.status) return res.status(err.status).json({ message: err.message });
    res.status(500).json({ message: "Server error" });
  } finally {
    if (session) session.endSession();
  }
});

// ✅ Get All Allocations
router.get("/", async (req, res) => {
  try {
    const allocations = await Allocation.find()
      .populate("student", "name rollNumber")
      .populate("room", "roomNumber hostelName")
      .sort({ createdAt: -1 });
    res.json(allocations);
  } catch (err) {
    console.error("Get allocations error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Deallocate Room
router.post("/deallocate", async (req, res) => {
  const { allocationId } = req.body;
  if (!allocationId)
    return res.status(400).json({ message: "allocationId required" });

  let session;
  try {
    if (isReplicaSet()) session = await mongoose.startSession();

    const runOps = async () => {
      const alloc = await Allocation.findById(allocationId).session(session || null);
      if (!alloc) throw { status: 404, message: "Allocation not found" };

      const room = await Room.findById(alloc.room).session(session || null);
      const student = await Student.findById(alloc.student).session(session || null);

      await alloc.deleteOne({ session });

      if (room) {
        room.currentOccupancy = Math.max(0, room.currentOccupancy - 1);
        room.status = room.currentOccupancy >= room.capacity ? "Filled" : "Vacant";
        await room.save({ session });
      }

      if (student) {
        student.roomId = null;
        await student.save({ session });
      }

      res.json({ message: "Deallocated successfully" });
    };

    if (session) {
      await session.withTransaction(runOps);
    } else {
      await runOps();
    }

  } catch (err) {
    console.error("Deallocation error:", err);
    if (err.status) return res.status(err.status).json({ message: err.message });
    res.status(500).json({ message: "Server error" });
  } finally {
    if (session) session.endSession();
  }
});

export default router;
