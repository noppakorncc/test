import db from '../config/db.js';

export async function getRounds(req, res) {
    try {
        const [rows] = await db.execute(
            'SELECT id, title, start_date, end_date, is_open FROM evaluation_rounds WHERE id = ?',
            [req.params.id]
        );

        return res.status(200).json({
            status: 'success',
            message: 'ดึงรอบประเมิณสำเร็จ',
            data: {
                rounds: rows
            }
        });
    } catch (err) {
        console.error('gerRounds Error: ', err.code || err.message);

        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            data: null
        });
    }
};



export async function createRounds(req, res) {
    const { title, start_date, end_date } = req.body;

    if (!title || !start_date || !end_date) {
        return res.status(400).json({
            status: 'error',
            message: 'กรอกข้อมูลให้ครบ',
            data: null
        });
    }

    if (start_date < end_date) {
        return res.status(400).json({
            status: 'error',
            message: 'start_date ไม่ควรน้อยกว่า end_date',
            data: null
        });
    }

    try {
        const [result] = await db.execute(
            'INSERT INTO evaluation_rounds (title, start_date, end_date, is_open) VALUES (?, ?, ?, 0)',
            [title, start_date, end_date]
        );

        return res.status(201).json({
            status: 'success',
            message: 'สร้างรอบประเมิณสำเร็จ',
            data: {
                round: {
                    title: title,
                    start_date: start_date,
                    end_date: end_date,
                    is_open: 0
                }
            }
        });
        
    } catch (err) {
        console.log('createRounds Error: ', err.code || err.message);

        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            data: null
        });
    }
};


export async function deleteRound(req, res) {
    const { id } = req.params;

    try {

        const [result] = await db.execute(
            'DELETE FROM evaluation_rounds WHERE id = ?',
            [id]
        )

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'ไม่พบรอบประเมิณ',
                data: null
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'ลบรอบประเมิณสำเร็จ',
            data: null
        });

    } catch (err) {
        console.error('deleteRound Error: ', err.code || err.message);

        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            data: null
        });
    }
};