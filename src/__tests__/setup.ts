import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Initialize the database or seed test data here if needed
});

afterAll(async () => {
  // Clear the test data or clean up after tests
  await prisma.$disconnect();
});
