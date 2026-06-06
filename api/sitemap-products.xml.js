// api/sitemap-products.xml.js
// Vercel Serverless Function — dynamic products sitemap (auto-updates from Wix CMS)
import { createClient, OAuthStrategy } from '@wix/sdk';
import { items } from '@wix/data';

const CLIENT_ID = 'a157e7f7-53aa-4b34-9bd7-8cd21ce04875';
const SITE_URL = 'https://www.hilosalce.mx';
const COLLECTION_ID = 'ProductosDinamicas';

function slugify(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export default async function handler(req, res) {
  try {
    const client = createClient({
      modules: { items },
      auth: OAuthStrategy({ clientId: CLIENT_ID }),
    });

    const { items: productItems } = await client.items
      .query(COLLECTION_ID)
      .find();

    const urls = (productItems || []).map(item => {
      const d = item.data || item;
      const slug = d.slug || slugify(d.title || d.titulo || '');
      const lastmod = d._updatedDate
        ? new Date(d._updatedDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      if (!slug) return '';

      return `
  <url>
    <loc>${SITE_URL}/productos/${slug}</loc>
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
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).send(xml);
  } catch (err) {
    console.error('[Sitemap Products] Error:', err);
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;
    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(xml);
  }
}
