import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const hashPassword = (password: string) => bcrypt.hashSync(password, 10);

async function main() {
  await prisma.contact.deleteMany({});
  await prisma.user.deleteMany({});

  const users = await prisma.user.createMany({
    data: [
      {
        name: 'John Doe',
        phoneNumber: '1234567890',
        email: 'johndoe@example.com',
        password: 'password123',
      },
      {
        name: 'Jane Smith',
        phoneNumber: '0987654321',
        email: 'janesmith@example.com',
        password: 'password456',
      },
      {
        name: 'Michael Johnson',
        phoneNumber: '5555555555',
        email: 'michaelj@example.com',
        password: 'password789',
      },
      {
        name: 'Alice Brown',
        phoneNumber: '3333333333',
        email: 'alicebrown@example.com',
        password: 'password101',
      },
      {
        name: 'Robert Davis',
        phoneNumber: '7777777777',
        email: 'robertdavis@example.com',
        password: 'password102',
      },
    ],
  });

  console.log('Seeded Users:', users);

  const contacts = await prisma.contact.createMany({
    data: [
      {
        name: 'John Doe',
        phoneNumber: '9998887777',
        userId: 1,
      },
      {
        name: 'Jane Doe',
        phoneNumber: '8887776666',
        userId: 1,
      },
      {
        name: 'Emily Clark',
        phoneNumber: '7776665555',
        userId: 2,
      },
      {
        name: 'Michael Stone',
        phoneNumber: '1234567890',
        userId: 3,
      },
      {
        name: 'Emma Wilson',
        phoneNumber: '3334445555',
        userId: 3,
      },
    ],
  });

  console.log('Seeded Contacts:', contacts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
