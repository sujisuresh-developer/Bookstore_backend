const jwt = require("jsonwebtoken")

const jwtMiddleware = (req, res, next) =>{
    console.log("Inside Jwt Middleware");
    const token = req.headers.authorization.split(" ")[1]  //ssplit use with 1 space and using verify method for verifying the token jwt have 3 parameters req,res and next when we dont call next() it cant work first index token
    console.log(token);

    try{
        const jwtResponse = jwt.verify(token, process.env.JWTSecretKey)
        console.log(jwtResponse);
        req.payload = jwtResponse.userMail   //token is generating from jwttoken here we assign usermail into req.payload
        next()
        
    }catch (err){
        res.status(401).json("invalid Tokens" ,err)
    }
    
    
}

module.exports = jwtMiddleware