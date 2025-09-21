import mongoose from 'mongoose';

// ✅ Enhanced database connection with security options
export const connectDB = async () => {
    try {
        // ✅ SECURITY: Enhanced MongoDB connection options
        const options = {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            bufferMaxEntries: 0,
            retryWrites: true,
            w: 'majority',
            authSource: 'admin',
            ssl: process.env.NODE_ENV === 'production',
            sslValidate: process.env.NODE_ENV === 'production',
        };

        await mongoose.connect(process.env.MONGO_URI, options);
        
        console.log("✅ MongoDB connected successfully");
        console.log(`🔒 SSL/TLS: ${process.env.NODE_ENV === 'production' ? 'Enabled' : 'Disabled'}`);
        
        // ✅ Connection event listeners
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('🔄 MongoDB reconnected');
        });

    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        process.exit(1);
    }
};