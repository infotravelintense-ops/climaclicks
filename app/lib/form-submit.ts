/**
 * Form submission helper with environment-aware transport.
 *
 * If `NEXT_PUBLIC_N8N_WEBHOOK_URL` is set (Cloudflare Pages / static export),
 * every form submission is POSTed to that single webhook with a `type`
 * discriminator so n8n can route it to the right flow.
 *
 * Otherwise we fall back to the internal API route (SSR/dev builds), keeping
 * the existing behaviour on Abacus / Hostinger deployments.
 */

type FormType = 'quote' | 'contact';

const WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '';

async function postJson(url: string, body: Record<string, unknown>): Promise<Response> {
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/**
 * Submit the full quote created at the end of the 6-step flow.
 */
export async function submitQuote(payload: Record<string, unknown>): Promise<Response> {
  if (WEBHOOK_URL) {
    return postJson(WEBHOOK_URL, {
      type: 'quote' as FormType,
      source: 'climaclicks-web',
      submittedAt: new Date().toISOString(),
      payload,
    });
  }
  return postJson('/api/quote/create', payload);
}

/**
 * Submit contact / lead forms (Tekno Point, "Asesoramiento técnico",
 * repair payment form, etc.).
 */
export async function submitContact(payload: Record<string, unknown>): Promise<Response> {
  if (WEBHOOK_URL) {
    return postJson(WEBHOOK_URL, {
      type: 'contact' as FormType,
      source: 'climaclicks-web',
      submittedAt: new Date().toISOString(),
      payload,
    });
  }
  return postJson('/api/contact', payload);
}

/**
 * Whether the app is currently running against the static / webhook transport.
 * Useful for minor UX adjustments in components (e.g. success messages).
 */
export function isWebhookMode(): boolean {
  return WEBHOOK_URL.length > 0;
}
