import http from 'node:http';

const PORT = Number(process.env.PORT ?? 8787);

const sendJson = (res, status, body) => {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify(body));
};

const sendUpstream = async (res, target) => {
  try {
    const response = await fetch(target, { headers: { 'User-Agent': 'Trading101/1.0', Accept: 'application/json' } });
    const text = await response.text();
    res.writeHead(response.status, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store',
    });
    res.end(text);
  } catch {
    sendJson(res, 502, { error: 'Yahoo upstream unavailable' });
  }
};

const server = http.createServer(async (req, res) => {
  if (!req.url) return sendJson(res, 400, { error: 'Missing URL' });
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/api/health') return sendJson(res, 200, { ok: true });

  if (url.pathname === '/api/yahoo-search') {
    const q = url.searchParams.get('q')?.trim();
    if (!q) return sendJson(res, 400, { error: 'Missing q query parameter' });
    const quotesCount = Math.min(Number(url.searchParams.get('quotesCount') ?? '20') || 20, 50);
    const target = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=${quotesCount}&newsCount=0`;
    return sendUpstream(res, target);
  }

  if (url.pathname === '/api/yahoo-quote') {
    const symbols = url.searchParams.get('symbols')?.trim();
    if (!symbols) return sendJson(res, 400, { error: 'Missing symbols query parameter' });
    const target = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbols)}`;
    return sendUpstream(res, target);
  }

  return sendJson(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
  console.log(`Trading101 backend listening on http://localhost:${PORT}`);
});
