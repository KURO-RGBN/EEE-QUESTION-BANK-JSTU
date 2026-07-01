import { put } from '@vercel/blob';

export const config = { 
  runtime: 'edge' 
};

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename') || `session_${Date.now()}.pdf`;

    const blob = await put(filename, request.body, {
      access: 'public',
      contentType: 'application/pdf',
      addRandomSuffix: true,
    });

    return new Response(JSON.stringify({ downloadUrl: blob.downloadUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
