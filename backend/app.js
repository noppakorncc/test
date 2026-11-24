import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // หรือใส่ '*' ตอนเทส (ถ้าไม่ได้ส่ง cookie)
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
    return res.status(200).json({
        status: 'success',
        message: 'Server is Running',
        data: {
            uptime: process.uptime(),
            timeStamp: new Date().toDateString()
        }
    });
});


app.use((req, res) => {
    return res.status(404).json({
        status: 'error',
        message: 'Route not found',
        data: null
    });
});


export default app;