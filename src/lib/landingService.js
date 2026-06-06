// src/lib/landingService.js
// Fetches dynamic landing data from Wix CMS "Landings" collection
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

// ── Field mapping: Wix CMS field names → normalised JS keys ───
// Wix CMS stores field IDs as camelCase versions of the display name.
// We map them explicitly so we're decoupled from Wix renaming.
function mapLanding(item) {
  const d = item.data || item;
  
  // Auto-generate slug from title if SLUG field is empty
  const rawSlug = d.slug || d.sLUG || d.SLUG || '';
  const autoSlug = rawSlug
    ? rawSlug
    : (d.titulo || d.title || '')
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // strip accents
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

  return {
    id:             d._id || d.iD || '',
    titulo:         d.titulo || d.title || '',
    slug:           autoSlug,
    ciudad:         d.ciudad || '',
    palabra:        d.palabra || '',
    seoTitle:       d.tituloDeSeo || d.tituloDeSEO || d['titulo de seo'] || '',
    seoDescription: d.metadescripcionDeSeo || d.metadescripciNDeSEO || d['metadescripción de seo'] || '',
    excerpt:        d.excerpt || '',
    whatsappUrl:    d.urlDeWhatsapp || d.uRLDeWhatsapp || d['url de whatsapp'] || '',
  };
}

// ── Public API ─────────────────────────────────────────────────

/**
 * Fetch a single landing by its slug.
 * Returns the mapped landing object or null if not found.
 */
export async function fetchLandingBySlug(slug) {
  if (!slug) return null;

  const cacheKey = `landing:${slug}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    // Query Wix CMS — try the SLUG field first
    const { items } = await wixClient.items
      .query('Landings')
      .find();

    // Since Wix field names can be tricky, we map all items and find by slug
    const allMapped = (items || []).map(mapLanding);
    const landing = allMapped.find(
      (l) => l.slug === slug || l.slug === slug.toLowerCase()
    );

    if (landing) {
      setCache(cacheKey, landing);
      // Also cache the full list while we have it
      setCache('landings:all', allMapped);
    }

    return landing || null;
  } catch (err) {
    console.error('[LandingService] Error fetching landing by slug:', err);
    return null;
  }
}

/**
 * Fetch all landings. Useful for sitemap / internal links.
 */
export async function fetchAllLandings() {
  const cached = getCached('landings:all');
  if (cached) return cached;

  try {
    const { items } = await wixClient.items
      .query('Landings')
      .find();

    const mapped = (items || []).map(mapLanding);
    setCache('landings:all', mapped);
    return mapped;
  } catch (err) {
    console.error('[LandingService] Error fetching all landings:', err);
    return [];
  }
}
