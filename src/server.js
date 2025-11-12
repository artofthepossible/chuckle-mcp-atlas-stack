import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { MongoClient, ObjectId } from 'mongodb';
import Redis from 'ioredis';
import cors from 'cors';
import dotenv from 'dotenv';
import seedDatabase from '../db/seed.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// Configuration - Environment Variables
// ============================================
const CONFIG = {
  // Server Configuration
  PORT: parseInt(process.env.PORT || '3001'),
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // MongoDB Configuration
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://mongodb:27017/docker-chuckles-dev',
  MONGODB_DATABASE: process.env.MONGODB_DATABASE || process.env.MONGODB_DB || 'docker-chuckles-dev',
  MONGODB_COLLECTION: process.env.MONGODB_COLLECTION || 'jokes',
  
  // Alternative MongoDB connection parameters (for local setup)
  MONGODB_HOST: process.env.MONGODB_HOST || 'mongodb',
  MONGODB_PORT: parseInt(process.env.MONGODB_PORT || '27017'),
  
  // Redis Configuration
  REDIS_HOST: process.env.REDIS_HOST || 'redis',
  REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379'),
  REDIS_CACHE_TTL: parseInt(process.env.REDIS_CACHE_TTL || '300'), // 5 minutes default
  
  // Application Features
  AUTO_SEED: process.env.AUTO_SEED !== 'false', // true by default, set to 'false' to disable
  
  // AWS Configuration (for Atlas)
  AWS_REGION: process.env.AWS_REGION || 'us-east-2',
};

// Detect deployment mode (Atlas vs Local)
const isAtlasDeployment = CONFIG.MONGODB_URI.includes('mongodb+srv://');
const isProduction = CONFIG.NODE_ENV === 'production';

const app = express();
const PORT = CONFIG.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Debug: Check build directory
const buildPath = path.join(__dirname, '../build');
console.log('Checking build directory:', buildPath);
if (fs.existsSync(buildPath)) {
  console.log('Build directory contents:', fs.readdirSync(buildPath));
} else {
  console.error('Build directory does not exist!');
}

// ============================================
// Redis Client Configuration
// ============================================
const redis = new Redis({
  host: CONFIG.REDIS_HOST,
  port: CONFIG.REDIS_PORT,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 5,
  lazyConnect: false,
  enableOfflineQueue: true,
  reconnectOnError: (err) => {
    const targetError = 'READONLY';
    if (err.message.includes(targetError)) {
      // Reconnect on READONLY errors
      return true;
    }
    return false;
  }
});

redis.on('error', (error) => {
  console.error('❌ Redis connection error:', error.message);
});

redis.on('connect', () => {
  console.log(`✅ Redis connected: ${CONFIG.REDIS_HOST}:${CONFIG.REDIS_PORT}`);
});

redis.on('ready', () => {
  console.log('⚡ Redis ready to accept commands');
});

// ============================================
// MongoDB Client Configuration
// ============================================
let mongoClient;
let db;

/**
 * Connect to MongoDB (supports both local and Atlas)
 * Uses environment variables from CONFIG
 */
async function connectToMongoDB() {
  try {
    const uri = CONFIG.MONGODB_URI;
    const dbName = CONFIG.MONGODB_DATABASE;
    
    // MongoDB client options for better reliability
    const clientOptions = {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
      retryWrites: true,
      retryReads: true,
    };
    
    // Add Atlas-specific options
    if (isAtlasDeployment) {
      clientOptions.tls = true;
      clientOptions.tlsAllowInvalidCertificates = false;
    }
    
    console.log(`🔌 Connecting to MongoDB...`);
    console.log(`   Deployment: ${isAtlasDeployment ? '☁️  Atlas (Cloud)' : '🏠 Local Container'}`);
    console.log(`   Database: ${dbName}`);
    
    mongoClient = new MongoClient(uri, clientOptions);
    await mongoClient.connect();
    
    // Verify connection
    await mongoClient.db('admin').command({ ping: 1 });
    
    db = mongoClient.db(dbName);
    
    // Log successful connection (mask credentials)
    const maskedUri = uri.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:****@');
    console.log(`✅ MongoDB connected successfully`);
    console.log(`   URI: ${maskedUri}`);
    console.log(`   Database: ${dbName}`);
    console.log(`   Collection: ${CONFIG.MONGODB_COLLECTION}`);
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    if (error.cause) {
      console.error('   Cause:', error.cause.message);
    }
    console.error('\n💡 Troubleshooting:');
    if (isAtlasDeployment) {
      console.error('   • Check your MongoDB Atlas connection string in .env.atlas');
      console.error('   • Verify your IP is whitelisted in Atlas Network Access');
      console.error('   • Ensure database user credentials are correct');
      console.error('   • Confirm cluster is not paused in Atlas');
    } else {
      console.error('   • Ensure MongoDB container is running: docker ps');
      console.error('   • Check MONGODB_URI environment variable');
      console.error('   • Verify network connectivity between containers');
    }
    return false;
  }
}

// Serve static files from the React app
app.use(express.static(buildPath));

// API endpoints
app.get('/health', async (req, res) => {
  try {
    await redis.ping();
    await db.command({ ping: 1 });
    res.status(200).json({ 
      status: 'healthy',
      mongodb: 'connected',
      redis: 'connected' 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'unhealthy',
      error: error.message 
    });
  }
});

