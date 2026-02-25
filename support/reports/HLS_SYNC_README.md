# HLS Batch Conversion + Supabase Sync

## What was done
- Converted all video files in `/Users/mustakimahmedhasan/Workspace/Videos` to HLS.
- Created one folder per video with:
  - `master.m3u8`
  - `720p.m3u8`
  - `seg_XXX.ts`
- Generated manifest: `/Users/mustakimahmedhasan/Workspace/Videos/hls_manifest_map.txt`

## Files generated
- Upload script: `/Users/mustakimahmedhasan/Workspace/Research/cse299/support/reports/upload_hls_to_supabase.sh`
- SQL inserts: `/Users/mustakimahmedhasan/Workspace/Research/cse299/support/reports/insert_movies.sql`

## Final steps
1. Export your service role key:
```bash
export SUPABASE_SERVICE_ROLE_KEY='YOUR_SERVICE_ROLE_KEY'
```

2. Upload all HLS files to bucket `media`:
```bash
cd /Users/mustakimahmedhasan/Workspace/Research/cse299/support
./reports/upload_hls_to_supabase.sh
```

3. Open Supabase SQL editor and run:
- `/Users/mustakimahmedhasan/Workspace/Research/cse299/support/reports/insert_movies.sql`

## Resulting HLS URL format
`https://iybzpqanrshnugqmynad.supabase.co/storage/v1/object/public/media/<slug>/master.m3u8`
