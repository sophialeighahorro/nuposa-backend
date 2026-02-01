import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true, 
    // This will store the messy hash, not the plain text
  },
});

export default mongoose.model("Admin", adminSchema);