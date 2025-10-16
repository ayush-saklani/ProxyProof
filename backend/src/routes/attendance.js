import { Router } from "express";
import { createAttendance, getTeacherAttendance } from "../controllers/attendanceController.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/sessions", getTeacherAttendance);          // Public route (if any)
router.post("/create", verifyJWT, createAttendance);    // Secured routes

export default router;