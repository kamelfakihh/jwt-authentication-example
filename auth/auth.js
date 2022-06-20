const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const {
 JWT_SECRET   
} = process.env

function generateToken(payload){
    return jwt.sign(payload, JWT_SECRET);
}

function authenticate(req, res, next){

    // const authHeader = req.headers["authorization"];
    // const token = authHeader && authHeader.split(" ")[1]
    const token = req.cookies.token;

    console.log(req.cookies)

    if(!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (error, payload) => {

        console.log(error)

        if(error) {
            return res.sendStatus(401);            
        }

        req.payload = payload;
        next();        
    })

}

module.exports = {
    generateToken,
    authenticate
}