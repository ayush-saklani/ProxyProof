import qrcode from "qrcode";
import Sessions from "../models/session.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const createSession = asyncHandler(async (req, res) => {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
        throw new ApiError(400, "Latitude and longitude are required");
    }

    const session = await Sessions.create({
        location: {
            latitude,
            longitude,
        },
        qr_code: "", // We will update this later
    });

    const sessionId = session._id.toString();
    const qrCodeDataUrl = await qrcode.toDataURL(sessionId);

    session.qr_code = qrCodeDataUrl;
    await session.save();

    res.status(201).json(new ApiResponse(201, { qrCode: qrCodeDataUrl }, "Session created successfully"));
});

export { createSession };
