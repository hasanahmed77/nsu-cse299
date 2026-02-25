#!/usr/bin/env bash
set -euo pipefail

VIDEO_DIR="/Users/mustakimahmedhasan/Workspace/Videos"
PROJECT_ID="iybzpqanrshnugqmynad"
BUCKET="media"

if [ -z "${SUPABASE_SERVICE_ROLE_KEY:-}" ]; then
  echo "ERROR: SUPABASE_SERVICE_ROLE_KEY is not set"
  echo "export SUPABASE_SERVICE_ROLE_KEY=..."
  exit 1
fi

if [ ! -f "$VIDEO_DIR/hls_manifest_map.txt" ]; then
  echo "ERROR: manifest not found at $VIDEO_DIR/hls_manifest_map.txt"
  exit 1
fi

while IFS='|' read -r filename slug; do
  [ -n "$slug" ] || continue
  folder="$VIDEO_DIR/$slug"
  [ -d "$folder" ] || continue

  echo "Uploading folder: $slug"
  while IFS= read -r -d '' file; do
    rel_path="${file#$VIDEO_DIR/}"
    content_type="application/octet-stream"
    case "$file" in
      *.m3u8) content_type="application/vnd.apple.mpegurl" ;;
      *.ts) content_type="video/mp2t" ;;
    esac

    curl -sS -X POST \
      "https://${PROJECT_ID}.supabase.co/storage/v1/object/${BUCKET}/${rel_path}" \
      -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
      -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
      -H "x-upsert: true" \
      -H "Content-Type: ${content_type}" \
      --data-binary "@${file}" >/dev/null
  done < <(find "$folder" -type f -print0)
done < "$VIDEO_DIR/hls_manifest_map.txt"

echo "Upload complete."
