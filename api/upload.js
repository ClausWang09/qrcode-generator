import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed');
    return;
  }
  try {
    const { imageData, filename } = req.body;
    const base64 = imageData.replace(/^data:image\/png;base64,/, '');
    const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    const blob = await put(filename || `qrcode-${Date.now()}.png`, bytes, {
      access: 'public',
      contentType: 'image/png',
    });
    res.status(200).json({ url: blob.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
