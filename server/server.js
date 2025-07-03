const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const configurePassport = require('./config/passport');

// Load env vars first
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const startServer = async () => {
  try {
    console.log('Starting server initialization...');
    
    // Try to connect to database, but don't fail if it's not available
    console.log('Attempting database connection...');
    try {
      await connectDB();
      console.log('Database connection established.');
    } catch (dbError) {
      console.warn('Database connection failed, continuing without database features:', dbError.message);
      console.log('Font features will still work normally.');
    }

    // Load models only if database is connected
    if (mongoose.connection.readyState === 1) {
      require('./models/User');
      require('./models/FontMatch');
      console.log('Database models loaded.');
    } else {
      console.log('Skipping model loading - database not connected.');
    }

    // Import routes conditionally based on database connection
    let authRoutes, googleAuthRoutes, fontMatchRoutes;
    
    if (mongoose.connection.readyState === 1) {
      authRoutes = require('./routes/auth');
      googleAuthRoutes = require('./routes/auth/google-auth-routes');
      fontMatchRoutes = require('./routes/fontMatches');
      console.log('Database-dependent routes loaded.');
    } else {
      console.log('Skipping database-dependent routes.');
    }

    const app = express();

    // Body parser
    app.use(express.json());

    // Cookie parser
    app.use(cookieParser());

    // Enable CORS with more permissive settings for development
    app.use(cors({
      origin: function(origin, callback) {
        const allowedOrigins = [
          'http://localhost:5500',
          'http://127.0.0.1:5500',
          'http://localhost:3000',
          'http://localhost',
          'https://www.font-match-language.tech',
          'https://font-match-language.tech',
          'https://evyail.github.io/FonrMatchLanguage-FINAL/'
        ];
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
          const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With']
    }));

    // Express session for passport
    app.use(session({
      secret: process.env.SESSION_SECRET || 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax'
      }
    }));

    // Passport middleware - only if database is available
    if (mongoose.connection.readyState === 1) {
      app.use(passport.initialize());
      app.use(passport.session());
      
      // Initialize passport
      configurePassport();
      console.log('Passport authentication configured.');
    } else {
      console.log('Skipping Passport configuration - no database connection.');
    }

    // Serve static files from various directories
    app.use(express.static(path.join(__dirname, '..'))); // Root directory
    app.use('/js', express.static(path.join(__dirname, '..', 'js'))); // JS directory
    app.use('/css', express.static(path.join(__dirname, '..', 'css'))); // CSS directory
    app.use('/assets', express.static(path.join(__dirname, '..', 'assets'))); // Assets directory if exists

    // health check endpoint
    app.get('/api/v1/health', (req, res) => {
      res.json({ status: 'ok' });
    });

    // Routes - only mount database-dependent routes if DB is connected
    if (mongoose.connection.readyState === 1 && authRoutes && googleAuthRoutes && fontMatchRoutes) {
      app.use('/api/v1/auth', authRoutes);
      app.use('/api/v1/auth', googleAuthRoutes); // Add the new Google auth routes
      app.use('/api/v1/fontmatches', fontMatchRoutes);
      console.log('Database-dependent API routes mounted.');
    } else {
      console.log('Skipping database-dependent routes - running in font-only mode.');
      // Add a placeholder route to inform clients about missing features
      app.get('/api/v1/auth/*', (req, res) => {
        res.status(503).json({ error: 'Authentication features unavailable - database not connected' });
      });
      app.get('/api/v1/fontmatches/*', (req, res) => {
        res.status(503).json({ error: 'Font matching history unavailable - database not connected' });
      });
    }

    // Specific routes for HTML files
    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '..', 'index.html'));
    });

    app.get('/login', (req, res) => {
      res.sendFile(path.join(__dirname, '..', 'login.html'));
    });

    app.get('/dashboard', (req, res) => {
      res.sendFile(path.join(__dirname, '..', 'dashboard.html'));
    });

    // For any other non-API routes, serve index.html (client-side routing)
    app.get('*', (req, res) => {
      if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '..', 'index.html'));
      }
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Font Match Language API is running on port ${PORT}!`);
    });

  } catch (error) {
    console.error('Server initialization failed:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
