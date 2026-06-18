import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

/** Turns a thrown error into a safe, user-facing message. Never leaks raw
 * Prisma/DB internals to the client; full detail still goes to server logs. */
export function friendlyError(err: unknown, context: string): string {
  console.error(`[${context}]`, err);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const field = (err.meta?.target as string[] | undefined)?.join(', ') ?? 'value';
      return `A record with this ${field} already exists.`;
    }
    if (err.code === 'P2025') {
      return 'Record not found.';
    }
  }

  if (err instanceof ZodError) {
    return 'Some fields are invalid. Please check the form and try again.';
  }

  return 'Something went wrong. Please try again.';
}
