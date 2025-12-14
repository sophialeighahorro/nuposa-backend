import mongoose from "mongoose";

const adoptionSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    idNumber: { type: String, required: true },
    contact: { type: String, required: true },
    affiliation: {
      type: String,
      enum: ["Student", "Employee"],
      required: true,
    },
    chosenCat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cat",
      required: true,
    },
    petsAtHome: { type: String, required: true },
    careEnvironment: { type: String, required: true },
    reason: { type: String, required: true },
    consent: { type: Boolean, required: true },
    status: {
      type: String,
      enum: ["Submitted", "Under Review", "Interview Scheduled", "Approved"],
      default: "Submitted",
    },
  },
  { timestamps: true }
);

const Adoption = mongoose.model("Adoption", adoptionSchema);
export default Adoption;
