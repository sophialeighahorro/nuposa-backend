import mongoose, { mongo } from "mongoose";

const inquirySchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  courseAndSection: {
    type: String,
    required: true,
  },
  nuEmail: {
    type: String,
    required: true,
  },
  chosenCat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cat",
    required: true,
  },
});

const Inquiry = mongoose.model("Inquiry", inquirySchema);

export default Inquiry;
