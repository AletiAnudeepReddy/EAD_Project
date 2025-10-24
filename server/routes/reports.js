// server/routes/reports.js
import express from "express";
import ExcelJS from "exceljs";
import Student from "../models/Student.js";
import Room from "../models/Room.js";
import Allocation from "../models/Allocation.js";

const router = express.Router();

// helper to send workbook
async function sendWorkbook(res, workbook, filename) {
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  await workbook.xlsx.write(res);
  res.end();
}

// Students report
router.get("/students", async (req, res) => {
  try {
    const students = await Student.find().populate("roomId", "roomNumber hostelName");
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Students");

    ws.columns = [
      { header: "Name", key: "name", width: 25 },
      { header: "Roll Number", key: "rollNumber", width: 18 },
      { header: "Department", key: "department", width: 15 },
      { header: "Gender", key: "gender", width: 10 },
      { header: "Room", key: "room", width: 15 },
      { header: "Contact", key: "contact", width: 15 },
      { header: "Created At", key: "createdAt", width: 20 },
    ];

    students.forEach((s) => {
      ws.addRow({
        name: s.name,
        rollNumber: s.rollNumber,
        department: s.department,
        gender: s.gender,
        room: s.roomId ? s.roomId.roomNumber : "",
        contact: s.contact,
        createdAt: s.createdAt ? s.createdAt.toISOString() : "",
      });
    });

    await sendWorkbook(res, wb, "Students_Report.xlsx");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Rooms report
router.get("/rooms", async (req, res) => {
  try {
    const rooms = await Room.find();
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Rooms");

    ws.columns = [
      { header: "Room Number", key: "roomNumber", width: 15 },
      { header: "Hostel Name", key: "hostelName", width: 20 },
      { header: "Capacity", key: "capacity", width: 10 },
      { header: "Current Occupancy", key: "currentOccupancy", width: 18 },
      { header: "Status", key: "status", width: 12 },
    ];

    rooms.forEach((r) => {
      ws.addRow({
        roomNumber: r.roomNumber,
        hostelName: r.hostelName,
        capacity: r.capacity,
        currentOccupancy: r.currentOccupancy,
        status: r.status,
      });
    });

    await sendWorkbook(res, wb, "Rooms_Report.xlsx");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Allocations report
router.get("/allocations", async (req, res) => {
  try {
    const allocations = await Allocation.find()
      .populate("student", "name rollNumber")
      .populate("room", "roomNumber hostelName");

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Allocations");

    ws.columns = [
      { header: "Student Name", key: "student", width: 25 },
      { header: "Roll Number", key: "roll", width: 18 },
      { header: "Room Number", key: "roomNumber", width: 15 },
      { header: "Hostel", key: "hostel", width: 18 },
      { header: "Allocated At", key: "date", width: 25 },
    ];

    allocations.forEach((a) => {
      ws.addRow({
        student: a.student ? a.student.name : "",
        roll: a.student ? a.student.rollNumber : "",
        roomNumber: a.room ? a.room.roomNumber : "",
        hostel: a.room ? a.room.hostelName : "",
        date: a.createdAt ? a.createdAt.toISOString() : "",
      });
    });

    await sendWorkbook(res, wb, "Allocations_Report.xlsx");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
