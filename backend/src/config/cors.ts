export const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    // Add your Vercel URL after deployment
    // Example: 'https://your-app.vercel.app',
    /\.vercel\.app$/ // Allow all Vercel preview deployments
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Made with Bob
