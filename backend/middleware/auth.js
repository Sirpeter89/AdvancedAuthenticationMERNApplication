import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import ErrorResponse from '../utils/errorResponse.js'

export async function protect(req, res, next) {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        //example of what the token will look like:Bearer fnasfasfjlkjaslk
        token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401))
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decoded.id)

        if (!user) {
            return next(new ErrorResponse('No user found with this id', 404))
        }

        req.user = user
        next()
    } catch (error) {
        return next(new ErrorResponse('Not authorized to access this route', 401))
    }
}
