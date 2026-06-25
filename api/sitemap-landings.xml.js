// api/sitemap-landings.xml.js
// Vercel Serverless Function — dynamic landings sitemap (real-time from Wix CMS)
// Uses the SAME slugify + findField logic as render.js so
// sitemap <loc> always matches the canonical URL.

import { createClient, OAuthStrategy } from '@wix/sdk';
import { items } from '@wix/data';

const CLIENT_ID     = 'a157e7f7-53aa-4b34-9bd7-8cd21ce04875';
const SITE_URL      = 'https://www.hilosalce.mx';
const COLLECTION_ID = 'Landings';

// ── Shared helpers (must match render.js exactly) ──────────────

function slugify(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function findField(obj, ...patterns) {
  for (const p of patterns) {
    if (obj[p]) return obj[p];
  }
  const keys = Object.keys(obj);
  for (const p of patterns) {
    const lower = p.toLowerCase();
    const match = keys.find(k => k.toLowerCase().includes(lower));
    if (match && obj[match]) return obj[match];
  }
  return '';
}

// ── Handler ───────────────────────────────────────────────────

export default async function handler(req, res) {
  try {
    const client = createClient({
      modules: { items },
      auth: OAuthStrategy({ clientId: CLIENT_ID }),
    });

    const { items: landingItems } = await client.items
      .query(COLLECTION_ID)
      .limit(1000)
      .find();

    const urls = (landingItems || []).map(item => {
      const d = item.data || item;

      // Resolve slug — same logic as render.js
      const slug = findField(d, 'slug', 'sLUG', 'SLUG')
                || slugify(findField(d, 'titulo', 'title'));

      if (!slug) return '';

      const lastmod = d._updatedDate
        ? new Date(d._updatedDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      const loc = `${SITE_URL}/ciudades/${slug}`;

      return `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }).filter(Boolean).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=3600');
    res.status(200).send(xml);
  } catch (err) {
    console.error('[Sitemap Landings] Error:', err);
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;
    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(xml);
  }
}
