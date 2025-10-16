import express from "express";
const router = express.Router();

// New attendance routers
import attendanceRouter from "./attendance.routes.js";
import studentAttendanceRouter from "./studentAttendance.routes.js";

// Mount routes
router.use("/attendance", attendanceRouter);
router.use("/student-attendance", studentAttendanceRouter);

export default router;
