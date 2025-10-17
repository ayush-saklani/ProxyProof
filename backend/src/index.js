import dotenv from "dotenv";
import { app } from "./app.js";
import prisma from "./db/prisma.js";

dotenv.config({ path: "./.env" });

async function startServer() {
    try {
        // Test Prisma DB connection
        await prisma.$connect();
        console.log("PostgreSQL connected successfully");
        app.on("error", (error) => {
            console.error("App error:", error);
            throw error;
        });
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (err) {
        console.error("Database connection failed:", err);
        process.exit(1);
    }
}

startServer();
