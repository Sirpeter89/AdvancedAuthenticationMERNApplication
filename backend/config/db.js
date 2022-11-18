import mongoose from 'mongoose'

const connectDB = async function () {
    mongoose.connect(process.env.USER_AUTH_DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    console.log('MongoDB Atlas connected')
}

export default connectDB
