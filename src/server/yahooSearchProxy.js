const proxyToBackend = async (req, res, path) => {
  try {
    const baseUrl = process.env.BACKEND_URL ?? 'http://localhost:8787';
    const local = new URL(req.url ?? '', 'http://localhost');
    const target = `${baseUrl}${path}${local.search}`;
    const response = await fetch(target);
    const text = await response.text();
    res.statusCode = response.status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end(text);
  } catch {
    res.statusCode = 502;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: 'Backend unavailable' }));
  }
};

export const yahooSearchProxy = (req, res) => proxyToBackend(req, res, '/api/yahoo-search');
export const yahooQuoteProxy = (req, res) => proxyToBackend(req, res, '/api/yahoo-quote');
