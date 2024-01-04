import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import connectioToDB from './config/dbConnection.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
   await connectioToDB();
   console.log(`App is running on http://localhost:${PORT}`);
});