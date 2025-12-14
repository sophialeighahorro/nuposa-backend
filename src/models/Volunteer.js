import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema(
  {
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
    hasCatFood: {
      type: Boolean,
      default: false,
    },
    catFoodName: {
      type: String,
      // Required to pag yung volunteer is meron cat food
      required: function () {
        return this.hasCatFood;
      },
    },
    selectedSlot: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Volunteer = mongoose.model("Volunteer", volunteerSchema);
export default Volunteer;
