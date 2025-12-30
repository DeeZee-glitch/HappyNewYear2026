# 🎉 Birthday Celebration Website

A fun and interactive birthday celebration website with cursor-following animations, confetti effects, birthday cards, and a **shareable birthday wishes board** powered by Supabase!

## 📋 Project Description

This is a beautiful, interactive birthday celebration website that includes:

- **Animated Birthday Greeting**: A welcoming "Happy Birthday!" message with bounce animations
- **Cursor-Following Cake**: A birthday cake emoji that follows your mouse cursor
- **Interactive Birthday Cards**: Flip cards with beautiful birthday messages
- **Confetti Effects**: Click anywhere on the page to trigger colorful confetti!
- **Personal Birthday Wishes Board**: Write and submit birthday wishes that are stored in your browser's localStorage
- **Privacy-Focused**: Each user only sees their own wishes - no one else can see your wishes
- **Database Analytics**: Wishes are also saved to Supabase for analytics (but not displayed publicly)
- **Floating Balloons**: Animated balloons that float across the screen
- **Sound Effects**: Celebratory sounds when clicking or submitting wishes
- **Multi-shareable Link**: Share your birthday page link with friends and family!

## 🚀 Setup Instructions

### Step 1: Clone or Download

```bash
git clone https://github.com/DeeZee-glitch/HappyBirthday.git
cd HappyBirthday
```

### Step 2: Set Up Supabase (Required for Wishes Board)

