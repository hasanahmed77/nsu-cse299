-- Generated movie inserts for Supabase
-- Run in Supabase SQL Editor after HLS upload

INSERT INTO movies (title, description, year, duration_minutes, maturity_rating, poster_url, backdrop_url, hls_master_url)
SELECT 'Assassin''s Creed Origins Cinematic Trailer', 'Trailer stream', NULL, NULL, 'NR', NULL, NULL, 'https://iybzpqanrshnugqmynad.supabase.co/storage/v1/object/public/media/assassin-s-creed-origins-cinematic-trailer/master.m3u8'
WHERE NOT EXISTS (SELECT 1 FROM movies WHERE title = 'Assassin''s Creed Origins Cinematic Trailer');

INSERT INTO movies (title, description, year, duration_minutes, maturity_rating, poster_url, backdrop_url, hls_master_url)
SELECT 'F1', 'Trailer stream', NULL, NULL, 'NR', NULL, NULL, 'https://iybzpqanrshnugqmynad.supabase.co/storage/v1/object/public/media/f1/master.m3u8'
WHERE NOT EXISTS (SELECT 1 FROM movies WHERE title = 'F1');

INSERT INTO movies (title, description, year, duration_minutes, maturity_rating, poster_url, backdrop_url, hls_master_url)
SELECT 'Interstellar Movie - Official Teaser', 'Trailer stream', NULL, NULL, 'NR', NULL, NULL, 'https://iybzpqanrshnugqmynad.supabase.co/storage/v1/object/public/media/interstellar-movie-official-teaser/master.m3u8'
WHERE NOT EXISTS (SELECT 1 FROM movies WHERE title = 'Interstellar Movie - Official Teaser');

INSERT INTO movies (title, description, year, duration_minutes, maturity_rating, poster_url, backdrop_url, hls_master_url)
SELECT 'Marvel’s Spider-Man – Be Greater Extended Trailer _ PS4', 'Trailer stream', NULL, NULL, 'NR', NULL, NULL, 'https://iybzpqanrshnugqmynad.supabase.co/storage/v1/object/public/media/marvel-s-spider-man-be-greater-extended-trailer-ps4/master.m3u8'
WHERE NOT EXISTS (SELECT 1 FROM movies WHERE title = 'Marvel’s Spider-Man – Be Greater Extended Trailer _ PS4');

INSERT INTO movies (title, description, year, duration_minutes, maturity_rating, poster_url, backdrop_url, hls_master_url)
SELECT 'Peaky Blinders_ The Immortal Man _ Official Teaser _ Netflix', 'Trailer stream', NULL, NULL, 'NR', NULL, NULL, 'https://iybzpqanrshnugqmynad.supabase.co/storage/v1/object/public/media/peaky-blinders-the-immortal-man-official-teaser-netflix/master.m3u8'
WHERE NOT EXISTS (SELECT 1 FROM movies WHERE title = 'Peaky Blinders_ The Immortal Man _ Official Teaser _ Netflix');

INSERT INTO movies (title, description, year, duration_minutes, maturity_rating, poster_url, backdrop_url, hls_master_url)
SELECT 'Red Dead Redemption 2 Trailer', 'Trailer stream', NULL, NULL, 'NR', NULL, NULL, 'https://iybzpqanrshnugqmynad.supabase.co/storage/v1/object/public/media/red-dead-redemption-2-trailer/master.m3u8'
WHERE NOT EXISTS (SELECT 1 FROM movies WHERE title = 'Red Dead Redemption 2 Trailer');

INSERT INTO movies (title, description, year, duration_minutes, maturity_rating, poster_url, backdrop_url, hls_master_url)
SELECT 'The Witcher 3_ Wild Hunt - The Sword of Destiny E3 2014 Trailer', 'Trailer stream', NULL, NULL, 'NR', NULL, NULL, 'https://iybzpqanrshnugqmynad.supabase.co/storage/v1/object/public/media/the-witcher-3-wild-hunt-the-sword-of-destiny-e3-2014-trailer/master.m3u8'
WHERE NOT EXISTS (SELECT 1 FROM movies WHERE title = 'The Witcher 3_ Wild Hunt - The Sword of Destiny E3 2014 Trailer');

INSERT INTO movies (title, description, year, duration_minutes, maturity_rating, poster_url, backdrop_url, hls_master_url)
SELECT '“Spider-Noir” – Authentic Black & White Teaser Trailer _ Prime Video', 'Trailer stream', NULL, NULL, 'NR', NULL, NULL, 'https://iybzpqanrshnugqmynad.supabase.co/storage/v1/object/public/media/spider-noir-authentic-black-white-teaser-trailer-prime-video/master.m3u8'
WHERE NOT EXISTS (SELECT 1 FROM movies WHERE title = '“Spider-Noir” – Authentic Black & White Teaser Trailer _ Prime Video');
