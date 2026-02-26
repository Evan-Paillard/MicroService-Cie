import fetch from "node-fetch";
import { app } from "../index";
import { Server } from "http";
import mongoose from "mongoose";
import { OfferModel } from "../offers/offer.model";
import { pool } from "../db";

let server: Server;

async function startServer() {
    return new Promise<void>((resolve) => {
        server = app.listen(3000, () => {
            console.log("Test server started on port 3000");
            resolve();
        });
    });
}

async function stopServer() {
    return new Promise<void>((resolve, reject) => {
        server.close(async (err) => {
            if (err) reject(err);
            else {
                await mongoose.disconnect();
                await pool.end();
                resolve();
            }
        });
    });
}

async function testInternships() {
    await startServer();

    try {
        const { createInternshipTable } = await import("../internships/internship.repository");
        await createInternshipTable();

        await OfferModel.deleteMany({});
        await pool.query("DELETE FROM internships");
        await pool.query("DELETE FROM students");

        const studentRes = await fetch("http://localhost:3000/students", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstname: "Evan", name: "Dupont", domain: "IT" })
        });
        const student: any = await studentRes.json();
        console.log("Student created:", student);

        const offer = await new OfferModel({
            title: "DevOps Intern",
            link: "http://example.com",
            city: "Paris",
            domain: "IT",
            salary: 1500,
            startDate: new Date(),
            endDate: new Date(),
            available: true
        }).save();
        console.log("Offer created:", offer._id.toString());

        const unavailableOffer = await new OfferModel({
            title: "Finance Intern",
            link: "http://example.com/finance",
            city: "London",
            domain: "Finance",
            salary: 2000,
            startDate: new Date(),
            endDate: new Date(),
            available: false
        }).save();

        // === Test 1: Approved (domains match) ===
        console.log("\n--- Test 1: Approved registration ---");
        const approvedRes = await fetch("http://localhost:3000/internship", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ offerId: offer._id.toString(), studentId: student.id })
        });
        const approved: any = await approvedRes.json();
        console.log("Status:", approvedRes.status, "| Result:", approved);
        if (approved.status !== "approved") throw new Error("Expected approved!");

        // === Test 2: Rejected (domain mismatch - create Finance student) ===
        console.log("\n--- Test 2: Rejected (domain mismatch) ---");
        const student2Res = await fetch("http://localhost:3000/students", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstname: "Leo", name: "Martin", domain: "Finance" })
        });
        const student2: any = await student2Res.json();
        const rejectedRes = await fetch("http://localhost:3000/internship", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ offerId: offer._id.toString(), studentId: student2.id })
        });
        const rejected: any = await rejectedRes.json();
        console.log("Status:", rejectedRes.status, "| Result:", rejected);
        if (rejected.status !== "rejected") throw new Error("Expected rejected!");

        // === Test 3: Rejected (unavailable offer) ===
        console.log("\n--- Test 3: Rejected (unavailable offer) ---");
        const unavailableRes = await fetch("http://localhost:3000/internship", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ offerId: unavailableOffer._id.toString(), studentId: student.id })
        });
        const unavailable: any = await unavailableRes.json();
        console.log("Status:", unavailableRes.status, "| Result:", unavailable);
        if (unavailable.status !== "rejected") throw new Error("Expected rejected for unavailable offer!");

        // === Test 4: GET /internship/:id ===
        console.log("\n--- Test 4: GET /internship/:id ---");
        const getRes = await fetch(`http://localhost:3000/internship/${approved.id}`);
        const fetched: any = await getRes.json();
        console.log("Fetched:", fetched);
        if (fetched.id !== approved.id) throw new Error("GET internship failed!");

        console.log("\nAll tests passed!");

    } catch (error) {
        console.error("\nTest failed:", error);
    } finally {
        await stopServer();
    }
}

testInternships();
