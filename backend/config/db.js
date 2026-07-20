import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!uri) {
    console.error(
      "MongoDB connection error: set MONGO_URI (or MONGODB_URI) in backend/.env to your Atlas connection string."
    );
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    console.error(
      "Check: (1) Atlas Network Access allows your IP, (2) username/password are correct, (3) URI uses mongodb+srv://..."
    );
    process.exit(1);
  }
};

export default connectDB;
