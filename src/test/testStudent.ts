import fetch from "node-fetch";

import { app } from "../index";
import { Server } from "http";

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
        server.close((err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

async function testStudentPost() {
    await startServer();
    try {
        const response = await fetch("http://localhost:3000/students", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                firstname: "Evan",
                name: "Evan",
                domain: "Evan",
            }),
        });
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Test failed", error);
    } finally {
        await stopServer();
    }
}

async function testStudentGet() {
    await startServer();
    try {
        const response = await fetch("http://localhost:3000/students", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Test failed", error);
    } finally {
        await stopServer();
    }
}

async function testStudentPut() {
    await startServer();
    try {
        const response = await fetch("http://localhost:3000/students", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                firstname: "Evan",
                name: "Evan",
                domain: "Evan",
            }),
        });
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Test failed", error);
    } finally {
        await stopServer();
    }
}

async function testStudentDelete() {
    await startServer();
    try {
        const response = await fetch("http://localhost:3000/students", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Test failed", error);
    } finally {
        await stopServer();
    }
}

async function testStudentGetByDomain() {
    await startServer();
    try {
        const response = await fetch("http://localhost:3000/students", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Test failed", error);
    } finally {
        await stopServer();
    }
}

async function runTests() {
    await testStudentPost();
    await testStudentGet();
    await testStudentPut();
    await testStudentDelete();
    await testStudentGetByDomain();
}

runTests();

