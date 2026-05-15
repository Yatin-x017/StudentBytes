# StudentBytes: Quick Start Guide

## For Developers

### 1. Clone the Repository

```bash
git clone https://github.com/Yatin-x017/StudentBytes.git
cd StudentBytes
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 5. Test the Application

1. **Sign Up**: Create a new account
2. **Complete Profile**: Fill in your college, course, year, and age
3. **Explore Features**:
   - Study: Chat with AI tutor
   - Quiz: Generate and take quizzes
   - Notes: Create and manage notes
   - Analytics: View your progress

---

## For Deployment

### Prerequisites

- Supabase project created
- Vercel account connected to GitHub
- GitHub repository pushed

### Deployment Steps

1. **Configure Supabase**
   - Apply schema from `supabase/schema.sql`
   - Enable Google and Discord OAuth
   - Add your Vercel domain to redirect URLs

2. **Deploy to Vercel**
   ```bash
   # Push to GitHub
   git push origin main
   
   # Vercel will automatically deploy
   # Set environment variables in Vercel dashboard:
   # - VITE_SUPABASE_URL
   # - VITE_SUPABASE_ANON_KEY
   ```

3. **Verify Deployment**
   - Test sign up and login
   - Complete profile onboarding
   - Test AI features
   - Check console for errors

---

## Key Features

### Profile Onboarding
After signup, users are guided through a profile creation flow where they specify:
- Age
- College/University
- Branch/Major
- Year of Study

This data is used to personalize the AI experience.

### AI Personalization
The AI adapts responses based on:
- User's college and course
- Year of study (1st-4th year)
- Preferred programming language
- Relevant curriculum topics

### Material Design 3 UI
- Modern, clean interface
- Smooth animations
- Accessibility-first design
- Responsive on all devices

---

## Project Structure

```
src/
├── pages/              # Page components
├── components/         # Reusable components
├── hooks/             # Custom React hooks
├── lib/               # Utilities and libraries
├── context/           # React context providers
└── assets/            # Static assets
```

---

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

---

## Troubleshooting

### "Supabase not configured" error
- Check that `.env.local` has correct values
- Verify Supabase project is active

### OAuth not working
- Ensure redirect URLs are configured in Supabase
- Check OAuth provider credentials

### Profile onboarding not showing
- Clear browser cache
- Check that profile data is incomplete in Supabase

### AI responses not personalized
- Verify profile is complete
- Check that profile data is saved in Supabase
- Inspect browser console for errors

---

## Need Help?

1. Check `DEPLOYMENT_GUIDE.md` for detailed setup
2. Review `IMPLEMENTATION_SUMMARY.md` for architecture overview
3. Check Supabase documentation: https://supabase.com/docs
4. Check Vercel documentation: https://vercel.com/docs

---

**Happy coding! 🚀**
