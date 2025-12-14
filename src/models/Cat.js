import mongoose from "mongoose";

const catSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
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
    required: true,
  },
});

const Cat = mongoose.model("Cat", catSchema);

export default Cat;
