import User from '../models/User.js'
import dotenv from 'dotenv'

dotenv.config()

async function register(req, res, next) {
    const { username, email, password } = req.body

    try {
        const user = await User.create({
            username,
            email,
            password,
        })

        res.status(201).json({
            success: true,
            user: user,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        })
    }
}

function login(req, res, next) {
    res.send('Login Route')
}

function forgotpassword(req, res, next) {
    res.send('Forgot Password Route')
}

function resetpassword(req, res, next) {
    res.send('Reset Password Route')
}

export { register, login, forgotpassword, resetpassword }
