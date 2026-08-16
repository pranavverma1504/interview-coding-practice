import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";


dotenv.config();
const app = express();

let port = process.env.PORT || 4000

app.get("/", (req, res) => {
    res.send("Hello World");
})


app.listen(port, () => {
    connectDB();
    console.log(`Server is running on port ${port}`);
});