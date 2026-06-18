import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { buildSystemPrompt } from '@/lib/chat';

export const dynamic = 'force-dynamic';

const messageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(2000),
});

const requestSchema = z.object({
  messages: z.array(messageSchema).min(1).max(40),
});

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? 'missing' });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = requestSchema.safeParse(body);

  if (!result.success) {
    return new Response('Invalid request', { status: 400 });
  }

  const { messages } = result.data;

  const stream = await getClient().messages.stream({
    model: 'claude-opus-4-8',
    max_tokens: 1024,
    thinking: { type: 'disabled' },
    system: buildSystemPrompt(),
    messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      stream.on('text', (delta) => {
        controller.enqueue(encoder.encode(delta));
      });
      stream.on('end', () => controller.close());
      stream.on('error', (err) => {
        console.error('[chat/POST]', err);
        controller.error(err);
      });
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
