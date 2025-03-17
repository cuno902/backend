import jwt from 'jsonwebtoken';

export const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Không có hoặc không đúng định dạng token" });
    }

    const token = authHeader.split(" ")[1];
    

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token không hợp lệ" });
    }
};
