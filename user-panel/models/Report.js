import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  id: Number,
  type: String,
  severity: String,
  location: String,
  coords: [Number],
  description: String,
  reportedDate: String,
  status: String
});

export default mongoose.model("Report", ReportSchema);
