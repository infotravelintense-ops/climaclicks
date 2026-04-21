import { NextResponse } from 'next/server';
import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { isAdminAuthenticatedFromRequest } from '@/app/lib/admin-auth';

export const dynamic = 'force-dynamic';

const fichasDir = join(process.cwd(), 'public', 'fichas');
const catalogPath = join(process.cwd(), 'public', 'data', 'equipment-catalog.json');

export async function POST(req: Request) {
  if (!isAdminAuthenticatedFromRequest(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const modelo = formData.get('modelo') as string | null;

    if (!file || !modelo) {
      return NextResponse.json({ error: 'Faltan archivo o modelo' }, { status: 400 });
    }

    // Ensure fichas directory exists
    if (!existsSync(fichasDir)) {
      mkdirSync(fichasDir, { recursive: true });
    }

    // Sanitize filename
    const ext = file.name.split('.').pop()?.toLowerCase() || 'pdf';
    const sanitized = modelo.replace(/[^a-zA-Z0-9-_]/g, '_');
    const fileName = `${sanitized}.${ext}`;
    const filePath = join(fichasDir, fileName);

    // Write file
    const bytes = await file.arrayBuffer();
    writeFileSync(filePath, Buffer.from(bytes));

    // Update catalog with fichaTecnica path
    const fichaTecnicaUrl = `/fichas/${fileName}`;
    try {
      const catalogData = readFileSync(catalogPath, 'utf-8');
      const catalog = JSON.parse(catalogData);
      let updated = false;
      for (const item of catalog) {
        if (item.modelo === modelo) {
          item.fichaTecnica = fichaTecnicaUrl;
          updated = true;
        }
      }
      if (updated) {
        writeFileSync(catalogPath, JSON.stringify(catalog, null, 2));
      }
    } catch (e) {
      console.error('Error updating catalog:', e);
    }

    return NextResponse.json({ success: true, url: fichaTecnicaUrl });
  } catch (error) {
    console.error('Error uploading ficha:', error);
    return NextResponse.json({ error: 'Error al subir archivo' }, { status: 500 });
  }
}

// DELETE ficha técnica for a model
export async function DELETE(req: Request) {
  if (!isAdminAuthenticatedFromRequest(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  try {
    const { modelo } = await req.json();
    if (!modelo) {
      return NextResponse.json({ error: 'Falta modelo' }, { status: 400 });
    }

    // Remove from catalog
    const catalogData = readFileSync(catalogPath, 'utf-8');
    const catalog = JSON.parse(catalogData);
    for (const item of catalog) {
      if (item.modelo === modelo) {
        delete item.fichaTecnica;
      }
    }
    writeFileSync(catalogPath, JSON.stringify(catalog, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error eliminando ficha' }, { status: 500 });
  }
}
