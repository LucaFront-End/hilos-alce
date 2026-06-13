// api/render.js
// Vercel Serverless Function — serves index.html with CMS-injected SEO meta tags.
// Solves the SPA problem: Googlebot gets correct <title> and <meta description>
// BEFORE React hydrates, so pages index with the right CMS content.

import { createClient, OAuthStrategy } from '@wix/sdk';
import { items } from '@wix/data';
import { readFileSync } from 'fs';
import { join } from 'path';

const CLIENT_ID = 'a157e7f7-53aa-4b34-9bd7-8cd21ce04875';
const SITE_URL  = 'https://www.hilosalce.mx';

// ── Helpers ────────────────────────────────────────────────────

function slugify(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function esc(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ── Read dist/index.html (cached across warm invocations) ─────

let _html = null;
function getHtml() {
  if (_html) return _html;
  try {
    _html = readFileSync(join(process.cwd(), 'dist', 'index.html'), 'utf-8');
  } catch {
    // Fallback — should never happen if includeFiles is set correctly
    _html = '<!doctype html><html><head><meta charset="UTF-8"/><title>Hilos Alce</title><meta name="description" content=""/></head><body><div id="root"></div><script type="module" src="/src/main.jsx"></script></body></html>';
  }
  return _html;
}

// ── Inject meta tags into HTML ────────────────────────────────

function injectSEO(html, { title, description, url }) {
  if (title) {
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  }
  if (description) {
    html = html.replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${esc(description)}" />`
    );
  }

  // Inject canonical + OG tags before </head>
  const extra = [
    url         ? `<link rel="canonical" href="${url}" />`                     : '',
    title       ? `<meta property="og:title" content="${esc(title)}" />`       : '',
    description ? `<meta property="og:description" content="${esc(description)}" />` : '',
    url         ? `<meta property="og:url" content="${url}" />`               : '',
                  `<meta property="og:type" content="website" />`,
                  `<meta property="og:site_name" content="Hilos Alce" />`,
  ].filter(Boolean).join('\n    ');

  html = html.replace('</head>', `    ${extra}\n  </head>`);
  return html;
}

// ── Handler ───────────────────────────────────────────────────

export default async function handler(req, res) {
  const { slug = '', type = 'landing' } = req.query;
  let html = getHtml();

  if (!slug) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  }

  try {
    const client = createClient({
      modules: { items },
      auth: OAuthStrategy({ clientId: CLIENT_ID }),
    });

    let seo = { title: '', description: '', url: '' };

    if (type === 'landing') {
      const { items: rows } = await client.items.query('Landings').find();
      const match = (rows || []).find(item => {
        const d = item.data || item;
        const s = d.slug || d.sLUG || d.SLUG || slugify(d.titulo || d.title || '');
        return s === slug || s === slug.toLowerCase();
      });
      if (match) {
        const d = match.data || match;
        seo.title       = d.tituloDeSeo || d.tituloDeSEO || d['titulo de seo'] || '';
        seo.description = d.metadescripcionDeSeo || d.metadescripciNDeSEO || d['metadescripción de seo'] || '';
        seo.url         = `${SITE_URL}/${slug}`;
      }
    } else if (type === 'product') {
      const { items: rows } = await client.items.query('ProductosDinamicas').find();
      const match = (rows || []).find(item => {
        const d = item.data || item;
        const s = d.slug || d.Slug || slugify(d.title || d.titulo || '');
        return s === slug || s === slug.toLowerCase();
      });
      if (match) {
        const d = match.data || match;
        seo.title       = d.tituloSeo || d.tituloSEO || d['titulo seo'] || '';
        seo.description = d.metadescripion || d.metadescripiN || d.metadescripcion || '';
        seo.url         = `${SITE_URL}/productos/${slug}`;
      }
    }

    if (seo.title || seo.description) {
      html = injectSEO(html, seo);
    }
  } catch (err) {
    console.error('[Render] CMS fetch error:', err);
    // Fall through with default HTML — page still works via client-side
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  return res.status(200).send(html);
}
