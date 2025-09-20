import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  text: String,
  options: [String],
  correctIndex: Number,
  points: Number,
  difficulty: String,
});

const Question = mongoose.model("Question", questionSchema);
export default Question;
