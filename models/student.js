import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    minLength: [4, "short name"],
    maxLength: [25, "long name <25"],
    validate: {
      validator: function (value) {
        return /^[a-zA-Z ]*$/.test(value);
      },
      message: (props) => `${props.value} is not a name`,
    },
  },
  age: {
    type: Number,
    min: [1, "too young"],
    max: [50, "too old"],
    validate: {
      validator: function (value) {
        return /^[1-9][0-9]*$/.test(value);
      },
      message: (props) => `${props.value} is invalid`,
    },
  },
  gender: {
    type: String,
    enum: { values: ["male", "female", "other"], message: "{VALUE} is not supported" },
  },
  class: {
    type: String,
    required: true,
    enum: {
      values: ["Pre", "Nur", "LKG", "UKG", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"],
      message: "{VALUE} is not supported",
    },
  },
  roll_no: {
    type: Number,
    required: true,
    required: true,
    min: [1, "how can roll be 0 or negative"],
    max: [9999999999, "too big roll no"],
    validate: {
      validator: function (value) {
        return /^[1-9][0-9]*$/.test(value);
      },
      message: (props) => `${props.value} is invalid`,
    },
  },
  bus_no: { type: Number, min: [1, "start with 1"], max: [999999, "too big bus no"] },
  data_of_enrol: { type: Date, default: () => Date.now(), required: false },
  institute_id: { type: mongoose.Schema.Types.ObjectId, ref: "institutes", required: false },
});

export default mongoose.model("students", studentSchema);
