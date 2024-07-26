import jwt from "jsonwebtoken";

async function authToken(req, res, next) {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(400).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    message: "Invalid token",
                    error: true,
                    success: false
                });
            }

            req.userId = decoded._id;
            next();
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
}

export default authToken;
