import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { domain, token, path } = req.query;

  if (!domain || !token || !path) {
    return res.status(400).json({ error: 'Missing domain, token, or path' });
  }

  const domainStr = String(domain)
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '');
  const pathStr = String(path);
  const tokenStr = String(token);

  if (pathStr.includes('..') || !pathStr.startsWith('/')) {
    return res.status(400).json({ error: 'Invalid path' });
  }

  const sep = pathStr.includes('?') ? '&' : '?';
  const url = `https://${domainStr}/api/v1${pathStr}${sep}per_page=50`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${tokenStr}`,
        Accept: 'application/json',
      },
    });

    if (response.status === 401) {
      return res.status(401).json({
        error:
          'Invalid Canvas token. Go to Canvas → Account → Settings → New Access Token.',
      });
    }

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Canvas error: ${response.status} ${response.statusText}`,
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({
      error: `Could not reach ${domainStr}. Check your Canvas domain.`,
    });
  }
}
