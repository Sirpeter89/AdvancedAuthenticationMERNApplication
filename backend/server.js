import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import router from '../backend/routes/auth.js'
import connectDB from './config/db.js'

//Connect DB
connectDB()

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', router)

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

process.on('unhandledRejection', (err, promise) => {
    console.log(`Logged Error: ${err}`)
    server.close(() => process.exit(1))
})
