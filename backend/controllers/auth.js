function register(req, res, next){
    res.send("Register Route")
}

function login(req, res, next){
    res.send("Login Route")
}

function forgotpassword(req, res, next){
    res.send("Forgot Password Route")
}

function resetpassword(req, res, next){
    res.send("Reset Password Route")
}

export {register, login, forgotpassword, resetpassword}
