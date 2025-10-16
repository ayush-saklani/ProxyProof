import { Router } from "express";
import { markAttendance, getStudentAttendance } from "../controllers/studentAttendanceController.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/records", getStudentAttendance);       // Public route (optional)
router.post("/mark", verifyJWT, markAttendance);    // Secured route

export default router;
