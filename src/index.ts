import express from "express";
import mongoose from "mongoose";
import { studentsRouter } from "./students/students.routes";
import { offersRouter } from "./offers/offer.routes";
import { internshipRouter } from "./internships/internship.routes";

export const app = express();

app.use(express.json());

app.use("/student", studentsRouter);
app.use("/offer", offersRouter);
app.use("/internship", internshipRouter);

const mongoUri = "mongodb://localhost:27017/erasmumu";
mongoose.connect(mongoUri)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB", err));

if (require.main === module) {
    app.listen(3000, () => {
        console.log("Server started on port 3000");
    });
}
