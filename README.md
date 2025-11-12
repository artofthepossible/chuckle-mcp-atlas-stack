# 🎭 ContainerComedy Club 🐳

**Tagline:** Featuring MongoDB MCP, Mongo Atlas with local developer experience by MCP Gateway

A modern, interactive joke application that delivers container-themed humor with style! Built with React, Express, MongoDB, and Redis, featuring SNL-style sound effects and smooth animations.

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)

## ✨ Features

### 🎨 Visual Design
- ✅ Clean gray background (`bg-gray-100`)
- ✅ White header section with bold black title
- ✅ Large, bold typography (5xl-6xl heading, 2xl-3xl for setup/punchline)
- ✅ White joke card with rounded corners and shadow
- ✅ Simple blue button (`bg-blue-600`) with clean rectangular style
- ✅ Minimalist layout - no gradients, focused on readability

### 🎭 Interactive Features
- ✅ **SNL sound effects** - drum roll and rimshot audio
- ✅ **Progressive reveal** - 2-second pause before punchline
- ✅ **Drum roll animation** - spinning drum emoji during reveal
- ✅ **Fade-in animation** for punchline
- ✅ **Hover effects** on button (lift and scale)
- ✅ **Times displayed counter** - tracks joke popularity
- ✅ **Loading spinner** when fetching jokes

### 🏗️ Technical Stack
- **Frontend:** React 18 with modern hooks
- **Backend:** Express.js with async/await
- **Database:** MongoDB (docker-chuckles-dev database, jokes collection)
- **Cache:** Redis for performance optimization
- **Styling:** Tailwind CSS with custom animations
- **Containerization:** Docker & Docker Compose

## 🚀 Quick Start

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Git (for cloning the repository)

### Two Deployment Options

#### 🏠 Option 1: Local Development (Default)

Uses containerized MongoDB running locally.

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd chuckle-mcp-atlas-stack
```

2. **Start with local MongoDB**
```bash
docker compose up --build
```

3. **Access the application**
Open your browser: **http://localhost:3001**

The application will automatically:
- Start MongoDB locally and create the `docker-chuckles-dev` database
- Start Redis for caching
- Seed the database with 40+ container-themed jokes
- Build and serve the React frontend
- Launch the Express backend API

#### ☁️ Option 2: MongoDB Atlas + MCP Server

Uses cloud-hosted MongoDB Atlas with AI-assisted operations via MCP Server.

**Features:**
- ☁️ Cloud-hosted MongoDB (free tier available)
- 🤖 MongoDB MCP Server for AI-assisted DB operations
- 🎨 Mongo Express UI for database management
- ⚡ Same Redis caching layer

**Setup:** See [ATLAS_SETUP.md](./ATLAS_SETUP.md) for detailed instructions.

**Quick Start:**
```bash
# 1. Copy and configure Atlas environment
cp .env.atlas.template .env.atlas
# Edit .env.atlas with your MongoDB Atlas credentials

# 2. Start with Atlas
docker compose -f compose.atlas.mcp.yaml --env-file .env.atlas up --build

# 3. Access services
# - App: http://localhost:3001
# - Mongo Express: http://localhost:8081
```

### When to Use Each Option

| Feature | Local MongoDB | Atlas + MCP |
|---------|---------------|-------------|
| **Setup Time** | 30 seconds | 10 minutes |
| **Internet Required** | No | Yes |
| **Cost** | Free | Free tier available |
| **AI Operations** | No | Yes (MCP Server) |
| **Cloud Backups** | No | Yes (automatic) |
| **Admin UI** | Via CLI | Mongo Express + Atlas UI |
| **Best For** | Quick dev/testing | Production/collaboration |

## 📁 Project Structure

```
chuckle-mcp-atlas-stack/
├── db/
│   └── seed.js                 # MongoDB seed data with jokes
├── public/
│   ├── index.html             # HTML template
│   └── sounds/
│       ├── README.md          # Sound effects guide
│       ├── drumroll.mp3       # Drum roll sound (add your own)
│       └── rimshot.mp3        # Rimshot sound (add your own)
├── src/
│   ├── App.jsx                # Main React component
│   ├── index.jsx              # React entry point
│   ├── index.css              # Global styles & animations
│   └── server.js              # Express backend server
├── docker-compose.yml         # Docker orchestration
├── Dockerfile                 # Multi-stage Docker build
├── package.json               # Node.js dependencies
├── tailwind.config.js         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
└── .env                       # Environment variables
```

## 🎵 Sound Effects Setup

The app uses SNL-style sound effects. To add them:

1. Download free sound effects from:
   - [Freesound.org](https://freesound.org/)
   - [Zapsplat](https://www.zapsplat.com/)
   - [BBC Sound Effects](https://sound-effects.bbcrewind.co.uk/)

2. Search for:
   - "drum roll comedy"
   - "rimshot" or "ba dum tss"

3. Save them as:
   - `public/sounds/drumroll.mp3`
   - `public/sounds/rimshot.mp3`

4. Rebuild the Docker image:
```bash
docker compose down
docker compose up --build
```

## 🔧 API Endpoints

### Get Random Joke
```
GET /api/jokes/random
```
Returns a random joke and increments its display counter.

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "setup": "Why did the Docker container go to therapy?",
  "punchline": "It had too many layers to unpack!",
  "times_displayed": 42
}
```

