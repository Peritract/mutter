/* Verifies authentication tokens */

const jwt = require("jsonwebtoken");

function verifyToken (req, res, next) {

    let token = req.headers["authorization"];

    if (token){

        token = token.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
        
            if (err){
                res.status(403).json({
                    success: false,
                    error: 'Invalid or expired token' });
            } else {
                console.log("Token verified")
                next();
            }
        });
    } else {
        res.status(403).json({
            success: false,
            error: 'Missing token' });
    }
}


module.exports = verifyToken;