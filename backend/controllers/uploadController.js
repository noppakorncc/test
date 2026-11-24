import db from '../config/db.js';

export async function uploadFile(req, res) {
    try {
        if (!req.file) {
            return res.status(404).json({
                status: 'error',
                message: 'Select the file',
                data: null
            });
        }

        const { originalname, mimetype, size, buffer } = req.file;
        const [result] = await db.execute(
            'INSERT INTO evidence_files (user_id, file_name, mime_type, file_size, file_data) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, originalname, mimetype, size, buffer]
        );

        return res.status(201).json({
            status: 'success',
            message: 'อัพโหลดไฟล์สำเร็จ',
            data: {
                file: {
                    user_id: result.insertId,
                    file_name: originalname,
                    mime_type: mimetype,
                    file_size: size
                }
            }
        })

    } catch (err) {
        console.error('uploadFile Error: ', err.code || err.message);

        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            data: null
        });
    }
};