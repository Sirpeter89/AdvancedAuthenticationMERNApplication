import User from '../models/User.js'
import dotenv from 'dotenv'
import ErrorResponse from '../utils/errorResponse.js'
import sendEmail from '../utils/sendEmail.js'

dotenv.config()

async function register(req, res, next) {
    const { username, email, password } = req.body

    try {
        const user = await User.create({
            username,
            email,
            password,
        })

        // res.status(201).json({
        //     success: true,
        //     // user: user,
        //     token: "235iu235bkjs"
        // })

        sendToken(user, 201, res)
    } catch (error) {
        // res.status(500).json({
        //     success: false,
        //     error: error.message,
        // })
        //Since we added an error handler middleware we can do this instead now
        next(error)
    }
}

async function login(req, res, next) {
    const { email, password } = req.body

    if (!email || !password) {
        // res.status(400).json({ success: false, error: 'Please provide an email and password' })
        // Again we want to use our newly created ErrorHandler
        return next(new ErrorResponse('Please provide an email and password', 400))
    }

    try {
        //grabs user document, then populates password
        const user = await User.findOne({ email }).select('+password')

        if (!user) {
            // res.status(404).json({ success: false, error: 'Invalid credentials' })
            return next(new ErrorResponse('Invalid credentials', 401))
        }

        //runs the schema method we created, then compares the passwords
        const isMatch = await user.matchPasswords(password)

        if (!isMatch) {
            // res.status(404).json({ success: false, error: 'Invalid credentials' })
            return next(new ErrorResponse('Invalid credentials', 401))
        }

        // res.status(200).json({
        //     success: true,
        //     token: 'twt2asfasf2323a',
        // })
        sendToken(user, 201, res)
    } catch (error) {
        // res.status(500).json({ success: false, error: error.message })
        next(error)
    }
}

async function forgotpassword(req, res, next) {
    const { email } = req.body

    try {
        const user = await User.findOne({ email })

        if (!user) {
            return next(new ErrorResponse('Email could not be send', 404))
        }

        const resetToken = user.getResetPasswordToken()

        await user.save()

        const resetUrl = `${process.env.FRONT_END_DOMAIN}/passwordreset/${resetToken}`

        //clicktracking is to make it so that sendgrid emailer doesn't add a weird looking link to the a tag
        const message = `
            <h1>You have requested a password reset</h1>
            <p>Please go to this link to reset your password</p>
            <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        `

        try {
            await sendEmail({
                to: user.email,
                subject: 'Password Reset Request',
                text: message,
            })

            res.status(200).json({ success: true, data: 'Email Sent' })
        } catch (error) {
            user.resetPasswordToken = undefined
            user.resetPasswordExpire = undefined

            await user.save()

            return next(new ErrorResponse('Email could not be sent', 500))
        }
    } catch (error) {
        next(error)
    }
}

function resetpassword(req, res, next) {
    res.send('Reset Password Route')
}

//we need user for email and id
const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken()
    res.status(statusCode).json({ success: true, token })
}

export { register, login, forgotpassword, resetpassword }
