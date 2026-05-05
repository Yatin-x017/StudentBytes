export const config = {
  runtime: 'edge',
};

// List of common Canvas domains (can be expanded)
const ALLOWED_CANVAS_HOSTS = [
  '.instructure.com',
  'canvas.instructure.com',
  'canvas.ubc.ca',
  'canvas.sfu.ca',
  'canvas.utoronto.ca',
  'canvas.harvard.edu',
  'canvas.stanford.edu',
  'canvas.mit.edu',
  'canvas.berkeley.edu',
  'canvas.ox.ac.uk',
  'canvas.cam.ac.uk',
];

function isAllowedUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);

    // 1. Only allow https
    if (url.protocol !== 'https:') return false;

    // 2. Check against whitelist or general pattern
    const hostname = url.hostname.toLowerCase();

    // Check if it's a known instructure subdomain
    if (hostname.endsWith('.instructure.com')) return true;

    // Check if it matches any of our common university patterns
    if (ALLOWED_CANVAS_HOSTS.some(allowed => hostname.endsWith(allowed))) return true;

    // Fallback: If it's a university domain with 'canvas' in it, it's likely safe for an MVP
    // but in production we'd want a stricter whitelist or user-provided domain validation.
    if (hostname.includes('canvas') && (hostname.endsWith('.edu') || hostname.endsWith('.ac.uk') || hostname.endsWith('.ca'))) {
        return true;
    }

    return false;
  } catch {
    return false;
  }
}

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const target = url.searchParams.get('url');

  if (!target) {
    return new Response('Missing url parameter', { status: 400 });
  }

  // SSRF Protection: Validate target URL
  if (!isAllowedUrl(target)) {
    return new Response('Forbidden: Invalid Canvas URL', { status: 403 });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response('Missing Authorization header', { status: 401 });
  }

  try {
    const res = await fetch(target, {
      method: req.method,
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: req.method !== 'GET' ? await req.text() : undefined,
    });

    const data = await res.text();
    return new Response(data, {
      status: res.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
