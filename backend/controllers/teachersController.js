import db from '../config/db.js';

export async function getTeachers(req, res) {
    try {
        const [rows] = await db.execute(
            `
            SELECT t.id, t.user_id, u.username, t.full_name, t.department, u.role
            FROM teachers t
            JOIN users u ON t.user_id = u.id
            `
        )

        return res.status(200).json({
            status: 'success',
            message: 'ดึงข้อมูลบุคลากรสำเร็จ',
            data: {
                teachers: rows
            }
        });
    } catch (err) {
        console.error('getTeachers Error: ', err.code || err.message);

        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            data: null
        });
    }
};


export async function updateTeacher(req, res) {
    const { id } = req.params
    const { full_name, department } = req.body;

    try {
        const [rows] = await db.execute(
            'SELECT user_id, full_name, department FROM teachers WHERE user_id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'ไม่พบบุคลากร',
                data: null
            });
        }

        await db.execute(
            'UPDATE teachers SET full_name = ?, department = ? WHERE user_id = ?',
            [full_name, department, id]
        )

        return res.status(200).json({
            status: 'success',
            message: 'อัพเดตข้อมูลบุคลากรสำเร็จ',
            data: {
                teacher: {
                    user_id: Number(id),
                    full_name: full_name,
                    department: department
                }
            }
        });
    } catch (err) {
        console.error('updateTeacher Error: ', err.code || err.message);

        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            data: null
        });
    }
};


export async function deleteTeacher(req, res) {
    const { id } = req.params;

    try {
        const [result] = await db.execute(
            'DELETE FROM teachers WHERE user_id = ?',
            [id]
        );

        return res.status(200).json({
            status: 'success',
            message: 'ลบข้อมูลบุคลากรสำเร็จ',
            data: null
        });
    } catch (err) {
        console.error('deleteTeacher Error: ', err.code || err.message);

        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            data: null
        });
    }
};