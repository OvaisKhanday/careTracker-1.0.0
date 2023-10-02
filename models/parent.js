import mongoose from "mongoose";

const parentSchema = new mongoose.Schema({
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
  phone_no: {
    type: String,
    trim: true,
    minLength: [10, "10 digit required"],
    maxLength: [10, "10 digit required"],
    validate: {
      validator: function (value) {
        return /^[0-9]*$/.test(value);
      },
      message: (props) => `${props.value} is not a phone no`,
    },
  },
  gender: {
    type: String,
    enum: { values: ["male", "female"], message: "{VALUE} is not supported" },
  },
  residence: { type: String, trim: true, minLength: [4, "too short residence"], maxLength: [25, "too long residence"] },
  username: {
    type: String,
    trim: true,
    minLength: [8, "username must be at least of 8 length"],
    maxLength: [25, "too long username"],

    validate: {
      validator: function (value) {
        return /^[0-9a-zA-Z_]*$/.test(value);
      },
      message: (props) => `${props.value} is invalid username`,
    },
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "students",
    },
  ],
  institute_id: { type: mongoose.Schema.Types.ObjectId, ref: "institutes", required: true },
});

export default mongoose.model("parents", parentSchema);
