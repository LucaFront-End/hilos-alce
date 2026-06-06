// src/lib/productDynamicService.js
// Fetches dynamic product pages from Wix CMS "Productos Dinámicas" collection
import { wixClient } from './wixClient';

// ── In-memory cache ────────────────────────────────────────────
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  cache.set(key, { data, ts: Date.now() });
}

// ── Field mapping ──────────────────────────────────────────────
function slugify(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function mapProductDynamic(item) {
  const d = item.data || item;

  const rawSlug = d.slug || d.Slug || '';
  const autoSlug = rawSlug || slugify(d.title || d.titulo || '');

  return {
    id:             d._id || '',
    title:          d.title || d.titulo || '',
    slug:           autoSlug,
    ciudad:         d.ciudad || '',
    seoTitle:       d.tituloSeo || d.tituloSEO || d['titulo seo'] || '',
    seoDescription: d.metadescripion || d.metadescripiN || d.metadescripcion || '',
    excerpt:        d.excerpt || '',
    whatsappUrl:    d.urlDeWhatsapp || d.uRLDeWhatsapp || d['url de whatsapp'] || '',
  };
}

// ── Public API ─────────────────────────────────────────────────

/**
 * Fetch a single dynamic product page by its slug.
 */
export async function fetchProductDynamicBySlug(slug) {
  if (!slug) return null;

  const cacheKey = `prodDyn:${slug}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const { items } = await wixClient.items
      .query('ProductosDinamicas')
      .find();

    const allMapped = (items || []).map(mapProductDynamic);
    const product = allMapped.find(
      (p) => p.slug === slug || p.slug === slug.toLowerCase()
    );

    if (product) {
      setCache(cacheKey, product);
      setCache('prodDyn:all', allMapped);
    }

    return product || null;
  } catch (err) {
    console.error('[ProductDynamicService] Error fetching by slug:', err);
    return null;
  }
}

/**
 * Fetch all dynamic product pages.
 */
export async function fetchAllProductDynamics() {
  const cached = getCached('prodDyn:all');
  if (cached) return cached;

  try {
    const { items } = await wixClient.items
      .query('ProductosDinamicas')
      .find();

    const mapped = (items || []).map(mapProductDynamic);
    setCache('prodDyn:all', mapped);
    return mapped;
  } catch (err) {
    console.error('[ProductDynamicService] Error fetching all:', err);
    return [];
  }
}
