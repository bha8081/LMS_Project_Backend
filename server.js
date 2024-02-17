import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import connectioToDB from './config/dbConnection.js';
import cloudinary from 'cloudinary';

const PORT = process.env.PORT || 3020;

// Cloudinary configuration
cloudinary.v2.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(PORT, async () => {
   await connectioToDB();
   console.log(`App is running on http://localhost:${PORT}`);
});