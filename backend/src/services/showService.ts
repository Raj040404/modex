import { ShowRepository } from '../repositories/showRepository';

const showRepo = new ShowRepository();

export class ShowService {
    async createShow(name: string, startTime: string, totalSeats: number) {
        // Create Show
        const show = await showRepo.createShow({
            name,
            startTime: new Date(startTime),
            totalSeats
        });

        // Generate Seats
        await showRepo.createSeats(show.id, totalSeats);

        return show;
    }

    async getAllShows() {
        return showRepo.findAll();
    }

    async getShowDetails(id: string) {
        return showRepo.findById(id);
    }
}
