import { cookies } from 'next/headers';

export function isAdminAuthenticated(): boolean {
  try {
    const token = cookies().get('admin_token')?.value;
    const adminPassword = process.env.ADMIN_PASSWORD || 'climaya2024';
    return token === adminPassword;
  } catch (e) {
    console.error('Admin auth check failed:', e);
    return false;
  }
}

// Request-based auth check (more reliable in standalone builds)
export function isAdminAuthenticatedFromRequest(req: Request): boolean {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const match = cookieHeader.match(/admin_token=([^;]+)/);
    const token = match ? decodeURIComponent(match[1]) : null;
    const adminPassword = process.env.ADMIN_PASSWORD || 'climaya2024';
    return token === adminPassword;
  } catch (e) {
    console.error('Admin auth check from request failed:', e);
    return false;
  }
}
