import z from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long') // Minimum length
  .max(100, 'Password must be less than 100 characters long') // Optional max length
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter') // Uppercase
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter') // Lowercase
  .regex(/\d/, 'Password must contain at least one number') // At least one digit
  .regex(
    /[!@#$%^&*(),.?":{}|<>]/,
    'Password must contain at least one special character'
  ); // At least one special character

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phoneNumber: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be at most 15 digits')
    .regex(/^[\d+()-\s]+$/, 'Invalid phone number format'),
  email: z.string().email('Invalid email address').optional(),
  password: passwordSchema,
});

export const loginSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be at most 15 digits')
    .regex(/^[\d+()-\s]+$/, 'Invalid phone number format'),
  password: passwordSchema,
});

export const userSchema = z.object({
  id: z.number(),
});

export const createContactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phoneNumber: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be at most 15 digits')
    .regex(/^[\d+()-\s]+$/, 'Invalid phone number format'),
});

export const markSpamSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be at most 15 digits')
    .regex(/^[\d+()-\s]+$/, 'Invalid phone number format'),
});
