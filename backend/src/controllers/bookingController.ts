import { Request, Response } from 'express';
import { BookingService } from '../services/bookingService';
import { z } from 'zod';

const bookingService = new BookingService();

const bookSeatsSchema = z.object({
    userId: z.string().min(1),
    showId: z.string().uuid(),
    seatIds: z.array(z.string().uuid()).min(1)
});

export const bookSeats = async (req: Request, res: Response): Promise<void> => {
    try {
        const validated = bookSeatsSchema.parse(req.body);
        const booking = await bookingService.bookSeats(validated.userId, validated.showId, validated.seatIds);
        res.status(201).json(booking);
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: (error as z.ZodError).errors });
            return;
        }

        if (error.message.includes("no longer available")) {
            res.status(409).json({ error: "One or more selected seats are already booked" }); // 409 Conflict
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

export const getUserBookings = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        const bookings = await bookingService.getUserBookings(userId);
        res.status(200).json(bookings);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
