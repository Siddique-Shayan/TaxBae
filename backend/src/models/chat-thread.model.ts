import mongoose, { Schema, Document } from "mongoose";

export interface ChatThreadDocument extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

const chatThreadSchema = new Schema<ChatThreadDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      default: "New Chat",
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast user thread listing
chatThreadSchema.index({ userId: 1, createdAt: -1 });

const ChatThreadModel = mongoose.model<ChatThreadDocument>(
  "ChatThread",
  chatThreadSchema
);

export default ChatThreadModel;
