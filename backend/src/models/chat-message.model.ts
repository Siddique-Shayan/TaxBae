import mongoose, { Schema, Document } from "mongoose";

export type ChatRole = "system" | "user" | "assistant";

export interface ChatMessageDocument extends Document {
  threadId: mongoose.Types.ObjectId;
  role: ChatRole;
  content: string;
  createdAt: Date;
}

const chatMessageSchema = new Schema<ChatMessageDocument>(
  {
    threadId: {
      type: Schema.Types.ObjectId,
      ref: "ChatThread",
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["system", "user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Index for fast message loading per thread
chatMessageSchema.index({ threadId: 1, createdAt: 1 });

const ChatMessageModel = mongoose.model<ChatMessageDocument>(
  "ChatMessage",
  chatMessageSchema
);

export default ChatMessageModel;
