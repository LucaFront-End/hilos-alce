// api/sitemap-static.xml.js
// Vercel Serverless Function — static pages sitemap

const SITE_URL = 'https://www.hilosalce.mx';

const STATIC_PAGES = [
  { loc: '/',                  priority: '1.0', changefreq: 'weekly' },
  { loc: '/productos/hilos-delgados', priority: '0.9', changefreq: 'monthly' },
  { loc: '/productos/hilos-gruesos',  priority: '0.9', changefreq: 'monthly' },
  { loc: '/industrias',        priority: '0.8', changefreq: 'monthly' },
  { loc: '/nosotros',          priority: '0.7', changefreq: 'monthly' },
  { loc: '/contacto',          priority: '0.8', changefreq: 'monthly' },
  { loc: '/zonas',             priority: '0.7', changefreq: 'weekly' },
];

export default function handler(req, res) {
  const today = new Date().toISOString().split('T')[0];

  const urls = STATIC_PAGES.map(p => `
  <url>
    <loc>${SITE_URL}${p.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
  res.status(200).send(xml);
}
