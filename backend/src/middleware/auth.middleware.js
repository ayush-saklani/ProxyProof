import { ApiError } from "../utils/ApiError.js";
import { navit_server } from "../utils/constants.js";

export const verifyJWT = async (req, res, next) => {   // verified and working
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw new ApiError(401, "Unauthorized");
        }
        const response = await fetch(`${navit_server}/verifyJWT`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })

        if (!response.ok) {
            throw new ApiError(401, "Unauthorized");
        }

        next();
    } catch (err) {
        console.error("JWT verification error:");
        return res.status(401).json(
            new ApiError(401, {
                message: 'Unauthorized',
                error: err.message
            }, 'Unauthorized')
        );
    }
};