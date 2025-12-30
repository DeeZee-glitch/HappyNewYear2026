# Troubleshooting: Data Not Saving to Database

If data is not being saved to your Supabase database, follow these steps:

## Step 1: Check Browser Console

Open your browser's Developer Tools (F12) and check the Console tab for error messages. Look for:
- `✅ Wish saved to database successfully` - Success!
- `❌ Error saving wish to database` - There's an error
- `⚠️ Supabase client not initialized` - Config issue

## Step 2: Verify Supabase Configuration

1. Open `config.js`
2. Make sure your Supabase URL and anon key are correct
3. The URL should look like: `https://xxxxx.supabase.co`
4. The anon key should start with `eyJ...`

## Step 3: Verify Database Table Exists

1. Go to your Supabase Dashboard
2. Navigate to **Table Editor**
3. Check if `birthday_wishes` table exists
4. If not, run `supabase-setup.sql` in the SQL Editor

## Step 4: Verify room_id Column Exists

1. In Supabase Dashboard, go to **Table Editor**
2. Click on `birthday_wishes` table
3. Check if `room_id` column exists
4. If not, run `supabase-room-migration.sql` in the SQL Editor

## Step 5: Check Row Level Security (RLS) Policies

1. In Supabase Dashboard, go to **Authentication** → **Policies**
2. Or go to **Table Editor** → `birthday_wishes` → **Policies**
3. Make sure these policies exist:
   - **SELECT policy**: "Anyone can read wishes" (should allow `true`)
   - **INSERT policy**: "Anyone can insert wishes" (should allow `true`)

If policies don't exist, run this in SQL Editor:

```sql
-- Create a policy that allows anyone to read wishes
CREATE POLICY "Anyone can read wishes" ON birthday_wishes
  FOR SELECT USING (true);

-- Create a policy that allows anyone to insert wishes
CREATE POLICY "Anyone can insert wishes" ON birthday_wishes
  FOR INSERT WITH CHECK (true);
```

## Step 6: Test Database Connection

1. Open browser console (F12)
2. Submit a wish
3. Look for these messages:
   - `Attempting to save to Supabase...` - Connection attempt
   - `✅ Wish saved to database successfully` - Success!
   - `❌ Error saving wish to database` - Check error details

## Step 7: Common Error Messages

### "relation 'birthday_wishes' does not exist"
**Solution**: Run `supabase-setup.sql` in Supabase SQL Editor

### "column 'room_id' does not exist"
**Solution**: Run `supabase-room-migration.sql` in Supabase SQL Editor

### "permission denied for table birthday_wishes"
**Solution**: Check RLS policies (Step 5) or disable RLS temporarily for testing:
```sql
ALTER TABLE birthday_wishes DISABLE ROW LEVEL SECURITY;
```

### "Supabase client not initialized"
**Solution**: Check `config.js` - make sure URL and anon key are correct

## Step 8: Verify Data in Supabase

1. Go to Supabase Dashboard
2. Navigate to **Table Editor**
3. Click on `birthday_wishes` table
4. Check if new rows are appearing when you submit wishes

## Quick Fix: Run All SQL Scripts

If you're unsure, run these SQL scripts in order in Supabase SQL Editor:

1. First, run `supabase-setup.sql`
2. Then, run `supabase-room-migration.sql`

This will create the table and add the room_id column.

## Still Not Working?

1. Check browser console for detailed error messages
2. Verify your Supabase project is active (not paused)
3. Check your Supabase project quota (free tier has limits)
4. Try disabling RLS temporarily to test:
   ```sql
   ALTER TABLE birthday_wishes DISABLE ROW LEVEL SECURITY;
   ```
   (Remember to re-enable it after testing!)

