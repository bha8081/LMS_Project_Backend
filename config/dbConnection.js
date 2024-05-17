import mongoose from 'mongoose';

mongoose.set('strictQuery', false);

// Database connection
const connectionToDB = async () => {
    try{
        const { connection } = await mongoose.connect(
            process.env.MONGO_URI || `mongodb://localhost:27017/lms`
         );
    
        if (connection){
            console.log(`Connected to MongoDB: ${connection.host}`);
        }
  
     } catch(e) {
        console.log(e);
        process.exit(1);
    }
   
}

export default connectionToDB;