import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  username: String,
  score: Number,
  correctCount: Number,
  date: { type: Date, default: Date.now },
});

const Result = mongoose.model("Result", resultSchema);
export default Result;
