import { put } from '@vercel/blob';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }
  try {
    const { imageData, filename } = await req.json();
    const base64 = imageData.replace(/^data:image\/png;base64,/, '');
    const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    const blob = await put(filename || `qrcode-${Date.now()}.png`, bytes, {
      access: 'public',
      contentType: 'image/png',
    });
    return new Response(JSON.stringify({ url: blob.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
