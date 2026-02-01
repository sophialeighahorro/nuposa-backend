import mongoose from "mongoose";

const catSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    // SECURITY: Validates data length
    maxLength: [30, "Name cannot exceed 30 characters"], 
    // SECURITY: Validates against a "white list" (only letters, numbers, spaces allowed)
    match: [/^[a-zA-Z0-9 ]+$/, "Name can only contain letters and numbers"], 
  },
  age: {
    type: Number,
    required: [true, "Age is required"],
    // SECURITY: Validates data range (prevents negative or unrealistic numbers)
    min: [0, "Age cannot be negative"],
    max: [30, "Age cannot be more than 30"],
  },
  gender: {
    type: String,
    required: [true, "Gender is required"],
    // SECURITY: Validates against a "white list" of allowed values
    enum: {
      values: ["Male", "Female", "Unknown"],
      message: "{VALUE} is not a valid gender",
    },
  },
  isAdopted: {
    type: Boolean,
    default: false,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  desc: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
    // SECURITY: Validates data length (prevents database bloating attacks)
    maxLength: [500, "Description cannot exceed 500 characters"], 
  },
});

const Cat = mongoose.model("Cat", catSchema);

export default Cat;