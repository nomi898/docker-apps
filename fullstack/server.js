const express = require("express");
const os = require("os");
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
const APP_NAME = process.env.APP_NAME || "notes-api";
const notes = [{ id: 1, text: "Learn Docker" }];
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});
app.get("/", (req, res) => {
    res.json({ app: APP_NAME, container: os.hostname() });
});
app.get("/api/notes", (req, res) => {
    res.json(notes);
});
app.post("/api/notes", (req, res) => {
    if (!req.body.text) {
        return res.status(400).json({ error: "text is required" });
    }
    const note = { id: notes.length + 1, text: req.body.text };
    notes.push(note);
    res.status(201).json(note);
});
const server = app.listen(PORT, () => {
    console.log(`${APP_NAME} listening on port ${PORT}`);
});
// docker stop sends SIGTERM: close cleanly instead of being killed after 10s
process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down");
    server.close(() => process.exit(0));
});