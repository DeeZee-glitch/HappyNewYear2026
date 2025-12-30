-- Migration to add room_id column for shared wish boards
-- Run this in your Supabase SQL Editor

-- Add room_id column to the table
ALTER TABLE birthday_wishes 
ADD COLUMN IF NOT EXISTS room_id TEXT;

-- Create an index for faster queries by room_id
CREATE INDEX IF NOT EXISTS idx_birthday_wishes_room_id ON birthday_wishes(room_id);

-- Update existing rows to have a default room_id (optional - for existing data)
-- UPDATE birthday_wishes SET room_id = 'default' WHERE room_id IS NULL;

