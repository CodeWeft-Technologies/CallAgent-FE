# AI Agent Frontend 

A modern, responsive web application for managing AI voice calling agents. Built with Next.js 14, React 18, and TypeScript, this dashboard provides real-time monitoring and management of leads, calls, and agent configurations.

## 🚀 Features

### Core Functionality
- **Real-time Dashboard**: Live monitoring of leads, calls, and conversion metrics
- **Lead Management**: Track and manage leads with detailed analytics
- **Call Monitoring**: Real-time call tracking with status and duration metrics
- **Agent Configuration**: Configure AI voice agents and calling parameters
- **Authentication System**: Secure login with session management

### Technical Features
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: Auto-refresh dashboard data every 30 seconds
- **Virtual Scrolling**: Optimized performance for large datasets
- **Debounced Search**: Efficient search functionality with debouncing
- **Pagination**: Smart pagination for better user experience
- **Toast Notifications**: User-friendly feedback system

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **State Management**: React Context API
- **Authentication**: Custom auth system with localStorage

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the root directory:
   ```env
    NEXT_PUBLIC_LEAD_API_URL=https://callagent-be-2.onrender.com
    NEXT_PUBLIC_CALL_API_URL=https://callagent-be-2.onrender.com
    NEXT_PUBLIC_SEQUENTIAL_CALLER_API_URL=https://callagent-be-2.onrender.com
    NEXT_PUBLIC_CONFIG_API_URL=https://callagent-be-2.onrender.com
    NEXT_PUBLIC_CONVERSATION_API_URL=https://callagent-be-2.onrender.com

   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### Dashboard
- View real-time metrics for leads and calls
- Monitor system status and performance
- Refresh data manually or wait for auto-refresh (30s intervals)

### Navigation
- **Dashboard**: Main overview with key metrics
- **Configuration**: Agent and system settings
- **Calls**: Detailed call history and analytics
- **Leads**: Lead management and tracking

### Features
- **Real-time Updates**: Dashboard automatically refreshes every 30 seconds
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Search & Filter**: Efficient data filtering with debounced search
- **Pagination**: Navigate through large datasets easily

## 🏗 Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── calls/             # Calls management page
│   ├── config/            # Configuration page
│   ├── leads/             # Leads management page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Dashboard page
├── components/            # Reusable React components
│   ├── AuthWrapper.tsx   # Authentication wrapper
│   ├── LoginForm.tsx     # Login form component
│   ├── MemoizedCallRow.tsx # Optimized call row component
│   ├── Navigation.tsx    # Navigation component
│   ├── Sidebar.tsx       # Sidebar navigation
│   └── VirtualList.tsx   # Virtual scrolling component
├── contexts/             # React Context providers
│   └── AuthContext.tsx   # Authentication context
├── hooks/                # Custom React hooks
│   ├── useDataCache.ts   # Data caching hook
│   ├── useDebounce.ts    # Debouncing hook
│   ├── useIST.ts         # Indian Standard Time hook
│   ├── usePagination.ts  # Pagination hook
│   └── useRenderTracker.ts # Render tracking hook
└── package.json          # Dependencies and scripts
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
# or
yarn build
```

### Start Production Server
```bash
npm start
# or
yarn start
```

### Environment Variables for Production
Ensure these environment variables are set in your production environment:
- `NEXT_PUBLIC_LEAD_API_URL`: Backend API URL for leads
- `NEXT_PUBLIC_CALL_API_URL`: Backend API URL for calls

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for styling
- Component-based architecture

## 📊 API Integration

The frontend integrates with a backend API for:
- **Leads Management**: CRUD operations for leads
- **Call Analytics**: Real-time call data and statistics
- **Agent Configuration**: AI agent settings and parameters

### API Endpoints
- `GET /api/leads/stats` - Lead statistics
- `GET /api/calls/stats` - Call statistics
- Additional endpoints for CRUD operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🆘 Support

For support and questions:
- Check the documentation
- Review existing issues
- Contact the development team

---

**Built with ❤️ using Next.js, React, and TypeScript** 
