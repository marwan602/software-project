import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Using the Connection String method - most reliable
const connectionString = 'postgresql://postgres:your_password@localhost:5432/devcollab';

const pool = new Pool({
  connectionString: connectionString,
});

export default pool;
