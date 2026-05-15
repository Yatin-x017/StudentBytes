# StudentBytes Deployment Guide

This guide covers deploying StudentBytes to Vercel with all required environment variables and Supabase configuration.

## Prerequisites

- GitHub repository linked to Vercel
- Supabase project set up
- API keys for AI providers (Anthropic, Gemini, or Groq)

## Step 1: Supabase Setup

### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to initialize
3. Navigate to **Settings → API** and copy:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`

### Apply Database Schema

1. In Supabase, go to **SQL Editor**
2. Create a new query and paste the contents of `supabase/schema.sql`
3. Execute the query to create all tables and policies
4. Verify tables are created: `profiles`, `sessions`, `notes`, `spaced_repetition`, `quiz_history`, `user_settings`, `curriculums`, `chat_messages`

### Configure OAuth Providers

1. Go to **Authentication → Providers**
2. Enable **Google**:
   - Add your Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com)
   - Set redirect URL to your Vercel domain
3. Enable **Discord** (optional):
   - Add Discord OAuth credentials from [Discord Developer Portal](https://discord.com/developers)

## Step 2: Environment Variables

### In Vercel Dashboard

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add the following variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | From Supabase Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key | From Supabase Settings → API |
| `GROQ_API_KEY` | Your Groq API key | From [console.groq.com](https://console.groq.com) (optional if using Anthropic) |
| `VITE_GOOGLE_CLIENT_ID` | Your Google Client ID | From Google Cloud Console (optional for Canvas integration) |

### Local Development

Create a `.env.local` file in the project root:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## Step 3: Vercel Deployment

### Automatic Deployment

1. Push changes to your GitHub repository
2. Vercel automatically detects changes and deploys
3. Monitor deployment in Vercel Dashboard

### Manual Deployment

```bash
npm run build
vercel deploy --prod
```

## Step 4: Post-Deployment Configuration

### Update OAuth Redirect URLs

1. In Supabase, go to **Authentication → URL Configuration**
2. Add your Vercel domain to **Redirect URLs**:
   - `https://your-domain.vercel.app/dashboard`
   - `https://your-domain.vercel.app/login`

### Test the Application

1. Visit your deployed URL
2. Sign up with email or OAuth
3. Complete the onboarding flow
4. Test AI features (Study, Quiz)

## Troubleshooting

### "Supabase not configured" Error

- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in Vercel
- Check that values don't have extra spaces or quotes

### OAuth Not Working

- Ensure redirect URLs are correctly configured in Supabase
- Check Google/Discord OAuth credentials are valid
- Verify OAuth provider is enabled in Supabase

### AI Features Not Working

- Verify `GROQ_API_KEY` is set (or user has provided their own API key)
- Check API key is valid and has available credits
- Test with built-in Groq first before user-provided keys

## Performance Optimization

### Vercel Configuration

The `vercel.json` file is already configured with:
- SPA rewrites for client-side routing
- Automatic compression
- Edge caching

### Build Optimization

The project uses:
- **Vite** for fast builds
- **React 19** with SWC for optimized transpilation
- **Tailwind CSS 4** with PostCSS for minimal CSS output
- **Code splitting** for lazy-loaded routes

## Monitoring

### Vercel Analytics

1. Enable **Web Analytics** in Vercel Dashboard
2. Monitor Core Web Vitals and performance metrics
3. Set up error tracking via Sentry (optional)

### Supabase Monitoring

1. Go to **Database → Logs** to monitor query performance
2. Check **Auth → Logs** for authentication issues
3. Monitor **Realtime** subscriptions for chat features

## Security Checklist

- [ ] Supabase RLS policies are enabled on all tables
- [ ] OAuth credentials are stored securely in Vercel
- [ ] API keys are not committed to Git
- [ ] Vercel environment variables are marked as sensitive where applicable
- [ ] CORS is properly configured in Supabase
- [ ] Email templates are customized in Supabase Auth

## Next Steps

1. **Enable Analytics**: Set up user tracking to understand usage patterns
2. **Configure Email**: Customize Supabase Auth email templates
3. **Set Up Monitoring**: Add error tracking and performance monitoring
4. **Plan Scaling**: Monitor database usage and upgrade as needed

For more information, see:
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [StudentBytes README](./README.md)
