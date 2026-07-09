#!/bin/sh
# REI-OS Database Backup Script
set -e
BACKUP_DIR="${BACKUP_DIR:-./backups}"
TIMESTAMP=$(date -u +%Y%m%d_%H%M%S)
DB_URL="${DATABASE_URL:-postgresql://rei:rei@localhost:5432/rei_os}"

mkdir -p "$BACKUP_DIR"
echo "Backing up to $BACKUP_DIR/$TIMESTAMP.sql"
pg_dump "$DB_URL" > "$BACKUP_DIR/$TIMESTAMP.sql"
echo "Backup complete: $BACKUP_DIR/$TIMESTAMP.sql"
