import { put } from '@vercel/blob';

export const config = { runtime: 'edge' }; // or default node runtime, either works

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename') || `session_${Date.now()}.pdf`;

  const blob = await put(filename, request.body, {
    access: 'public',
    contentType: 'application/pdf',
    addRandomSuffix: true, // avoid collisions between users
  });

  return Response.json({ downloadUrl: blob.downloadUrl });
}
