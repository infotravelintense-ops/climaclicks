import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { isAdminAuthenticated } from '@/app/lib/admin-auth';

export const dynamic = 'force-dynamic';

const catalogPath = join(process.cwd(), 'public', 'data', 'equipment-catalog.json');

export async function GET() {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  try {
    const data = readFileSync(catalogPath, 'utf-8');
    const catalog = JSON.parse(data);
    return NextResponse.json(catalog);
  } catch (error) {
    return NextResponse.json({ error: 'Error leyendo catálogo' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  try {
    const catalog = await req.json();
    if (!Array.isArray(catalog)) {
      return NextResponse.json({ error: 'Formato inválido' }, { status: 400 });
    }
    writeFileSync(catalogPath, JSON.stringify(catalog, null, 2));
    return NextResponse.json({ success: true, count: catalog.length });
  } catch (error) {
    return NextResponse.json({ error: 'Error guardando catálogo' }, { status: 500 });
  }
}
