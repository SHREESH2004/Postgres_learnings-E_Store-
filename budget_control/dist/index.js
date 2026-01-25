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
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send("Budget Control Service is running");
});
app.post("/transactions", async (req, res) => {
    const { fromId, toId, amount } = req.body;
    if (!fromId || !toId || amount <= 0) {
        res.status(400).json({ error: "Invalid transaction data" });
        return;
    }
    const client = await (0, db_1.getClient)();
    try {
        await client.query("BEGIN");
        const senderUpdate = await client.query("UPDATE accounts SET balance = balance - $1 WHERE account_id = $2 AND balance >= $1 RETURNING account_id", [amount, fromId]);
        if (senderUpdate.rowCount === 0) {
            throw new Error("Insufficient funds or invalid sender ID");
        }
        const receiverUpdate = await client.query("UPDATE accounts SET balance = balance + $1 WHERE account_id = $2 RETURNING account_id", [amount, toId]);
        if (receiverUpdate.rowCount === 0) {
            throw new Error("Invalid receiver ID");
        }
        await client.query("COMMIT");
        res.status(200).json({ message: "Transaction completed successfully" });
    }
    catch (error) {
        if (client)
            await client.query("ROLLBACK");
        res.status(500).json({ error: "Transaction failed", details: error.message });
    }
    finally {
        client.release();
    }
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