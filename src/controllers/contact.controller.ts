import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';
import { createContactSchema, markSpamSchema } from '../types/types';

const prisma = new PrismaClient();

// Create contacts
export const createContact = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const payloadParse = createContactSchema.safeParse(req.body);
  if (!payloadParse.success) {
    return res.status(400).json({ errors: payloadParse.error.errors });
  }

  // const userParseResult = userSchema.safeParse(req.user);
  // if (!userParseResult.success) {
  //   return res.status(401).json({ message: 'Invalid or missing contact data' });
  // }

  const { name, phoneNumber } = payloadParse.data;

  // const userId = userParseResult.data.id;
  //@ts-ignore
  const userId = req.user.user.id;

  if (!userId) {
    return res.status(400).json({ message: 'User not found in token' });
  }

  try {
    const contact = await prisma.contact.create({
      data: { name, phoneNumber, user: { connect: { id: userId } } },
      select: { id: true, name: true, phoneNumber: true, userId: true },
    });
    res.status(201).json(contact);
  } catch {
    res.status(500).json({ message: 'Error creating contact' });
  }
};

// Delete contacts
export const deleteContact = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { contactId } = req.params;

  // const userParseResult = userSchema.safeParse(req.user);
  // if (!userParseResult.success) {
  //   return res.status(401).json({ message: 'Invalid or missing contact data' });
  // }

  // const userId = userParseResult.data.id;
  //@ts-ignore
  const userId = req.user.user.id;

  try {
    await prisma.contact.deleteMany({
      where: { id: Number(contactId), userId },
    });
    res.status(200).json({ message: 'Contact deleted' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error deleting contact' });
  }
};

// List contacts for the user
export const getContacts = async (req: AuthenticatedRequest, res: Response) => {
  // const userParseResult = userSchema.safeParse(req.user);
  // if (!userParseResult.success) {
  //   return res.status(401).json({ message: 'Invalid or missing contact data' });
  // }

  // const userId = userParseResult.data.id;
  //@ts-ignore
  const userId = req.user.user.id;

  try {
    const contacts = await prisma.contact.findMany({
      where: { userId },
    });
    res.status(200).json(contacts);
  } catch {
    res.status(500).json({ message: 'Error fetching contacts' });
  }
};

// Search contacts by name
export const searchByName = async (req: Request, res: Response) => {
  const { query } = req.query;

  try {
    const users = await prisma.user.findMany({
      where: { name: { contains: query as string, mode: 'insensitive' } },
      select: { id: true, name: true, phoneNumber: true, email: true },
    });

    const contacts = await prisma.contact.findMany({
      where: { name: { contains: query as string, mode: 'insensitive' } },
      select: { id: true, name: true, phoneNumber: true, isSpam: true },
    });

    const results = [...users, ...contacts];
    res.status(200).json(results);
  } catch {
    res.status(500).json({ error: 'Search failed' });
  }
};

// Search contacts by phone number
export const searchByPhone = async (req: Request, res: Response) => {
  const { phone } = req.query;

  try {
    const users = await prisma.user.findMany({
      where: { phoneNumber: phone as string },
      select: { id: true, name: true, phoneNumber: true, email: true },
    });

    const contacts = await prisma.contact.findMany({
      where: { phoneNumber: phone as string },
      select: { id: true, name: true, phoneNumber: true, isSpam: true },
    });

    const results = [...users, ...contacts];
    res.status(200).json(results);
  } catch {
    res.status(500).json({ error: 'Search failed' });
  }
};

// Mark contact as spam
export const markSpam = async (req: Request, res: Response) => {
  const payloadParse = markSpamSchema.safeParse(req.body);
  if (!payloadParse.success) {
    return res.status(400).json({ errors: payloadParse.error.errors });
  }
  const { phoneNumber } = payloadParse.data;

  try {
    await prisma.contact.updateMany({
      where: { phoneNumber },
      data: { isSpam: true },
    });
    res.json({ message: 'Marked as spam' });
  } catch {
    res.status(500).json({ message: 'Error marking as spam' });
  }
};

// Get spam numbers list
export const getSpamNumbers = async (req: Request, res: Response) => {
  try {
    const spamContacts = await prisma.contact.findMany({
      where: {
        isSpam: true,
      },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
      },
    });
    const spamPhoneNumbers = spamContacts.map((p) => p.phoneNumber);

    if (spamPhoneNumbers.length === 0) {
      return res.status(200).json({ message: 'No Spam' });
    }

    const users = await prisma.user.findMany({
      where: { phoneNumber: { in: spamPhoneNumbers as string[] } },
      select: { email: true, phoneNumber: true },
    });

    const results = spamContacts.map((spamContact) => {
      const matchedUser = users.find(
        (user) => user.phoneNumber === spamContact.phoneNumber
      );
      return {
        ...spamContact,
        email: matchedUser ? matchedUser.email : null,
      };
    });
    res.status(200).json(results);
  } catch {
    res.status(500).json({ message: 'Error fetching spam numbers' });
  }
};
