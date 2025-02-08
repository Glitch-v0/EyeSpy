import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Remove existing entries
  await prisma.picture.deleteMany();
  await prisma.score.deleteMany();
  await prisma.user.deleteMany();

  // Create picture entries
  await prisma.picture.createMany({
    data: [
      {
        name: "Grouse",
        url: "test",
        coordinates: { tl: { x: 1186, y: 195 }, br: { x: 1216, y: 221 } },
      },
      {
        name: "Ibex",
        url: "test2",
        coordinates: { tl: { x: 732, y: 454 }, br: { x: 786, y: 488 } },
      },
      {
        name: "Frog",
        url: "test3",
        coordinates: {
          rightEye: {
            tl: { x: 732, y: 524 },
            br: { x: 842, y: 678 },
          },
          leftEye: {
            tl: { x: 334, y: 692 },
            br: { x: 485, y: 810 },
          },
        },
      },
      {
        name: "Salamander",
        url: "test4",
        coordinates: {
          rightEye: {
            tl: { x: 74, y: 363 },
            br: { x: 105, y: 376 },
          },
          leftEye: {
            tl: { x: 45, y: 449 },
            br: { x: 79, y: 477 },
          },
        },
      },
      {
        name: "Squirrel",
        url: "test5",
        coordinates: { tl: { x: 751, y: 364 }, br: { x: 758, y: 367 } },
      },
      {
        name: "Bee",
        url: "test6",
        coordinates: {
          rightEye: {
            tl: { x: 1312, y: 499 },
            br: { x: 1382, y: 518 },
          },
          leftEye: {
            tl: { x: 1256, y: 527 },
            br: { x: 1288, y: 545 },
          },
        },
      },
    ],
  });

  // Create users
  await prisma.user.createMany({
    data: [
      {
        initials: "GUD",
        startTime: new Date(Date.now()),
      },
      {
        initials: "LOL",
        startTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      },
      {
        initials: "WIN",
        startTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
      },
    ],
  });

  //Create Scores
  const users = await prisma.user.findMany({
    where: { initials: { in: ["GUD", "LOL", "WIN"] } },
    select: { id: true, initials: true },
  });

  const userMap = Object.fromEntries(users.map((u) => [u.initials, u.id]));

  await prisma.score.createMany({
    data: [
      { userId: userMap["GUD"], score: 25000 },
      { userId: userMap["LOL"], score: 50000 },
      { userId: userMap["WIN"], score: 75000 },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
