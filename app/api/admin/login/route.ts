import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    const adminPassword = process.env.ADMIN_PASSWORD || 'climaya2024';

    if (password !== adminPassword) {
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
    }

    cookies().set('admin_token', adminPassword, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 horas
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function DELETE() {
  cookies().set('admin_token', '', { maxAge: 0, path: '/' });
  return NextResponse.json({ success: true });
}

export async function GET() {
  const token = cookies().get('admin_token')?.value;
  const adminPassword = process.env.ADMIN_PASSWORD || 'climaya2024';
  return NextResponse.json({ authenticated: token === adminPassword });
}
