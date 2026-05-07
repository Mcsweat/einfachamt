# EinfachAmt - MVP

A modern web application for simplifying German job center processes using AI.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm
- Supabase account (for backend services)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Mcsweat/einfachamt.git
cd einfachamt
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**
```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local and add your Supabase credentials
# NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. **Start the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📁 Project Structure

```
einfachamt/
├── app/              # Next.js app directory
├── components/       # Reusable React components
├── lib/              # Utility functions
├── public/           # Static assets
├── .env.example      # Environment variable template
├── .gitignore        # Git ignore rules
└── package.json      # Dependencies and scripts
```

## 🔐 Security Notes

- ⚠️ **Never commit `.env.local`** - it's automatically ignored via `.gitignore`
- 🔑 Your Supabase keys are safe in `.env.local` (local only)
- ✅ `.env.example` is safe to commit (contains placeholders)

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linting

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)

## 📝 License

This project is currently private.

## 👤 Author

**Mcsweat** - Project Lead

---

**Last Updated:** 2026-05-07
