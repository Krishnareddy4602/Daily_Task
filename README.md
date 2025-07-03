# Divine Forms Portal

A beautiful, responsive two-tab application for managing spiritual journey entries with real-time synchronization.

## Features

- **Two-Tab Layout**: Separate forms for Vishnu and Krishna entries
- **Real-time Sync**: All data syncs instantly across sessions using Supabase
- **Beautiful Design**: Modern glass-morphism design with smooth animations
- **Form Validation**: Client-side validation for all required fields
- **Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **Production Ready**: Built with TypeScript, React, and Tailwind CSS

## Quick Start

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Set up Supabase** (see detailed instructions below)

3. **Configure Environment**
   ```bash
   cp .env.example .env
   # Add your Supabase credentials to .env
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## Supabase Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization and fill in project details
4. Wait for the project to be created (takes 1-2 minutes)

### 2. Get Your API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the **Project URL** and **anon public** key
3. Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Create the Database Table

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query" and paste this SQL:

```sql
-- Create the form_entries table
CREATE TABLE form_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category TEXT NOT NULL CHECK (category IN ('vishnu', 'krishna')),
    date DATE NOT NULL,
    referral_link TEXT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE form_entries ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations (for demo purposes)
-- In production, you'd want more restrictive policies
CREATE POLICY "Allow all operations" ON form_entries
    FOR ALL USING (true);

-- Create an index for better performance
CREATE INDEX idx_form_entries_category ON form_entries(category);
CREATE INDEX idx_form_entries_created_at ON form_entries(created_at);
```

3. Click "Run" to execute the query

### 4. Enable Realtime (Optional but Recommended)

1. Go to **Database** → **Replication**
2. Find the `form_entries` table
3. Toggle "Enable" for realtime updates

## Project Structure

```
src/
├── components/
│   └── FormTab.tsx          # Main form component for each tab
├── hooks/
│   └── useFormEntries.ts    # Custom hook for Supabase operations
├── lib/
│   └── supabase.ts          # Supabase client configuration
├── types/
│   └── database.ts          # TypeScript interfaces
└── App.tsx                  # Main application component
```

## Technologies Used

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Supabase** for real-time database
- **Lucide React** for icons
- **Vite** for development and building

## Database Schema

The `form_entries` table contains:
- `id` (UUID, Primary Key)
- `category` ('vishnu' or 'krishna')
- `date` (Date)
- `referral_link` (Text/URL)
- `comment` (Text)
- `created_at` (Timestamp)

## Deployment

Build the project for production:

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## Troubleshooting

### Environment Variables Not Working
- Make sure your `.env` file is in the root directory
- Restart your development server after changing environment variables
- Ensure variable names start with `VITE_`

### Database Connection Issues
- Verify your Supabase URL and API key are correct
- Check that your Supabase project is active
- Ensure the database table exists and has the correct schema

### Realtime Not Working
- Confirm realtime is enabled for the `form_entries` table
- Check your browser's developer console for connection errors
- Verify your RLS policies allow the operations you're trying to perform