### Get All Jokes
```
GET /api/jokes
```
Returns all jokes in the database.

### Get Joke by ID
```
GET /api/jokes/:id
```
Returns a specific joke by MongoDB ObjectId.

### Get Statistics
```
GET /api/stats
```
Returns joke statistics including total jokes, total displays, and top 5 jokes.

### Health Check
```
GET /health
```
Checks MongoDB and Redis connectivity.

## 🎨 User Experience Flow

1. **Page Load:** Clean interface loads with the app title and tagline
2. **Joke Fetch:** First joke loads automatically with a spinner
3. **Setup Display:** Joke setup appears in large, bold text
4. **Drum Roll:** After 0.5s, drum emoji spins with drum roll sound
5. **Punchline Reveal:** After 2s, punchline fades in with rimshot sound
6. **Display Counter:** Shows how many times this joke has been seen
7. **Next Joke:** User clicks button with hover effect to get another joke
8. **Repeat:** Cycle continues with smooth animations

## 🛠️ Development

### Run Locally (Without Docker)

1. **Install dependencies**
```bash
npm install
```

2. **Start MongoDB and Redis**
```bash
# Using Docker for services only
docker run -d -p 27017:27017 --name mongodb mongo:7.0
docker run -d -p 6379:6379 --name redis redis:7-alpine
```

3. **Set environment variables**
```bash
export MONGODB_URI=mongodb://localhost:27017/docker-chuckles-dev
export REDIS_HOST=localhost
export PORT=3001
```

4. **Seed the database**
```bash
npm run seed
```

5. **Build React app**
```bash
npm run build
```

6. **Start the server**
```bash
npm start
```

### Development Mode with Hot Reload
```bash
npm run dev
```

## 📊 MongoDB Schema

**Database:** `docker-chuckles-dev`  
**Collection:** `jokes`

```javascript
{
  _id: ObjectId,
  setup: String,        // The joke setup/question
  punchline: String,    // The joke punchline/answer
  times_displayed: Number  // Counter for popularity tracking
}
```

## 🐳 Docker Commands

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down

# Rebuild and start
docker compose up --build

# Remove volumes (reset database)
docker compose down -v
```

## 🌟 Key Technologies

| Technology | Purpose |
|------------|---------|
| **React 18** | Modern UI with hooks and concurrent features |
| **Express.js** | RESTful API backend |
| **MongoDB** | NoSQL database for joke storage |
| **Redis** | In-memory caching for performance |
| **Tailwind CSS** | Utility-first CSS framework |
| **Docker** | Containerization and orchestration |
| **Axios** | HTTP client for API requests |

## 🎯 Future Enhancements

- [ ] User authentication and favorites
- [ ] Joke rating system
- [ ] Category filtering
- [ ] Share jokes on social media
- [ ] Admin panel for joke management
- [ ] Integration with MongoDB Atlas
- [ ] MCP Gateway integration
- [ ] Dark mode toggle
- [ ] Mobile app version

## 📝 Environment Variables

```bash
# MongoDB Configuration
MONGODB_URI=mongodb://mongodb:27017/docker-chuckles-dev
MONGODB_HOST=mongodb
MONGODB_PORT=27017
MONGODB_DB=docker-chuckles-dev

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379

# Server Configuration
PORT=3001
NODE_ENV=production
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Original inspiration from [docker-chuckles](https://github.com/artofthepossible/docker-chuckles)
- Built with React and Docker
- Styled with Tailwind CSS
- Container-themed jokes for developer entertainment

---

**Made with ❤️, containers 🐳, and MongoDB 🍃**

*ContainerComedy Club - Where every joke is properly containerized for your enjoyment!*
