import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import generateToken from '../utils/token.util';
import z from 'zod';
import { loginSchema, registerSchema } from '../types/types';

const prisma = new PrismaClient();

const checkUserUniqueness = async (phoneNumber: string) => {
  const user = await prisma.user.findFirst({
    where: {
      phoneNumber,
    },
    select: {
      id: true,
    },
  });
  if (user) return true;
  else return false;
};

export const register = async (req: Request, res: Response) => {
  const payloadParse = registerSchema.safeParse(req.body);
  if (!payloadParse.success) {
    return res.status(400).json({ errors: payloadParse.error.errors });
  }

  const { name, phoneNumber, email, password } = payloadParse.data;

  const uniqueUser = await checkUserUniqueness(phoneNumber);

  if (uniqueUser) {
    res.status(422).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { name, phoneNumber, email, password: hashedPassword },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        email: true,
      },
    });
    const token = generateToken(user.id);
    res.status(201).json({ ...user, token });
  } catch (e) {
    console.error(e);
    res
      .status(400)
      .json({ message: 'User with this phone number or email already exists' });
  }
};

export const login = async (req: Request, res: Response) => {
  const payloadParse = loginSchema.safeParse(req.body);

  if (!payloadParse.success) {
    return res.status(400).json({ errors: payloadParse.error.errors });
  }

  const { phoneNumber, password } = payloadParse.data;

  try {
    const user = await prisma.user.findUnique({
      where: { phoneNumber },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        password: true,
        email: true,
      },
    });

    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const token = generateToken(user.id);
        const { password, ...userWithoutPassword } = user;

        res.json({ ...userWithoutPassword, token });
      }
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (e) {
    console.error(e);
    res.status(404).json({ message: 'Something went wrong' });
  }
};
