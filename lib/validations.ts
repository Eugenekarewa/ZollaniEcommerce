import { z } from 'zod';

export const contactSchema = z.object({
  name:    z.string().min(2, 'Name must be at least 2 characters').max(100),
  email:   z.string().email('Please enter a valid email address'),
  phone:   z.string().optional(),
  company: z.string().optional(),
  service: z.string().min(1, 'Please select a service'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

export const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type ContactInput    = z.infer<typeof contactSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
