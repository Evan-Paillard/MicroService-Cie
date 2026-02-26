export interface Internship {
    id?: number;
    studentId: number;
    offerId: string;
    status: "approved" | "rejected";
    message: string;
}
