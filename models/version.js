import mongoose from "mongoose";

const versionSchema = new mongoose.Schema({
  version: { type: String },
  play_store: { type: String },
});

export default mongoose.model("version", versionSchema);
