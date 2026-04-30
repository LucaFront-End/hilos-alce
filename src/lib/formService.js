// src/lib/formService.js
// Dual-write: Wix CMS + FormSubmit.co email relay
import { wixClient } from './wixClient';

const FORMSUBMIT_URL = 'https://formsubmit.co/ajax/ventas@hilosalce.mx';

// ── Helpers ────────────────────────────────────────────────────

function now() {
  return new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' });
}

async function sendEmail(subject, fields) {
  // Build a plain key:value body for FormSubmit (no HTML formatting)
  const payload = {
    _subject: subject,
    _template: 'basic',      // plain text — sin formateo
    _captcha: 'false',
    ...fields,
  };

  try {
    const res = await fetch(FORMSUBMIT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch (err) {
    console.error('[FormSubmit] Error:', err);
    return false;
  }
}

async function insertWixItem(collectionId, data) {
  try {
    await wixClient.items.insert(collectionId, { data });
    return true;
  } catch (err) {
    console.error(`[Wix CMS] Error inserting into ${collectionId}:`, err);
    return false;
  }
}

// ── Public API ─────────────────────────────────────────────────

/**
 * Submit a product quote (ThreadBuilder configurator).
 * Writes to Wix CMS "CotizacionesProducto" + emails ventas@hilosalce.mx
 */
export async function submitProductQuote({ nombre, email, linea, color, calibre, peso }) {
  const fecha = now();
  const data = { nombre, email, linea, color, calibre, peso, fecha };

  const emailFields = {
    'Nombre': nombre,
    'Email': email,
    'Línea': linea,
    'Color': color,
    'Calibre': calibre,
    'Peso': peso,
    'Fecha': fecha,
  };

  // Fire both in parallel
  const [wixOk, emailOk] = await Promise.all([
    insertWixItem('CotizacionesProducto', data),
    sendEmail(`Nueva Cotización de Producto — ${linea}`, emailFields),
  ]);

  return { wixOk, emailOk, success: wixOk || emailOk };
}

/**
 * Submit a contact form.
 * Writes to Wix CMS "ContactoGeneral" + emails ventas@hilosalce.mx
 */
export async function submitContactForm({ nombre, empresa, industria, telefono, email, mensaje }) {
  const fecha = now();
  const data = { nombre, empresa, industria, telefono, email, mensaje, fecha };

  const emailFields = {
    'Nombre': nombre,
    'Empresa': empresa || '—',
    'Industria': industria || '—',
    'Teléfono': telefono || '—',
    'Email': email || '—',
    'Mensaje': mensaje || '—',
    'Fecha': fecha,
  };

  const [wixOk, emailOk] = await Promise.all([
    insertWixItem('ContactoGeneral', data),
    sendEmail('Nuevo Contacto desde Hilos Alce Web', emailFields),
  ]);

  return { wixOk, emailOk, success: wixOk || emailOk };
}
