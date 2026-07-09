#!/bin/sh
# REI-OS Database Restore Script
set -e
if [ -z "$1" ]; then
  echo "Usage: sh infra/backup/restore.sh <backup-file.sql>"
  exit 1
fi
DB_URL="${DATABASE_URL:-postgresql://rei:rei@localhost:5432/rei_os}"
echo "Restoring from $1"
psql "$DB_URL" < "$1"
echo "Restore complete."
