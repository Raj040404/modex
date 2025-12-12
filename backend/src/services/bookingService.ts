import prisma from '../config/db';
import { BookingRepository } from '../repositories/bookingRepository';

export class BookingService {
    private bookingRepo: BookingRepository;

    constructor() {
        this.bookingRepo = new BookingRepository(prisma);
    }

    async bookSeats(userId: string, showId: string, seatIds: string[]) {
        if (!seatIds || seatIds.length === 0) {
            throw new Error("No seats selected");
        }

        // Start Transaction
        return await prisma.$transaction(async (tx) => {
            // 1. Lock Seats
            // Pass tx to repo methods to ensure they run in the same transaction
            const lockedSeats: any[] = await this.bookingRepo.findSeatsForUpdate(seatIds, tx);

            // 2. Validate all seats found and available
            if (lockedSeats.length !== seatIds.length) {
                throw new Error("Some seats not found");
            }

            for (const seat of lockedSeats) {
                if (seat.status !== 'AVAILABLE') {
                    throw new Error(`Seat ${seat.seatNumber} is no longer available`);
                }
                if (seat.showId !== showId) {
                    throw new Error(`Seat ${seat.seatNumber} does not belong to this show`);
                }
            }

            // 3. Create Booking (PENDING initially, or CONFIRMED if instant)
            // For this flow, we'll mark CONFIRMED immediately as we don't have a payment gateway step details.
            // If we had payment, we'd set PENDING, and have a timeout worker.
            // Let's stick to CONFIRMED for simplicity of the prompt's core atomic requirement, 
            // OR IMPLEMENT PENDING logic as requested in "Bonus".
            // "Booking status: PENDING → CONFIRMED"
            // So we set locked seats to 'LOCKED' or 'BOOKED' (if confirmed).
            // Let's do PENDING flow.

            const booking = await tx.booking.create({
                data: {
                    userId,
                    showId,
                    status: 'CONFIRMED', // Using CONFIRMED directly as "One-step booking" for now unless Payment integration is simulated.
                    // If we want PENDING: status: 'PENDING', seats: locked...
                    // Let's assume this API confirms the booking.
                }
            });

            // 4. Update Seats
            await this.bookingRepo.updateSeatsStatus(seatIds, 'BOOKED', booking.id, tx);

            return booking;
        }, {
            maxWait: 5000, // default
            timeout: 10000 // default
        });
    }

    async getUserBookings(userId: string) {
        return this.bookingRepo.findBookingsByUser(userId);
    }
}
