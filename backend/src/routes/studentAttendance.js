import { Router } from "express";
import {
  markAttendance,
  getStudentAttendance,
} from "../controllers/studentAttendanceController.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Public route (optional)
router.get("/records", getStudentAttendance);

// Secured route
router.post("/mark", verifyJWT, markAttendance);

export default router;
