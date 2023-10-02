import mongoose from "mongoose";

const instituteSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "institute name is required"],
    minLength: [5, "too short school name"],
    maxLength: [30, "too long school name"],
  },
  principal: {
    type: String,
    trim: true,
    minLength: [4, "short name"],
    maxLength: [25, "long name <25"],
    validate: {
      validator: function (value) {
        return /^[a-zA-Z ]*$/.test(value);
      },
      message: (props) => `${props.value} is not a name`,
    },
  },
  admin: {
    name: {
      type: String,
      trim: true,
      required: [true, "admin name is required"],
      minLength: [4, "short name"],
      maxLength: [25, "long name <= 25"],
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
    username: {
      type: String,
      trim: true,
      required: [true, "username is required"],
      minLength: [8, "username must be at least of 8 length"],
      maxLength: [25, "too long username"],
      unique: [true, "username is not available"],
      validate: {
        validator: function (value) {
          return /^[0-9a-zA-Z_]*$/.test(value);
        },
        message: (props) => `${props.value} is invalid username`,
      },
    },
  },
});

export default mongoose.model("institutes", instituteSchema);
