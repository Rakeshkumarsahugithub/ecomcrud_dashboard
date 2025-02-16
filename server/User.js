import mongoose from 'mongoose';

// Define the schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,  // Ensures email is unique
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  }
}, { timestamps: true });  // Added timestamps to auto-track createdAt/updatedAt

// Create the model
const User = mongoose.model('User', userSchema);

export default User;


