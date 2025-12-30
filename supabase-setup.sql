-- Supabase Database Setup Script
-- Run this in your Supabase SQL Editor

-- Create the birthday_wishes table
CREATE TABLE IF NOT EXISTS birthday_wishes (
  id BIGSERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  wisher_name TEXT DEFAULT 'Anonymous',
  ip_address INET,
  device_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE birthday_wishes ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read wishes
CREATE POLICY "Anyone can read wishes" ON birthday_wishes
  FOR SELECT USING (true);

-- Create a policy that allows anyone to insert wishes
CREATE POLICY "Anyone can insert wishes" ON birthday_wishes
  FOR INSERT WITH CHECK (true);

-- Optional: Create an index for faster queries
CREATE INDEX IF NOT EXISTS idx_birthday_wishes_created_at ON birthday_wishes(created_at DESC);

-- Verify the table was created
SELECT * FROM birthday_wishes LIMIT 1;

