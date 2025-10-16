import prisma from "../db/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Mark a student attendance
const markAttendance = asyncHandler(async (req, res) => {
  const { attendance_id, student_email, valid, snapshot } = req.body;

  if (!attendance_id || !student_email) {
    throw new ApiError(400, "Missing required parameters");
  }

  const record = await prisma.attendance_student.create({
    data: {
      attendance_id,
      student_email,
      valid: valid ?? true,
      snapshot: snapshot ?? null,
    },
  });

  return res.status(201).json(new ApiResponse(200, record, "Student attendance recorded successfully"));
});

// Get attendance records for a student
const getStudentAttendance = asyncHandler(async (req, res) => {
  const { student_email } = req.query;
  if (!student_email) throw new ApiError(400, "Missing student_email");

  const records = await prisma.attendance_student.findMany({
    where: { student_email },
    include: { attendance: true },
    orderBy: { createdAt: "desc" },
  });

  return res.status(200).json(new ApiResponse(200, records, "Fetched student attendance successfully"));
});

export { markAttendance, getStudentAttendance };
