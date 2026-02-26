import mongoose, { Schema, Document } from 'mongoose';

export interface Offer extends Document {
    title: string;
    link: string;
    city: string;
    domain: string;
    salary: number;
    startDate: Date;
    endDate: Date;
    available: boolean;
}

const OfferSchema: Schema = new Schema({
    title: { type: String, required: true },
    link: { type: String, required: true },
    city: { type: String, required: true },
    domain: { type: String, required: true },
    salary: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    available: { type: Boolean, required: true, default: true }
});

export const OfferModel = mongoose.model<Offer>('Offer', OfferSchema);
