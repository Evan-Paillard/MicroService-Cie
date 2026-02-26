import { Router, Request, Response } from "express";
import fetch from "node-fetch";
import {
    createInternship,
    createInternshipTable,
    getInternshipById,
} from "./internship.repository";
import { studentsbyid } from "../students/students.repository";

export const internshipRouter = Router();

// Create the table on startup
createInternshipTable().catch(console.error);

// POST /internship - Register a student for an internship
internshipRouter.post("/", async (req: Request, res: Response) => {
    const { offerId, studentId } = req.body;

    if (!offerId || !studentId) {
        res.status(400).json({ error: "offerId and studentId are required" });
        return;
    }

    try {
        const offerRes = await fetch(`http://localhost:3000/offer/${offerId}`);

        if (offerRes.status === 404) {
            const internship = await createInternship({
                studentId,
                offerId,
                status: "rejected",
                message: "Offer not found or not available",
            });
            res.status(200).json(internship);
            return;
        }

        if (!offerRes.ok) {
            res.status(502).json({ error: "Error communicating with Erasmumu" });
            return;
        }

        const offer: any = await offerRes.json();

        const student = await studentsbyid(studentId);

        if (!student) {
            res.status(404).json({ error: "Student not found" });
            return;
        }

        let status: "approved" | "rejected";
        let message: string;

        if (offer.domain === student.domain) {
            status = "approved";
            message = "Student successfully registered";
        } else {
            status = "rejected";
            message = "Offer domain doesn't match";
        }

        const internship = await createInternship({ studentId, offerId, status, message });
        res.status(201).json(internship);

    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET /internship/:id - Retrieve a registration by ID
internshipRouter.get("/:id", async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);
        const internship = await getInternshipById(id);

        if (!internship) {
            res.status(404).json({ error: "Internship registration not found" });
            return;
        }

        res.json(internship);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
