import prisma from '../config/db';

export class ShowRepository {
    async createShow(data: { name: string; startTime: Date; totalSeats: number }) {
        return prisma.show.create({
            data
        });
    }

    async findAll() {
        return prisma.show.findMany({
            orderBy: { startTime: 'asc' }
        });
    }

    async findById(id: string) {
        return prisma.show.findUnique({
            where: { id },
            include: {
                seats: {
                    orderBy: { seatNumber: 'asc' }
                }
            }
        });
    }

    async createSeats(showId: string, totalSeats: number) {
        const seatsData = [];
        for (let i = 1; i <= totalSeats; i++) {
            seatsData.push({
                showId,
                seatNumber: `A${i}`, // Simple numbering A1, A2...
                status: 'AVAILABLE'
            });
        }

        // Prisma createMany is efficient
        return prisma.seat.createMany({
            data: seatsData
        });
    }
}
