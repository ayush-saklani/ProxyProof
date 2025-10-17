import express from "express";
const router = express.Router();

// New attendance routers
import attendanceRouter from "./attendance.js";
import studentAttendanceRouter from "./studentAttendance.js";

// Mount routes
router.use("/attendance", attendanceRouter);
router.use("/student-attendance", studentAttendanceRouter);

export default router;
