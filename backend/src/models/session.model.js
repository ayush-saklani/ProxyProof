import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    qr_code: {
        type: String,
        required: true,
    },
    location: {
        latitude: {
            type: Number,
            required: true,
        },
        longitude: {
            type: Number,
            required: true,
        },
    },
}, { timestamps: true });

const Sessions = mongoose.model("Session", sessionSchema);

export default Sessions;
