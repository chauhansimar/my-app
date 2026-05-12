import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  companyId: String,
  name: String,
  description: String,
  established: String,
  founder: String,
  employees: String,
  services: [String],
  location: String,
  rawContent: String   // optional full text
});

export default mongoose.model("Data", dataSchema);