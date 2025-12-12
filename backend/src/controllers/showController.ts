import { Request, Response } from 'express';
import { ShowService } from '../services/showService';
import { z } from 'zod';

const showService = new ShowService();

const createShowSchema = z.object({
    name: z.string().min(1),
    startTime: z.string().datetime(),
    totalSeats: z.number().min(1).max(1000)
});

export const createShow = async (req: Request, res: Response): Promise<void> => {
    try {
        const validated = createShowSchema.parse(req.body);
        const show = await showService.createShow(validated.name, validated.startTime, validated.totalSeats);
        res.status(201).json(show);
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: (error as z.ZodError).errors });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

export const getShows = async (req: Request, res: Response) => {
    try {
        const shows = await showService.getAllShows();
        res.json(shows);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getShowById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const show = await showService.getShowDetails(id);
        if (!show) {
            res.status(404).json({ error: 'Show not found' });
            return;
        }
        res.json(show);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
