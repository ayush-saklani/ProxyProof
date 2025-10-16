import prisma from "../db/prisma.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";


// Create a new attendance session
export const createAttendance = async (req, res) => {
    try {
        const { teacher_email, subject_code, course, semester, section, date, start_time, end_time, location } = req.body;
        const attendance = await prisma.attendance.create({
            data: { teacher_email, subject_code, course, semester, section, date: new Date(date), start_time, end_time, location }
        });
        res.status(201).json(attendance);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all sessions for a teacher
export const getTeacherAttendance = async (req, res) => {
    try {
        const { teacher_email } = req.query;
        const sessions = await prisma.attendance.findMany({
            where: { teacher_email: String(teacher_email) },
            include: { students: true }
        });
        res.json(sessions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
