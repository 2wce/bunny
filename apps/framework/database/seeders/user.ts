import { PrismaClient } from '@prisma/client';
//import { userFactory } from './utils';

const prisma = new PrismaClient();

async function main() {
  // create user dummy data
  //const users = userFactory.buildList(1);

  const res = await prisma.$transaction([

    prisma.user.createMany({
      data: [],
    }),
  ]);

  console.log('seed data created', { res });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });