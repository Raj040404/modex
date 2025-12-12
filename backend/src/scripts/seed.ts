import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const movieTitles = [
    "Avengers: Secret Wars", "Dune: Part Two", "Oppenheimer", "Spider-Man: Beyond the Spider-Verse",
    "The Batman Part II", "Avatar 3", "Deadpool 3", "Gladiator 2", "Mission Impossible 8", "Superman Legacy",
    "Joker: Folie à Deux", "Blade", "Thunderbolts", "Fantastic Four", "Captain America 4",
    "Star Wars: New Jedi Order", "Tron: Ares", "Beetlejuice 2", "Wicked", "Mufasa: The Lion King",
    "Interstellar 2", "Inception 2", "Tenet 2", "The Prestige 2", "Memento 2",
    "The Dark Knight 4", "Batman Begins 2", "The Dark Knight Rises 2", "Man of Steel 2", "Wonder Woman 3",
    "Aquaman 3", "The Flash 2", "Shazam 3", "Black Adam 2", "Blue Beetle 2",
    "Iron Man 4", "Captain America 5", "Thor 5", "Hulk 2", "Black Widow 2",
    "Hawkeye 2", "Ant-Man 4", "Doctor Strange 3", "Guardians of the Galaxy 4", "Eternals 2",
    "Shang-Chi 2", "Ms. Marvel 2", "Moon Knight 2", "She-Hulk 2", "Secret Invasion 2"
];

async function main() {
    console.log("Seeding database with 50 shows...");

    for (let i = 0; i < 50; i++) {
        const title = movieTitles[i % movieTitles.length];
        const date = new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000); // Consecutive days

        console.log(`Creating show ${i + 1}: ${title}`);

        // 1. Create Show
        const show = await prisma.show.create({
            data: {
                name: title,
                startTime: date,
                totalSeats: 100
            }
        });

        // 2. Create Seats (100 seats: 10 rows x 10 cols)
        const seatsData = [];
        const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

        for (const row of rows) {
            for (let k = 1; k <= 10; k++) {
                seatsData.push({
                    showId: show.id,
                    seatNumber: `${row}${k}`,
                    status: 'AVAILABLE' as any
                });
            }
        }

        // SQLite compatibility: Use Promise.all
        await Promise.all(seatsData.map(seat => prisma.seat.create({ data: seat })));
    }

    console.log("Seeding complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
