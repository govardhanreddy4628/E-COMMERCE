// models/Event.ts
import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // your app user ID
  googleEventId: { type: String },          // maps to Google event.id
  title: { type: String, required: true },
  description: String,
  start: Date,
  end: Date,
  updatedAt: Date,
});

export default mongoose.model("Event", EventSchema);
