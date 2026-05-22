const sendJson = (res: { statusCode: number; setHeader: (k: string, v: string) => void; end: (s: string) => void }, status: number, body: unknown) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
};

export const yahooSearchProxy = async (req: { url?: string }, res: { statusCode: number; setHeader: (k: string, v: string) => void; end: (s: string) => void }) => {
  const base = 'http://localhost';
  const url = new URL(req.url ?? '', base);
  const q = url.searchParams.get('q')?.trim();
  if (!q) return sendJson(res, 400, { error: 'Missing q query parameter' });

  const quotesCount = Math.min(Number(url.searchParams.get('quotesCount') ?? '20'), 50);
  const target = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=${quotesCount}&newsCount=0`;

  try {
    const response = await fetch(target, {
      headers: {
        'User-Agent': 'Trading101/1.0',
        Accept: 'application/json',
      },
    });
    const text = await response.text();
    res.statusCode = response.status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end(text);
  } catch {
    return sendJson(res, 502, { error: 'Yahoo search upstream unavailable' });
  }
};
