import dotenv from "dotenv"
import express from "express"
// import mongodb from "mongodb"
import cors from "cors"

dotenv.config()
// const MongoClient = mongodb.MongoClient

const app = express();
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))
