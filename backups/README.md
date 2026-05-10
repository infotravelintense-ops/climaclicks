# 🗄️ Backups de la Base de Datos — Climaclicks

## Contenido

Esta carpeta contiene **dumps SQL completos** de la base de datos PostgreSQL de producción de Climaclicks.

Cada archivo `backup_db_YYYYMMDD_HHMMSS.sql.gz` es un dump generado con `pg_dump 17` con las opciones:

```
--no-owner --no-acl --clean --if-exists
```

Esto significa que el backup:
- ✅ Incluye **esquema completo** (tablas, índices, constraints, secuencias).
- ✅ Incluye **todos los datos** de cada tabla.
- ✅ Hace `DROP IF EXISTS` antes de crear cada objeto, por lo que se puede restaurar limpiamente sobre una BD existente.
- ✅ NO incluye permisos ni propietarios (portable a cualquier servidor PostgreSQL).

### Tablas incluidas

| Tabla | Descripción |
|---|---|
| `Contact` | Contactos enviados desde formularios (casco antiguo, ExcedeBanner, etc.) |
| `Quote` | Presupuestos completados desde el flujo de 6 pasos |
| `DiscountByIP` | Tracking de descuentos temporales por IP |
| `SeasonConfig` | Configuración dinámica de precios desde el panel admin |

---

## 🔄 Cómo restaurar un backup

### Requisitos
- Cliente `psql` (cualquier versión >= 15 funciona, pero recomendado 17).
- Acceso a una base de datos PostgreSQL vacía o existente (donde restaurar).

### Pasos

1. **Descomprime el archivo:**
   ```bash
   gunzip backup_db_YYYYMMDD_HHMMSS.sql.gz
   ```

2. **Restaura sobre la base de datos destino:**
   ```bash
   psql "$DATABASE_URL_DESTINO" < backup_db_YYYYMMDD_HHMMSS.sql
   ```

   Donde `DATABASE_URL_DESTINO` es la URL de conexión completa, por ejemplo:
   ```
   postgresql://usuario:password@host:5432/nombre_bd
   ```

3. **Verifica que las tablas se han creado correctamente:**
   ```bash
   psql "$DATABASE_URL_DESTINO" -c "\dt"
   ```

### Restauración directa desde el archivo comprimido (sin descomprimir)

```bash
gunzip -c backup_db_YYYYMMDD_HHMMSS.sql.gz | psql "$DATABASE_URL_DESTINO"
```

---

## ⚠️ IMPORTANTE — Privacidad y seguridad

- **El repositorio que contiene estos backups DEBE SER PRIVADO.**
- Los backups pueden contener **datos personales** de clientes (nombres, emails, teléfonos, direcciones) que están sujetos al RGPD.
- **NUNCA** hagas público este repositorio ni compartas los archivos `.sql.gz` por canales no seguros.
- Si necesitas compartir un backup, hazlo a través de canales cifrados (ej. transferencia SFTP autenticada).

---

## 📝 Cómo generar un nuevo backup manualmente

```bash
cd /home/ubuntu/climamallorca/nextjs_space
TS=$(date +%Y%m%d_%H%M%S)
/usr/lib/postgresql/17/bin/pg_dump "$DATABASE_URL" \
  --no-owner --no-acl --clean --if-exists \
  -f "backups/backup_db_${TS}.sql"
gzip -9 "backups/backup_db_${TS}.sql"
```

Después haz commit y push al repositorio:

```bash
git add backups/
git commit -m "Backup BD $(date +%Y-%m-%d)"
git push
```
