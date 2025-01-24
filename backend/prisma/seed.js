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
        coordinates: { tl: { x: 946, y: 675 }, br: { x: 999, y: 706 } },
      },
      {
        name: "Frog",
        url: "test3",
        coordinates: {
          rightEye: {
            tl: { x: 1032, y: 402 },
            br: { x: 1263, y: 519 },
          },
          leftEye: {
            tl: { x: 488, y: 517 },
            br: { x: 719, y: 622 },
          },
        },
      },
      {
        name: "Salamander",
        url: "test4",
        coordinates: {
          rightEye: {
            tl: { x: 61, y: 544 },
            br: { x: 89, y: 288 },
          },
          leftEye: {
            tl: { x: 35, y: 681 },
            br: { x: 54, y: 708 },
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
            tl: { x: 660, y: 249 },
            br: { x: 688, y: 258 },
          },
          leftEye: {
            tl: { x: 629, y: 263 },
            br: { x: 624, y: 274 },
          },
        },
      },
    ],
  });

  // Create users
  await prisma.user.createMany({
    data: [
      {
        id: 1,
        initials: "GUD",
        startTime: new Date(Date.now()),
      },
      {
        id: 2,
        initials: "LOL",
        startTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      },
      {
        id: 3,
        initials: "WIN",
        startTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
      },
    ],
  });

  //Create Scores
  await prisma.score.createMany({
    data: [
      {
        userId: 1,
        score: 100,
      },
      {
        userId: 2,
        score: 200,
      },
      {
        userId: 3,
        score: 300,
      },
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