// Get random joke endpoint
app.get('/api/jokes/random', async (req, res) => {
  try {
    const jokesCollection = db.collection(CONFIG.MONGODB_COLLECTION);
    
    // Get random joke using MongoDB aggregation
    const randomJokes = await jokesCollection.aggregate([
      { $sample: { size: 1 } }
    ]).toArray();
    
    if (randomJokes.length > 0) {
      const joke = randomJokes[0];
      
      // Update times_displayed counter
      await jokesCollection.updateOne(
        { _id: joke._id },
        { $inc: { times_displayed: 1 } }
      );
      
      // Cache the joke in Redis with configured TTL
      await redis.setex(
        `joke:${joke._id.toString()}`,
        CONFIG.REDIS_CACHE_TTL,
        JSON.stringify(joke)
      );
      
      res.json({
        id: joke._id,
        setup: joke.setup,
        punchline: joke.punchline,
        times_displayed: joke.times_displayed + 1
      });
    } else {
      res.status(404).json({ error: 'No jokes found' });
    }
  } catch (error) {
    console.error('Error fetching joke:', error);
    res.status(500).json({ error: 'Server error fetching joke' });
  }
});

// Get joke by ID
app.get('/api/jokes/:id', async (req, res) => {
  try {
    const jokesCollection = db.collection(CONFIG.MONGODB_COLLECTION);
    const joke = await jokesCollection.findOne({ _id: new ObjectId(req.params.id) });
    
    if (joke) {
      res.json(joke);
    } else {
      res.status(404).json({ error: 'Joke not found' });
    }
  } catch (error) {
    console.error('Error fetching joke:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all jokes (for admin/debug purposes)
app.get('/api/jokes', async (req, res) => {
  try {
    const jokesCollection = db.collection(CONFIG.MONGODB_COLLECTION);
    const jokes = await jokesCollection.find({}).toArray();
    res.json(jokes);
  } catch (error) {
    console.error('Error fetching jokes:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get joke statistics
app.get('/api/stats', async (req, res) => {
  try {
    const jokesCollection = db.collection(CONFIG.MONGODB_COLLECTION);
    const totalJokes = await jokesCollection.countDocuments();
    const totalDisplays = await jokesCollection.aggregate([
      { $group: { _id: null, total: { $sum: '$times_displayed' } } }
    ]).toArray();
    
    const topJokes = await jokesCollection.find({})
      .sort({ times_displayed: -1 })
      .limit(5)
      .toArray();
    
    res.json({
      totalJokes,
      totalDisplays: totalDisplays[0]?.total || 0,
      topJokes
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  const indexPath = path.join(buildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    console.error('index.html not found at:', indexPath);
    res.status(404).send('Build files not found. Please ensure the React app is built properly.');
  }
});

// ============================================
// Service Initialization
// ============================================
const initializeServices = async () => {
  console.log('\n🎭 ========================================');
  console.log('   ContainerComedy Club');
  console.log('   Initialization Starting...');
  console.log('========================================== 🐳\n');
  
  try {
    // Connect to MongoDB
    const mongoConnected = await connectToMongoDB();
    if (!mongoConnected) {
      throw new Error('Failed to connect to MongoDB');
    }
    
    // Wait for Redis
    await redis.ping();
    console.log(`✅ Redis ready for caching (TTL: ${CONFIG.REDIS_CACHE_TTL}s)`);
    
    // Seed database (if AUTO_SEED is enabled)
    if (CONFIG.AUTO_SEED) {
      console.log('\n🌱 Auto-seeding database...');
      await seedDatabase();
      console.log('✅ Database seeded successfully');
    } else {
      console.log('\n⏭️  Skipping auto-seed (AUTO_SEED=false)');
    }
    
    // Start server
    app.listen(PORT, () => {
      console.log('\n🎭 ========================================');
      console.log('   ContainerComedy Club - READY! 🎉');
      console.log('========================================== 🐳\n');
      console.log(`🌐 Application: http://localhost:${PORT}`);
      console.log(`� Health Check: http://localhost:${PORT}/health`);
      console.log(`📊 Statistics: http://localhost:${PORT}/api/stats`);
      console.log(`\n📦 Deployment Mode: ${isAtlasDeployment ? '☁️  Atlas (Cloud)' : '🏠 Local'}`);
      console.log(`🔧 Environment: ${CONFIG.NODE_ENV}`);
      console.log(`\n💾 Database Configuration:`);
      console.log(`   Database: ${CONFIG.MONGODB_DATABASE}`);
      console.log(`   Collection: ${CONFIG.MONGODB_COLLECTION}`);
      console.log(`   Auto-seed: ${CONFIG.AUTO_SEED ? 'Enabled' : 'Disabled'}`);
      console.log(`\n⚡ Cache Configuration:`);
      console.log(`   Redis: ${CONFIG.REDIS_HOST}:${CONFIG.REDIS_PORT}`);
      console.log(`   TTL: ${CONFIG.REDIS_CACHE_TTL} seconds`);
      
      if (isAtlasDeployment) {
        console.log(`\n☁️  Atlas Features:`);
        console.log(`   Region: ${CONFIG.AWS_REGION}`);
        console.log(`   🤖 MCP Server: Available for AI operations`);
      }
      
      console.log('\n✨ Ready to serve jokes! 😄\n');
    });
  } catch (error) {
    console.error('\n❌ ========================================');
    console.error('   Initialization Failed!');
    console.error('========================================== ❌\n');
    console.error('Error:', error.message);
    if (error.stack) {
      console.error('\nStack trace:', error.stack);
    }
    console.error('\n💡 Check the logs above for troubleshooting tips.');
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  if (mongoClient) {
    await mongoClient.close();
  }
  if (redis) {
    redis.disconnect();
  }
  process.exit(0);
});

initializeServices();
