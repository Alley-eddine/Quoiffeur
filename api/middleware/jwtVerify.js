import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const jwtVerify = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader) {
        return res.status(401).send("Authorization header is missing");
    }
    const tokenParts = authHeader.split(' ');
    if(tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(401).send('Malformed authorization header'); 
    }
    const tokenValue = tokenParts[1];
    const secretKey = process.env.SECRET_KEY;
    jwt.verify(tokenValue, secretKey, (err, decoded) => {
        if(err) {
            return res.status(403).send(`Token verification failed: ${err.message}`);
        }
        next();
    })
}

export default jwtVerify;