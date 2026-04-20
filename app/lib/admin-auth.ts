import { cookies } from 'next/headers';

export function isAdminAuthenticated(): boolean {
  const token = cookies().get('admin_token')?.value;
  const adminPassword = process.env.ADMIN_PASSWORD || 'climaya2024';
  return token === adminPassword;
}
