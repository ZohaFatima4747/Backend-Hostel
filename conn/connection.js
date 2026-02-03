const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 
            "mongodb+srv://Connect-form:contactform00o@cluster0.b9afhru.mongodb.net/Hostel", 
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        // Stop server if DB fails
        process.exit(1);
    }
};

module.exports = connectDB;
