import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";

dotenv.config({ path: "./.env" });

const app = express();

app.use(
    cors({
        origin: [
            "http://localhost:5500",
            "https://classsync.vercel.app",
            "https://gehutimetable.vercel.app",
            "https://projectclasssync.vercel.app",
            "https://navit.vercel.app",
            "https://proxyproof.vercel.app",
            "http://localhost:3000",
        ],
        credentials: true,
    })
);

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(cookieParser());
app.use(express.json({ limit: "4MB" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Mount all routes
app.use(routes);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ status: "error", message: err.message || "Internal Server Error" });
});

export { app };
