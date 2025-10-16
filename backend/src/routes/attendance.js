import { Router } from "express";
import {
  createAttendance,
  getTeacherAttendance,
} from "../controllers/attendanceController.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Public route (if any)
router.get("/sessions", getTeacherAttendance);

// Secured routes
router.post("/create", verifyJWT, createAttendance);

export default router;
