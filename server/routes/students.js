// server/routes/students.js
import express from "express";
import Student from "../models/Student.js";
import Room from "../models/Room.js";
const router = express.Router();

// Create student
router.post("/", async (req, res) => {
  try {
    const { name, rollNumber, department, gender, contact } = req.body;
    if (!name || !rollNumber) return res.status(400).json({ message: "Name and rollNumber required" });

    const existing = await Student.findOne({ rollNumber });
    if (existing) return res.status(409).json({ message: "Student with this roll number exists" });

    const student = new Student({ name, rollNumber, department, gender, contact });
    await student.save();
    return res.status(201).json(student);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Read all students (with room populated)
router.get("/", async (req, res) => {
  try {
    const students = await Student.find().populate("roomId", "roomNumber hostelName capacity status");
    return res.json(students);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Read single
router.get("/:id", async (req, res) => {
  try {
    const s = await Student.findById(req.params.id).populate("roomId");
    if (!s) return res.status(404).json({ message: "Student not found" });
    return res.json(s);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

// Update (including reassigning roomId should be done via allocation API ideally)
router.put("/:id", async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Student not found" });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

// Delete student and free room if assigned
router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // If assigned, decrement occupancy and possibly update room status
    if (student.roomId) {
      const room = await Room.findById(student.roomId);
      if (room) {
        room.currentOccupancy = Math.max(0, room.currentOccupancy - 1);
        room.status = room.currentOccupancy >= room.capacity ? "Filled" : "Vacant";
        await room.save();
      }
    }

    await student.remove();
    return res.json({ message: "Student deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
