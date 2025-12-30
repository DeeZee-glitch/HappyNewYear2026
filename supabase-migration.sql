-- Migration Script: Add IP Address and Device Info Columns
-- Run this if you already have the birthday_wishes table created
-- This will add the new columns to your existing table

-- Add ip_address column
ALTER TABLE birthday_wishes 
ADD COLUMN IF NOT EXISTS ip_address INET;

-- Add device_info column (JSONB for storing device details)
ALTER TABLE birthday_wishes 
ADD COLUMN IF NOT EXISTS device_info JSONB;

-- Create index on ip_address for analytics queries (optional)
CREATE INDEX IF NOT EXISTS idx_birthday_wishes_ip_address ON birthday_wishes(ip_address);

-- Create index on device_info for device-based queries (optional)
CREATE INDEX IF NOT EXISTS idx_birthday_wishes_device_info ON birthday_wishes USING GIN(device_info);

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'birthday_wishes' 
AND column_name IN ('ip_address', 'device_info');

