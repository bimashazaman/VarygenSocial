// Importing necessary modules
import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import helmet from 'helmet'

import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import postRoutes from './routes/posts.js'
import { register } from './controllers/auth.js'
import { createPost } from './controllers/posts.js'
import { verifyToken } from './middleware/auth.js'

//for fake data
// import User from './models/User.js'
// import Post from './models/Post.js'
// import { users, posts } from './data/index.js'

// CONFIGURATIONS

// Resolving the path of the current file for use in static file serving
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Initializing environment variables from .env file
dotenv.config()

// Creating an instance of express application
const app = express()

// Middlewares
// To parse JSON requests
app.use(express.json())

// For security, setting various HTTP headers
app.use(helmet())

// Setting a policy for resources loaded from different origins
app.use(
  helmet.crossOriginResourcePolicy({
    policy: 'cross-origin',
  })
)

// Logging HTTP requests
app.use(morgan('common'))

// Parsing incoming requests with JSON payloads
app.use(
  bodyParser.json({
    limit: '30mb',
    extended: true,
  })
)

// Parsing incoming requests with URL-encoded payloads
app.use(
  bodyParser.urlencoded({
    limit: '30mb',
    extended: true,
  })
)

// Enabling CORS for cross-origin requests
app.use(cors())

// Serving static files from the 'public/assets' directory
app.use('/assets', express.static(path.join(__dirname, 'public/assets')))

// FILE STORAGE

// Configuring multer for file storage
const storage = multer.diskStorage({
  // Setting destination for storing files
  destination: function (req, file, cb) {
    cb(null, 'public/assets')
  },
  // Configuring filenames of stored files
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})

// Initializing multer with the defined storage configuration
const upload = multer({
  storage,
})

// ROUTES
app.post('/auth/register', upload.single('picture'), register)

app.post('/posts', verifyToken, upload.single('picture'), createPost)

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/posts', postRoutes)

//DATABASE SETUP

// Setting the port number for the server to listen on
const PORT = process.env.PORT || 6001

// Connecting to MongoDB using the connection string from the environment variables
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    // Starting the server on successful database connection
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`))
    // User.insertMany(users)
    // Post.insertMany(posts)
  })
  .catch((error) => console.log(`${error} did not connect`))
