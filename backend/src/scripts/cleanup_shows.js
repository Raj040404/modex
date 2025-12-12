const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Checking for duplicate/broken shows...");

    // Find all 'Avengers: Secret Wars' shows
    const shows = await prisma.show.findMany({
        where: { name: "Avengers: Secret Wars" },
        include: { seats: true },
        orderBy: { createdAt: 'asc' }
    });

    console.log(`Found ${shows.length} shows for 'Avengers: Secret Wars'.`);

    let keptShow = null;

    // Logic: 
    // 1. Delete shows with 0 seats.
    // 2. If multiple valid shows remain, keep the latest one and delete older ones.

    for (let i = 0; i < shows.length; i++) {
        const show = shows[i];
        const seatCount = show.seats.length;
        console.log(`Show ${i + 1} [${show.id}]: ${seatCount} seats. Created: ${show.createdAt}`);

        if (seatCount === 0) {
            console.log(`-> Deleting (No Seats)`);
            await prisma.show.delete({ where: { id: show.id } });
        } else {
            // This show has seats.
            if (keptShow) {
                // We already have a "kept" show (which was earlier in the loop).
                // Do we keep the NEW one or the OLD one?
                // Usually user wants the "third one" (latest).
                // So we delete the OLD 'keptShow' and keep this new 'show'.
                console.log(`-> Deleting older duplicate [${keptShow.id}]`);
                await prisma.show.delete({ where: { id: keptShow.id } });
                keptShow = show; // Update kept show to the new one
            } else {
                keptShow = show; // This is the first valid show we found
            }
        }
    }

    if (keptShow) {
        console.log(`\nKept Show: [${keptShow.id}] with ${keptShow.seats.length} seats.`);
    } else {
        console.log("\nNo valid shows found or all deleted.");
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
