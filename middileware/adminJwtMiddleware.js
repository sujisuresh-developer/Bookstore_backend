const jwt = require("jsonwebtoken");

//checking the clint send email is valid
const adminJwtMiddleware = (req, res, next) => {
    console.log("Inside Admin Jwt Middleware");

 

    const token = req.headers.authorization.split(" ")[1];
    console.log("Token:", token);

    try {
        const jwtResponse = jwt.verify(token, process.env.JWTSecretKey);
        console.log("jwtResponse:", jwtResponse);

        req.payload = jwtResponse.userMail;
        req.role = jwtResponse.role;

        // Checking admin role
        if (jwtResponse.role === "admin") {
            next();
        } else {
            return res.status(401).json("Unauthorized User",err);
        }

    } catch (err) {
        return res.status(401).json("Invalid Token",err);
    }
}

module.exports = adminJwtMiddleware;