1. **Create a Supabase Account**
   - Go to [https://supabase.com](https://supabase.com)
   - Sign up for a free account

2. **Create a New Project**
   - Click "New Project"
   - Choose an organization (or create one)
   - Enter project details:
     - Name: `birthday-wishes` (or any name you prefer)
     - Database Password: (save this securely)
     - Region: Choose closest to you
   - Click "Create new project" (takes 1-2 minutes)

3. **Create the Database Table**
   - In your Supabase project, go to **SQL Editor**
   - Click **New Query**
   - **Option A: New Setup** - If you're setting up for the first time:
     - Open `supabase-setup.sql` and copy the entire SQL script
     - Paste it into the SQL Editor
     - Click **Run** to execute
   
   - **Option B: Existing Table** - If you already have the table created:
     - Open `supabase-migration.sql` and copy the SQL script
     - Paste it into the SQL Editor
     - Click **Run** to add the new columns (ip_address, device_info)
   
   The table includes:
   - `id` - Unique identifier
   - `message` - The birthday wish message
   - `wisher_name` - Name of the person leaving the wish
   - `ip_address` - IP address of the user (for analytics)
   - `device_info` - Device information stored as JSON (browser, OS, device type, language)
   - `created_at` - Timestamp when the wish was created

4. **Get Your Supabase Credentials**
   - Go to **Settings** → **API**
   - Copy your **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - Copy your **anon/public key** (starts with `eyJ...`)

5. **Configure the Project**
   - Open `config.js` in your project
   - Replace `YOUR_SUPABASE_URL` with your Project URL
   - Replace `YOUR_SUPABASE_ANON_KEY` with your anon/public key

   ```javascript
   const SUPABASE_CONFIG = {
       url: 'https://your-project.supabase.co',  // Your Project URL
       anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'  // Your anon key
   };
   ```

### Step 3: Run the Project

**Option A: Simple (No Server)**
- Just open `index.html` in your web browser
- Note: Some features may work better with a server

**Option B: With Local Server (Recommended)**

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000` in your browser

### Step 4: Deploy to Make it Public

To share your birthday page with others, deploy it to a hosting service:

**Free Hosting Options:**
- **Netlify**: Drag and drop your folder to [netlify.com](https://netlify.com)
- **Vercel**: Connect your GitHub repo to [vercel.com](https://vercel.com)
- **GitHub Pages**: Push to GitHub and enable Pages in repository settings
- **Supabase Hosting**: Use Supabase's built-in hosting

Once deployed, share the link with friends and family!

## 📦 Dependencies

### External Libraries (Loaded via CDN)

- **canvas-confetti**: A lightweight confetti library for creating beautiful confetti effects
  - CDN: `https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js`
  
- **Supabase JS Client**: For database functionality
  - CDN: `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2`
  - Used for storing and retrieving birthday wishes

### No Build Process Required

This project uses vanilla JavaScript, HTML, and CSS - no build tools or package managers needed!

## 🎨 Features

### Interactive Elements

- **Cursor Following**: Move your mouse to see the birthday cake follow along
- **Interactive Birthday Cards**: Click cards to flip and reveal birthday messages
- **Click Confetti**: Click anywhere on the page to trigger confetti at that location
- **Wish Submission**: Write birthday wishes with optional name
- **Personal Wishes Board**: Beautiful grid display of YOUR wishes (stored in browser localStorage)
- **Privacy**: Each user only sees their own wishes - completely private
- **Floating Balloons**: Watch colorful balloons float across the screen
- **Sound Effects**: Celebratory sounds when clicking or submitting wishes

### Storage Features

- **LocalStorage Display**: Wishes are displayed from your browser's localStorage - each user only sees their own wishes
- **Privacy-First**: Your wishes are private to you - no one else can see them
- **Database Analytics**: Wishes are also saved to Supabase in the background for analytics purposes
- **Persistent**: Wishes persist in your browser even after closing the page
- **No Cross-Device Sync**: Wishes are device-specific (stored in each browser's localStorage)

### Responsive Design

The website is fully responsive and works on:

- Desktop computers
- Tablets
- Mobile devices

## 📁 Project Structure

```
birthday-celebration/
├── index.html          # Main HTML file
├── styles.css          # Styling and animations
├── script.js           # Interactive JavaScript functionality
├── config.js           # Supabase configuration (you need to add your credentials)
├── assets/             # Directory for images, fonts, etc. (optional)
└── README.md           # Project documentation
```

## 🎯 Usage

1. **View the greeting**: The main birthday greeting appears at the top
2. **Flip birthday cards**: Click on any card to flip and read birthday messages
3. **Move your mouse**: Watch the birthday cake follow your cursor
4. **Click anywhere**: Trigger confetti effects
5. **Write a wish**: 
   - Type a birthday message in the textarea
   - Optionally add your name
   - Click "Submit Wish" button or press Ctrl+Enter
6. **View wishes board**: See all submitted wishes displayed in a beautiful grid
7. **Share the link**: Share your birthday page URL with friends and family
8. **Watch balloons**: See balloons float across the screen

## 🛠️ Customization

### Change Colors

Edit `styles.css` to customize colors:

- Background gradient: Modify the `background` property in `body`
- Accent colors: Change `#ff7f50` and `#ff6347` throughout the file

### Add Images

1. Place images in the `assets/` folder
2. Update `index.html` to reference your images
3. Modify `styles.css` to style the images

### Modify Text

- Update the greeting in `index.html`
- Change the footer text with your name
- Update the GitHub repository link

## 🎵 Sound Effects

The website includes simple sound effects using the Web Audio API. These are subtle beep sounds that play on interactions. For more advanced sound effects, you can:

1. Add audio files to the `assets/` folder
2. Use the HTML5 `<audio>` element
3. Update `script.js` to play audio files

## 🔒 Security & Privacy

- **Row Level Security (RLS)**: Enabled on Supabase table
- **Public Read/Write**: Anyone with the link can view and add wishes
- **Database Protection**: Database credentials are kept in `config.js` (not exposed to users)
- **No Authentication Required**: Simple and accessible for everyone

## 🌟 Future Enhancements

Potential features to add:

- [x] Supabase database integration
- [x] Real-time wish updates
- [x] Shareable link functionality
- [ ] Multiple birthday themes
- [ ] Photo gallery section
- [ ] Birthday countdown timer
- [ ] Music player integration
- [ ] Social media sharing
- [ ] Multiple language support
- [ ] Wish moderation/admin panel

## 📝 License

This project is open source and available for personal use. Feel free to modify and customize it for your birthday celebrations!

## 🙏 Acknowledgements

- **canvas-confetti**: For the beautiful confetti effects
  - GitHub: https://github.com/catdad/canvas-confetti
  - License: MIT

## 💝 Made With

- HTML5
- CSS3 (with animations and glassmorphism effects)
- Vanilla JavaScript
- canvas-confetti library
- Supabase (for database and real-time features)
- Google Fonts (Poppins)

## 🆘 Troubleshooting

### Wishes not saving?
- Check that you've configured `config.js` with your Supabase credentials
- Verify the database table was created correctly
- Check browser console for any error messages
- Ensure the table has all required columns (run `supabase-migration.sql` if needed)

### Real-time updates not working?
- Real-time updates are disabled - wishes are displayed from localStorage
- Each user only sees their own wishes
- Wishes are saved to database for analytics but displayed from browser storage

### Can't see wishes board?
- Wishes are stored in your browser's localStorage
- Check if localStorage is enabled in your browser
- Try clearing localStorage and submitting a new wish
- Check browser console for any errors

### Wishes not persisting?
- localStorage is browser-specific - wishes won't sync across devices
- If you clear browser data, wishes will be lost
- Wishes are saved to database for analytics but displayed from localStorage

### IP address or device info not saving?
- IP address requires internet connection (uses ipify.org API)
- If IP fetch fails, the wish will still be saved (IP will be null)
- Device info is captured from browser navigator object
- Check browser console for any errors related to IP fetching
- Note: This data is saved to database for analytics but not displayed on the page

---

**Enjoy your birthday celebration! 🎂🎉🎈**
