# 🎭 ContainerComedy Club 🐳

**Tagline:** Featuring MongoDB MCP, Mongo Atlas with local developer experience by MCP Gateway

A modern, interactive joke application that delivers container-themed humor with style! Built with React, Express, MongoDB, and Redis, featuring SNL-style sound effects and smooth animations.

## 🚀 Quick Start

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Git (for cloning the repository)
- docker mcp gateway run

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
- 🎨 Mongo  UI for database management
- ⚡ Same Redis caching layer


**Quick Start:**
```bash
# 1. Copy and configure Atlas environment
cp .env.atlas.template .env.atlas
# Edit .env.atlas with your MongoDB Atlas credentials

# 2. Start with Atlas
docker compose -f compose.atlas.mcp.yaml --env-file .env.atlas up --build

# 3. Access services
# - App: http://localhost:3001
```


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


4. Rebuild the Docker image:
```bash
docker compose down
docker compose up --build
```



## 🛠️ Development


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
