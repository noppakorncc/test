import jwt from 'jsonwebtoken';

export function auth(req, res, next) {
    const header = req.headers['authorization'];

    if (!header) {
        return res.status(403).json({
            status: 'error',
            message: 'ไม่พบ token กรุณาเข้าสู่ระบบใหม่เเล้วลองอีกครั้ง',
            data: null
        });
    }

    const token = header.replace('Bearer ', '').trim();
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

    } catch (err) {
        return res.status(403).json({
            status: 'error',
            message: 'Invaild or toke expired',
            data: null
        });
    }
};