import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/database';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());

app.use(express.json());


app.get('/api/health', async (req, res) => {
  try {
   
    await pool.query('SELECT NOW()'); 
    res.json({ 
      status: 'OK', 
      message: 'Backend is Online and Database is Connected! 🚀' 
    });
  } catch (error) {
    console.error('Database Connection Error:', error);
    res.status(500).json({ 
      status: 'Error', 
      message: 'Server is running, but the Database is not responding.' 
    });
  }
});


app.listen(PORT, () => {
  console.log(`
  --------------------------------------------------
  🚀 DevCollab Backend is running!
  🌐 URL: http://localhost:${PORT}
  🩺 Health Check: http://localhost:${PORT}/api/health
  --------------------------------------------------
  `);
});
