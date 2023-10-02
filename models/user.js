import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    minLength: [8, "username must be at least of 8 length"],
    maxLength: [25, "too long username"],
    required: [true, "username is required"],
    unique: [true, "username is occupied"],
    validate: {
      validator: function (value) {
        return /^[0-9a-zA-Z_]*$/.test(value);
      },
      message: (props) => `${props.value} is invalid username`,
    },
  },
  password: { type: String, required: true },
  role: { type: String, enum: { values: ["admin", "parent", "driver"], message: "{VALUE} is not supported" }, required: true },
  institute_id: { type: mongoose.Schema.Types.ObjectId, ref: "institutes" },
});

export default mongoose.model("users", userSchema);
