import { pool } from "../db";
import { Internship } from "./internship.model";

export async function createInternshipTable(): Promise<void> {
    const query = `
        CREATE TABLE IF NOT EXISTS internships (
            id SERIAL PRIMARY KEY,
            student_id INTEGER NOT NULL,
            offer_id VARCHAR(255) NOT NULL,
            status VARCHAR(50) NOT NULL,
            message TEXT NOT NULL
        )
    `;
    await pool.query(query);
}

export async function createInternship(internship: Internship): Promise<Internship> {
    const query = `
        INSERT INTO internships (student_id, offer_id, status, message)
        VALUES ($1, $2, $3, $4)
        RETURNING id, student_id AS "studentId", offer_id AS "offerId", status, message
    `;
    const values = [internship.studentId, internship.offerId, internship.status, internship.message];
    const result = await pool.query(query, values);
    return result.rows[0];
}

export async function getInternshipById(id: number): Promise<Internship | null> {
    const query = `
        SELECT id, student_id AS "studentId", offer_id AS "offerId", status, message
        FROM internships
        WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
}
