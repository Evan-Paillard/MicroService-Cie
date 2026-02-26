import { pool } from "../db";
import { Student } from "./student.model";

export async function createStudent(student: Student): Promise<Student> {
    const query = `
        INSERT INTO students (firstname, name, domain)
        VALUES ($1, $2, $3)
        RETURNING id, firstname, name, domain
    `;

    const values = [student.firstname, student.name, student.domain];

    const result = await pool.query(query, values);
    return result.rows[0];
}

export async function studentsbyid(id: number): Promise<Student> {
    const query = `
        SELECT id, firstname, name, domain
        FROM students
        WHERE id = $1
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
}

export async function deleteStudent(id: number): Promise<Student> {
    const query = `
        DELETE FROM students
        WHERE id = $1
        RETURNING id, firstname, name, domain
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
}

export async function updateStudent(id: number, student: Student): Promise<Student> {
    const query = `
        UPDATE students
        SET firstname = $1, name = $2, domain = $3
        WHERE id = $4
        RETURNING id, firstname, name, domain
    `;

    const values = [student.firstname, student.name, student.domain, id];

    const result = await pool.query(query, values);
    return result.rows[0];
}

export async function studentsbydomain(domain: string): Promise<Student[]> {
    const query = `
        SELECT id, firstname, name, domain
        FROM students
        WHERE domain = $1
    `;

    const result = await pool.query(query, [domain]);
    return result.rows;
}
