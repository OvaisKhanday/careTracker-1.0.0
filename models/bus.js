import mongoose from "mongoose";

const busSchema = new mongoose.Schema({
  bus_registration: {
    type: String,
    trim: true,
    required: true,
    uppercase: true,
    validate: {
      validator: function (value) {
        return /^[a-zA-Z]{2}[0-9]{2}[a-zA-Z]{0,3}[0-9]{4}$/.test(value);
      },
      message: (props) => `${props.value} is invalid registration no.`,
    },
  },
  bus_no: { type: Number, required: true, min: [1, "start with 1"], max: [999999, "too big bus no"] },
  coordinates: {
    latitude: { type: String, default: "" },
    longitude: { type: String, default: "" },
    // timestamp: { type: Date, default: () => new Date() },
  },
  institute_id: { type: mongoose.Schema.Types.ObjectId, ref: "institutes", required: true },
});

export default mongoose.model("buses", busSchema);
