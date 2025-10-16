import mongoose from "mongoose";

const attendance = new mongoose.Schema({
    teacher_email: {
        type: String,
        required: true,
    },
    subject_code: {
        type: String,
        required: true,
    },
    course: {
        type: String,
        required: true,
    },
    semester: {
        type: String,
        required: true,
    },
    section: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    start_time: {
        type: String,
        required: true,
    },
    end_time: {
        type: String,
        required: true,
    },
    location: {
        type: [String],
        required: true,
    },
}, { timestamps: true });

const Attendance = new mongoose.model("Attendance", attendance);
export default Attendance;