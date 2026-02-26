import { Router, Request, Response } from 'express';
import {
    createOffer,
    getOfferById,
    getOffersByDomain,
    getOffersByCity,
    updateOffer,
    deleteOffer
} from './offer.repository';

export const offersRouter = Router();

// POST /offer - Create a new offer
offersRouter.post('/', async (req: Request, res: Response) => {
    try {
        const offer = await createOffer(req.body);
        res.status(201).json(offer);
    } catch (error) {
        res.status(500).json({ error: 'Error creating offer' });
    }
});

// GET /offer?domain=... or /offer?city=...
offersRouter.get('/', async (req: Request, res: Response) => {
    try {
        const { domain, city } = req.query;
        if (domain) {
            const offers = await getOffersByDomain(domain as string);
            res.json(offers);
        } else if (city) {
            const offers = await getOffersByCity(city as string);
            res.json(offers);
        } else {
            res.status(400).json({ error: 'Missing query parameter: domain or city' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error searching offers' });
    }
});

// GET /offer/:id - Get an offer by ID
offersRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const offer = await getOfferById(req.params.id as string);
        if (offer) {
            res.json(offer);
        } else {
            res.status(404).json({ error: 'Offer not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching offer' });
    }
});

// PUT /offer/:id - Update an offer
offersRouter.put('/:id', async (req: Request, res: Response) => {
    try {
        const offer = await updateOffer(req.params.id as string, req.body);
        if (offer) {
            res.json(offer);
        } else {
            res.status(404).json({ error: 'Offer not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating offer' });
    }
});

// DELETE /offer/:id - Delete an offer
offersRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        const offer = await deleteOffer(req.params.id as string);
        if (offer) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Offer not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting offer' });
    }
});
