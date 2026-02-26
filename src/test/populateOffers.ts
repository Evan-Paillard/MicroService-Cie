import fetch from "node-fetch";
import { app } from "../index";
import { Server } from "http";
import mongoose from "mongoose";
import { OfferModel } from "../offers/offer.model";

let server: Server;

async function startServer() {
    return new Promise<void>((resolve) => {
        server = app.listen(3000, () => {
            console.log("Population server started on port 3000");
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

async function populateAndVerify() {
    await startServer();

    try {
        // Clear existing offers
        await OfferModel.deleteMany({});
        console.log("Cleared existing offers.");

        const offers = [
            { title: "DevOps Intern", link: "http://a.com", city: "Paris", domain: "IT", salary: 1200, startDate: new Date(), endDate: new Date(), available: true },
            { title: "Frontend Dev", link: "http://b.com", city: "Paris", domain: "IT", salary: 1400, startDate: new Date(), endDate: new Date(), available: false }, // Unavailable
            { title: "Finance Intern", link: "http://c.com", city: "London", domain: "Finance", salary: 2000, startDate: new Date(), endDate: new Date(), available: true },
            { title: "Marketing Intern", link: "http://d.com", city: "Berlin", domain: "Marketing", salary: 1000, startDate: new Date(), endDate: new Date(), available: true },
            { title: "Backend Dev", link: "http://e.com", city: "Berlin", domain: "IT", salary: 1600, startDate: new Date(), endDate: new Date(), available: true },
        ];

        for (const offer of offers) {
            await new OfferModel(offer).save();
        }
        console.log("Populated 5 offers (1 unavailable).");

        // Verify City Filter (Paris)
        console.log("Testing City Filter: Paris...");
        const parisRes = await fetch("http://localhost:3000/offer?city=Paris");
        const parisOffers: any = await parisRes.json();
        console.log(`Paris Offers: ${parisOffers.length}`);
        if (parisOffers.length !== 1 || parisOffers[0].title !== "DevOps Intern") {
            throw new Error("City filter failed or returned unavailable offer");
        }

        // Verify Domain Filter (IT)
        console.log("Testing Domain Filter: IT...");
        const itRes = await fetch("http://localhost:3000/offer?domain=IT");
        const itOffers: any = await itRes.json();
        console.log(`IT Offers: ${itOffers.length}`);
        if (itOffers.length !== 2) {
            throw new Error("Domain filter failed or returned unavailable offer");
        }

        console.log("All verifications passed!");

    } catch (error) {
        console.error("Population/Verification failed:", error);
    } finally {
        await stopServer();
    }
}

populateAndVerify();
