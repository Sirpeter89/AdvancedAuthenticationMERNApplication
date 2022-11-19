import User from '../models/User.js'
import dotenv from 'dotenv'
import { json } from 'express'

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

async function login(req, res, next) {
    const { email, password } = req.body

    if (!email || !password) {
        res.status(400).json({ success: false, error: 'Please provide an email and password' })
    }

    try {
        //grabs user document, then populates password
        const user = await User.findOne({ email }).select('+password')

        if (!user) {
            res.status(404).json({ success: false, error: 'Invalid credentials' })
        }

        //runs the schema method we created, then compares the passwords
        const isMatch = await user.matchPasswords(password)

        if (!isMatch) {
            res.status(404).json({ success: false, error: 'Invalid credentials' })
        }

        res.status(200).json({
            success: true,
            token: 'twt2asfasf2323a',
        })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}

function forgotpassword(req, res, next) {
    res.send('Forgot Password Route')
}

function resetpassword(req, res, next) {
    res.send('Reset Password Route')
}

export { register, login, forgotpassword, resetpassword }
