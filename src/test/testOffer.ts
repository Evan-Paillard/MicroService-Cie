import fetch from "node-fetch";
import { app } from "../index";
import { Server } from "http";
import mongoose from "mongoose";

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
                resolve();
            }
        });
    });
}

async function testOffer() {
    await startServer();
    try {
        // Create Offer
        console.log("Creating Offer...");
        const createRes = await fetch("http://localhost:3000/offer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: "Software Engineer Intern",
                link: "https://example.com/job",
                city: "Berlin",
                domain: "IT",
                salary: 1500,
                startDate: new Date(),
                endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
                available: true
            })
        });
        const createdOffer: any = await createRes.json();
        console.log("Created:", createdOffer);

        if (!createdOffer._id) throw new Error("Failed to create offer");

        // Get Offer By ID
        console.log("Getting Offer by ID...");
        const getRes = await fetch(`http://localhost:3000/offer/${createdOffer._id}`);
        const fetchedOffer = await getRes.json();
        console.log("Fetched:", fetchedOffer);

        // Get Offer By City
        console.log("Getting Offers by City...");
        const getCityRes = await fetch("http://localhost:3000/offer?city=Berlin");
        const cityOffers = await getCityRes.json();
        console.log("City Offers:", cityOffers);

        // Update Offer
        console.log("Updating Offer...");
        const updateRes = await fetch(`http://localhost:3000/offer/${createdOffer._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ salary: 2000 })
        });
        const updatedOffer = await updateRes.json();
        console.log("Updated:", updatedOffer);

        // Delete Offer
        console.log("Deleting Offer...");
        const deleteRes = await fetch(`http://localhost:3000/offer/${createdOffer._id}`, {
            method: "DELETE"
        });
        console.log("Delete Status:", deleteRes.status);

    } catch (error) {
        console.error("Test failed", error);
    } finally {
        await stopServer();
    }
}

testOffer();
