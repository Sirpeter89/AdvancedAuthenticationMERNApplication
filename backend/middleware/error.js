import ErrorResponse from '../utils/errorResponse.js'

const errorHandler = (err, req, res, next) => {
    let error = { ...err }

    error.message = err.message

    // console.log(err)

    //in mongoose this means duplicate error key
    if (err.code === 11000) {
        const message = 'Duplicate Field Value Enter'
        error = new ErrorResponse(message, 400)
    }

    //get an array of messages from err.errors which is object of nested objects
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message)
        error = new ErrorResponse(message, 400)
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error',
    })
}

export default errorHandler
