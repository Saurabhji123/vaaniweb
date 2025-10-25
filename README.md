# 🌐 VaaniWeb - Voice-Powered Website Generator# VaaniWeb - Voice to Website Generator



> **Transform your voice into stunning websites in seconds!** Create stunning websites just by speaking! VaaniWeb uses Google Cloud Speech-to-Text and Gemini AI to convert your voice descriptions into fully functional, beautifully designed web pages.

> 

> VaaniWeb is an AI-powered platform that converts voice descriptions into fully functional, professionally designed websites. Simply speak your vision, and watch it come to life instantly.## 🚀 Features



[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)- **Voice Input**: Hold and speak for up to 12 seconds to describe your website

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)- **AI-Powered Generation**: Uses Google Cloud Speech-to-Text + Gemini 1.5 Flash

[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8)](https://tailwindcss.com/)- **Instant Deployment**: Pages are generated and stored in MongoDB Atlas

[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248)](https://www.mongodb.com/)- **Zero File Storage**: Everything lives in-memory and database

[![Groq AI](https://img.shields.io/badge/Groq-AI-orange)](https://groq.com/)- **Feed & Remix**: Browse recent pages and remix them with your own twist

- **Edge Runtime**: Lightning-fast responses using Vercel Edge Functions

---- **Free Tier Friendly**: Designed to work within free tier limits



## ✨ Key Features## 📋 Prerequisites



### 🎤 **Voice-to-Website Magic**1. **Google Cloud API Key** - For Speech-to-Text API

- **Real-time voice recognition** with instant transcript generation   - Go to [Google Cloud Console](https://console.cloud.google.com/)

- **Intelligent AI analysis** powered by Groq's ultra-fast LLM   - Enable Speech-to-Text API

- **22+ premium templates** with unique designs and animations   - Create an API key

- **One-click generation** - from idea to website in under 5 seconds

2. **Gemini API Key** - For AI content generation

### 🎨 **Professional Design System**   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)

- **22+ Unique Templates** including:   - Create an API key

  - 🍰 Restaurant & Bakery designs

  - 💪 Fitness & Wellness studios3. **MongoDB Atlas** - For database storage

  - 📸 Photography portfolios   - Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

  - 🏢 Business & Corporate layouts   - Get your connection string

  - 🏛️ Real Estate showcases

  - ⚖️ Professional services (Law, Consulting)## 🛠️ Setup

  - 🚀 Tech & Startup designs

  - 🛍️ E-commerce & Shop templates1. **Clone and Install**

   ```bash

### 🔐 **Secure Authentication**   npm install

- Email/Password authentication with bcrypt encryption   ```

- Google OAuth integration

- JWT-based session management2. **Configure Environment Variables**

- Password change & account deletion features   

   Copy `.env.example` to `.env.local` and fill in your keys:

### 📊 **User Dashboard**   ```bash

- Personal feed of all generated websites   GEMINI_API_KEY=your_gemini_api_key_here

- Sites creation tracking & analytics   GOOGLE_CLOUD_API_KEY=your_google_cloud_api_key_here

- Quick access to published pages   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vaaniweb?retryWrites=true&w=majority

- Shareable unique URLs for each website   NEXT_PUBLIC_ROOT_URL=http://localhost:3000

   ```

### 🚀 **Intelligent AI Engine**

- **Groq AI Integration** - Lightning-fast LLM inference3. **Run Development Server**

- Smart business type detection (cafe, gym, salon, etc.)   ```bash

- Automatic color theme selection   npm run dev

- SEO-optimized content generation   ```

- Professional copywriting for taglines & descriptions

- Fallback analysis for 100% reliability4. **Open Browser**

   

---   Navigate to `http://localhost:3000`



## 🛠️ Tech Stack## 🎤 How to Use



### **Frontend**1. Click and **hold** the "Hold & Speak" button

- **Next.js 14** - React framework with App Router2. Describe your website in natural language:

- **TypeScript** - Type-safe development   

- **Tailwind CSS** - Utility-first styling   *Example: "Cake shop in Delhi, pink theme, three photos of cakes, Instagram handle cakedelhi, contact form with name email and message fields"*

- **Web Speech API** - Voice recording functionality

3. Release the button when done (or wait 12 seconds max)

### **Backend**4. VaaniWeb will:

- **Next.js API Routes** - Serverless backend   - Convert your speech to text

- **MongoDB Atlas** - Cloud database   - Generate a JSON structure with Gemini AI

- **JWT** - Secure authentication   - Create a beautiful HTML page with Tailwind CSS

- **Bcrypt** - Password encryption   - Store it in MongoDB

   - Open it in a new tab!

### **AI & APIs**

- **Groq AI** - Ultra-fast LLM (Llama 3.3 70B)## 📁 Project Structure

- **Pexels API** - Professional stock images

```

---VaaniWeb/

├── app/

## 🚀 Getting Started│   ├── api/

│   │   ├── generate/route.ts    # Main generation endpoint

### Prerequisites│   │   └── feed/route.ts        # Feed API endpoint

│   ├── feed/

- **Node.js** 18+ and npm│   │   └── page.tsx             # Feed page with all generated sites

- **MongoDB Atlas** account (free tier)│   ├── lib/

- **Groq API Key** (free at [console.groq.com](https://console.groq.com))│   │   ├── mongodb.ts           # MongoDB singleton connection

- **Google Cloud Console** (optional, for OAuth)│   │   └── html-generator.ts   # HTML template builder

│   ├── p/

### Installation│   │   └── [id]/route.ts        # Dynamic page route

│   ├── types/

1. **Clone the repository**│   │   └── index.ts             # TypeScript interfaces

   ```bash│   ├── globals.css              # Global styles

   git clone https://github.com/yourusername/vaaniweb.git│   ├── layout.tsx               # Root layout

   cd vaaniweb│   └── page.tsx                 # Landing page with mic button

   ```├── .env.local                   # Your environment variables

├── .env.example                 # Example env file

2. **Install dependencies**├── next.config.js               # Next.js configuration

   ```bash├── package.json                 # Dependencies

   npm install├── tailwind.config.js           # Tailwind configuration

   ```└── tsconfig.json                # TypeScript configuration

```

3. **Set up environment variables**

   ## 🚢 Deployment

   Copy `.env.example` to `.env.local`:

   ```bash### Deploy to Vercel

   cp .env.example .env.local

   ```1. Push your code to GitHub

   2. Import project in [Vercel](https://vercel.com)

   Fill in your credentials:3. Add environment variables in Vercel dashboard

   ```env4. Deploy!

   MONGODB_URI=mongodb+srv://...

   JWT_SECRET=your_secret_key_hereYour edge functions will stay fast and within free tier limits.

   GROQ_API_KEY=gsk_...

   NEXT_PUBLIC_ROOT_URL=http://localhost:3000## 💡 Example Prompts

   ```

- "Coffee shop in Brooklyn, brown theme, cozy interior photos, Instagram brooklyncoffee, contact form"

4. **Run the development server**- "Yoga studio, green theme, meditation photos, Instagram zenandyoga, booking form with name phone date"

   ```bash- "Pet grooming service, blue theme, cute dog pictures, Instagram pamperedpaws, contact form"

   npm run dev- "Wedding photographer, rose theme, beautiful wedding photos, Instagram loveandlens, inquiry form"

   ```

## 🔧 Technical Details

5. **Open your browser**

   - **Next.js 14** with App Router

   Navigate to [http://localhost:3000](http://localhost:3000)- **TypeScript** for type safety

- **Edge Runtime** for all API routes

---- **MongoDB** with singleton connection pattern

- **Tailwind CSS** for styling (via CDN in generated pages)

## 📦 Deployment- **No external storage** - everything in MongoDB

- **Optimized for Vercel Hobby tier**

### Deploy to Vercel (Frontend)

## 📊 Performance

1. **Push to GitHub**

   ```bash- Edge function execution: < 60 lines of code

   git push origin main- Cold start optimization: MongoDB singleton pattern

   ```- Lighthouse score: > 90 (lazy loaded images, minimal CSS)

- Speech-to-Text: Free for 60 minutes/month

2. **Import to Vercel**- Gemini 1.5 Flash: Generous free tier

   - Go to [vercel.com](https://vercel.com)- MongoDB Atlas: Free tier (512MB)

   - Import your repository

   - Add environment variables## 🤝 Contributing

   - Deploy!

Feel free to fork and improve! This is an MVP designed to be simple and effective.

3. **Add Environment Variables in Vercel Dashboard**

   - `MONGODB_URI`## 📝 License

   - `JWT_SECRET`

   - `GROQ_API_KEY`MIT

   - `NEXT_PUBLIC_ROOT_URL`

## 🎯 Roadmap

### Database Setup (MongoDB Atlas)

- [ ] Custom domain support

1. Create a free cluster at [mongodb.com](https://www.mongodb.com/cloud/atlas)- [ ] More templates and themes

2. Create a database user- [ ] Edit existing pages

3. Whitelist IP addresses (or allow all: `0.0.0.0/0`)- [ ] Analytics dashboard

4. Get your connection string- [ ] Share to social media

5. Add to `.env.local`- [ ] Export as static HTML



------



## 🎯 How It WorksBuilt with ❤️ using voice, AI, and the power of modern web tech.


```
┌─────────────┐
│   User      │
│  speaks/    │
│   types     │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Voice-to-Text  │
│   Recognition   │
└────────┬────────┘
         │
         ▼
┌──────────────────┐
│   Groq AI        │
│   Analyzes &     │
│   Generates      │
│   Content        │
└─────────┬────────┘
          │
          ▼
┌───────────────────┐
│  Template Engine  │
│  Selects Best     │
│  Design           │
└──────────┬────────┘
           │
           ▼
┌────────────────────┐
│  HTML Generator    │
│  Creates Website   │
└─────────┬──────────┘
          │
          ▼
┌───────────────────┐
│  MongoDB Storage  │
│  Saves & Serves   │
└───────────────────┘
```

---

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth login

### User Management
- `GET /api/user/me` - Get current user
- `PUT /api/user/update` - Update user profile
- `POST /api/user/change-password` - Change password
- `DELETE /api/user/delete` - Delete account

### Website Generation
- `POST /api/generate` - Generate website from description
- `GET /api/feed` - Get user's generated websites

### Public Access
- `GET /p/[id]` - View generated website

---

## 🔒 Security Features

- ✅ **Encrypted passwords** using bcrypt
- ✅ **JWT token authentication** with secure cookies
- ✅ **Environment variable protection** (.env.local in .gitignore)
- ✅ **MongoDB injection prevention**
- ✅ **XSS protection** with React's built-in sanitization
- ✅ **Password strength validation**
- ✅ **Rate limiting ready** (can be added)

---

## 🎨 Template Categories

| Category | Templates | Description |
|----------|-----------|-------------|
| **Cafes & Bakeries** | 5 | Warm, inviting designs with food imagery |
| **Fitness & Wellness** | 4 | Energetic layouts for gyms, yoga studios, spas |
| **Photography** | 3 | Portfolio-style with gallery focus |
| **Business & Corporate** | 3 | Professional, clean designs |
| **E-commerce** | 3 | Product-focused shop layouts |
| **Services** | 2 | Law firms, consulting, professional services |
| **Real Estate** | 1 | Property showcase with luxury feel |
| **Tech & Startups** | 1 | Modern, innovative designs |

---

## 🚀 Deployment

### Quick Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables
   - Deploy!

3. **Add Environment Variables** in Vercel Dashboard:
   - `GROQ_API_KEY`
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_ROOT_URL`

📚 **Detailed Guide**: See [DEPLOY_STEPS.md](./DEPLOY_STEPS.md) for complete instructions

⚡ **Quick Start**: See [QUICKSTART.md](./QUICKSTART.md) for 5-minute setup

✅ **Checklist**: Use [DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md) to verify everything

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | Yes | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for JWT tokens | Yes | `your_secret_key` |
| `GROQ_API_KEY` | Groq AI API key | Yes | `gsk_...` |
| `NEXT_PUBLIC_ROOT_URL` | Application URL | Yes | `http://localhost:3000` |
| `GOOGLE_CLIENT_ID` | Google OAuth ID | Optional | `...apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | Optional | `GOCSPX-...` |

---

## 🐛 Troubleshooting

### Voice recording not working?
- Ensure you're using HTTPS (or localhost)
- Grant microphone permissions in browser
- Check if browser supports Web Speech API

### AI generation fails?
- Verify GROQ_API_KEY is valid
- Check API rate limits
- System will fallback to static analysis automatically

### Database connection issues?
- Verify MongoDB URI format
- Check IP whitelist in MongoDB Atlas
- Ensure network connectivity

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Authors

**VaaniWeb Team**

- 🌐 Website: [vaaniweb.com](https://vaaniweb.com)
- 📧 Email: vaaniweb@gmail.com
- 🐦 Twitter: [@vaaniweb](https://twitter.com/vaaniweb)

---

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!

---

## 🔮 Roadmap

- [ ] Add more templates (target: 50+)
- [ ] Video tutorial integration
- [ ] Export to HTML/CSS files
- [ ] Custom domain support
- [ ] Analytics dashboard
- [ ] A/B testing for templates
- [ ] Mobile app (React Native)
- [ ] WordPress plugin integration

---

## 💰 For Investors

**VaaniWeb** is revolutionizing website creation by eliminating technical barriers:

### Market Opportunity
- **$40B+ global website builder market**
- **Millions of small businesses** need affordable web presence
- **Voice-first approach** taps into growing audio tech trend

### Competitive Advantages
- ⚡ **Speed**: 5 seconds vs 5 hours
- 💰 **Cost**: Free tier vs $200-500/month
- 🎤 **Innovation**: Voice-powered generation (unique in market)
- 🤖 **AI-First**: Groq's ultra-fast inference = superior UX

### Growth Metrics
- 22+ professionally designed templates
- 100% generation success rate (AI + fallback)
- Scalable serverless architecture
- Ready for B2B partnerships

### Revenue Model (Future)
- Freemium: 3 sites free, unlimited at $9/month
- White-label for agencies: $99/month
- Enterprise custom templates: $499/month
- API access for developers: Usage-based pricing

**Contact**: invest@vaaniweb.com

---

<div align="center">

**Built with ❤️ by VaaniWeb Team**

Made in India 🇮🇳 | Powered by AI 🤖 | Voice-First Innovation 🎤

[Website](https://vaaniweb.com) • [Documentation](https://docs.vaaniweb.com) • [Support](mailto:support@vaaniweb.com)

</div>
