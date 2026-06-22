-- Run this in your Supabase Dashboard > SQL Editor
-- This adds name and profile_picture columns to the mentor table for public browsing

ALTER TABLE mentor
  ADD COLUMN IF NOT EXISTS name text,
  ADD COLUMN IF NOT EXISTS profile_picture text;

-- (Optional) Back-fill existing mentor rows from the profile table
UPDATE mentor m
SET
  name = p.name,
  profile_picture = p.profile_picture
FROM profile p
WHERE p.id = m.mentor_id;
