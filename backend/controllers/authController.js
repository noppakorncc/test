import db from '../config/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function register(req, res) {
    const { username, password, full_name, department } = req.body;

    if (!username || !password || !full_name || !department) {
        return res.status(400).json({
            status: 'error',
            message: 'ป้อนข้อมูลให้ครบ',
            data: null
        });
    }

    let conn;

    try {

        conn = await db.getConnection();
        await conn.beginTransaction();

        const passwordHash = await bcrypt.hash(password, 10);
        const [userResult] = await db.execute(
            'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
            [username, passwordHash, 'assessee']
        );

        await conn.execute(
            'INSERT INTO teachers (user_id, full_name, department) VALUES (?, ?, ?)',
            [userResult.insertId, full_name, department]
        );

        await conn.commit();

        return res.status(200).json({
            status: 'success',
            message: 'สมัครสมาชิกสำเร็จ',
            data: {
                users: {
                    id: userResult.insertId,
                    username: username,
                    role: 'assessee'
                },
                teachers: {
                    user_id: userResult.insertId,
                    full_name: full_name,
                    department: department
                }
            }
        });

    } catch (err) {
        console.error('Register Error: ', err.code || err.message);

        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                status: 'error',
                message: 'User already exists',
                data: null
            });
        }

        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            data: null
        });
    }
};

export async function login(req, res) {
    const { username, password } = req.body;

    if (!username || !password ) {
        return res.status(400).json({
            status: 'error',
            message: 'กรอกข้อมูลให้ครบ',
            data: null
        });
    }

    
    try {
        const [rows] = await db.execute(
            'SELECT id, username, password_hash, role FROM users WHERE username = ?',
            [username]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                status: 'error',
                message: 'ชื่อผู้ใช้หรือรหัสผ่านผิด',
                data: null
            });
        }

        const user = rows[0];
        const isValid = bcrypt.compare(password, user.password_hash);

        if (!isValid) {
            return res.status(401).json({
                status: 'error',
                message: 'ชื่อผู้ใชหรือรหัสผ่านผิด',
                data: null
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                user: user.username,
                role: user.role
            }, process.env.JWT_SECRET, { expiresIn: '24h'}
        );

        return res.status(200).json({
            status: 'success',
            message: 'เข้าสู่ระบบสำเร็จ',
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role
                },
                jwt_token: {
                    token: token
                }
            }
        });
    } catch (err) {
        console.log('Login Error: ', err.code || err.message);

        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            data: null
        });
    }
};

export async function getMe(req, res) {
    try {
        const [rows] = await db.execute(
            `
            SELECT t.id, t.user_id, u.username, t.full_name, t.department, u.role
            FROM teachers t
            LEFT JOIN users u ON t.user_id = u.id
            WHERE u.id = ?
            `,
            [req.user.id]
        )

        return res.status(200).json({
            status: 'success',
            message: 'ดึงข้อมูลผู้ใช้สำเร็จ',
            data: {
                user: rows[0]
            }
        });
    } catch (err) {
        console.error('getMe Error: ', err.code || err.message);
        
        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            data: null
        });
    }
};