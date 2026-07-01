import { put } from '@vercel/blob';

// CHANGE THIS: Node.js runtime allows @vercel/blob to process file chunks properly
export const config = { 
  runtime: 'nodejs' 
}; 

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    // Standard Node.js serverless functions use response structures differently depending on framework,
    // but returning a native Response object works perfectly on standard Vercel configurations.
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { searchParams } = new URL(request.url, 'http://localhost');
    const filename = searchParams.get('filename') || `session_${Date.now()}.pdf`;

    // Upload the file stream to Vercel Blob
    const blob = await put(filename, request.body, {
      access: 'public',
      contentType: 'application/pdf',
      addRandomSuffix: true, 
    });

    return new Response(JSON.stringify({ downloadUrl: blob.downloadUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
