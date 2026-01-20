"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Default to 3000 if PORT is not defined in .env
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
    res.send("Budget Control Service is running");
});
async function startServer() {
    try {
        const client = await (0, db_1.getClient)();
        console.log("Connected to Neon PostgreSQL successfully.");
        client.release();
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to start server due to DB connection error:", error);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=index.js.map