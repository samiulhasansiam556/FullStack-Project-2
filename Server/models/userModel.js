                        
// models/userSchema.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  username:{type: String,required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  profileImage: { type: String },
  address: { type: String },
  phone: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const UserModel = mongoose.model('User', userSchema);
export default UserModel;
