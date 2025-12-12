import { PrismaClient } from '@prisma/client';

export class BookingRepository {
    constructor(private prisma: PrismaClient) { }

    async createBooking(data: { userId: string; showId: string; status: string }) {
        return this.prisma.booking.create({ data });
    }

    async findSeatsForUpdate(seatIds: string[], tx: any): Promise<any[]> {
        // Use raw query to lock rows
        // Note: Prisma needs the IDs to be formatted for SQL IN clause
        if (seatIds.length === 0) return [];

        const ids = seatIds.map(id => `'${id}'`).join(',');

        // SQLite specific syntax (No FOR UPDATE)
        return tx.$queryRawUnsafe(`
            SELECT * FROM "Seat"
            WHERE id IN (${ids})
        `);
    }

    async updateSeatsStatus(seatIds: string[], status: string, bookingId: string | null, tx: any) {
        return tx.seat.updateMany({
            where: {
                id: { in: seatIds }
            },
            data: {
                status,
                bookingId
            }
        });
    }

    async findBookingsByUser(userId: string) {
        return this.prisma.booking.findMany({
            where: { userId },
            include: {
                show: true,
                seats: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
}
