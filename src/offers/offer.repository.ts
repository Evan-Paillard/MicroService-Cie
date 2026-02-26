import { Offer, OfferModel } from './offer.model';

export const createOffer = async (data: Partial<Offer>): Promise<Offer> => {
    const offer = new OfferModel(data);
    return await offer.save();
};

export const getOfferById = async (id: string): Promise<Offer | null> => {
    return await OfferModel.findOne({ _id: id, available: true });
};

export const getOffersByDomain = async (domain: string): Promise<Offer[]> => {
    return await OfferModel.find({ domain, available: true });
};

export const getOffersByCity = async (city: string): Promise<Offer[]> => {
    return await OfferModel.find({ city, available: true });
};

export const updateOffer = async (id: string, data: Partial<Offer>): Promise<Offer | null> => {
    return await OfferModel.findByIdAndUpdate(id, data, { returnDocument: 'after' });
};

export const deleteOffer = async (id: string): Promise<Offer | null> => {
    return await OfferModel.findByIdAndDelete(id);
};
