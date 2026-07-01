export const config = { runtime: 'nodejs' };

import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed');
    return;
  }

  try {
    const filename = req.query.filename || `session_${Date.now()}.pdf`;

    const blob = await put(filename, req, {
      access: 'public',
      contentType: 'application/pdf',
      addRandomSuffix: true,
    });

    res.status(200).json({ downloadUrl: blob.downloadUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
