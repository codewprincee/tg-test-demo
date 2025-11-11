# TouchBase IO - Frontend

Next.js frontend application for the TouchBase IO customer success platform.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and configure the backend API URL:

```bash
cp .env.example .env
```

The `.env` file should contain:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Start Development Server

```bash
npm run dev
```

The application will run on `http://localhost:3000`

## 📦 Tech Stack

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Radix UI** - Accessible components
- **Lucide React** - Icons

## 🏗️ Project Structure

```
frontend/
├── app/                  # Next.js app router pages
│   ├── page.tsx         # Chat page
│   ├── analytics/       # Analytics dashboard
│   └── settings/        # Settings page
├── components/          # Reusable components
│   ├── ui/             # UI components
│   ├── sidebar.tsx     # Navigation sidebar
│   └── ...
├── lib/                # Utilities and helpers
│   ├── api-client.ts   # Backend API client
│   ├── demo-data.ts    # Mock data
│   └── ...
└── public/             # Static assets
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🔌 Backend Integration

The frontend communicates with the Express backend server running on port 3001.

Make sure the backend server is running before starting the frontend:

```bash
# In backend folder
cd ../backend
npm run dev

# In frontend folder
cd ../frontend
npm run dev
```

## 📱 Features

- **AI Chat** - Conversational AI interface with streaming responses
- **Dynamic Visualizations** - Auto-generated charts from AI responses
- **Analytics Dashboard** - Customer success metrics and insights
- **Settings** - User preferences and configuration
- **Responsive Design** - Works on desktop and mobile

## 🎨 Customization

- Modify theme colors in `tailwind.config.ts`
- Add new components in `components/`
- Configure app settings in `next.config.mjs`

## 📝 Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:3001)

## 🚀 Production Build

```bash
npm run build
npm start
```

## 📄 License

Private project
