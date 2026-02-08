import { Request, Response } from "express";
import mongoose from "mongoose";
import ChatThreadModel from "../models/chat-thread.model";
import ChatMessageModel from "../models/chat-message.model";
import { GeminiService } from "../services/gemini.service";
import { asyncHandler } from "../middlewares/asyncHandler.middlerware";
import { HTTPSTATUS } from "../config/http.config";

/**
 * Create a new chat thread
 */
export const createChatThread = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id;

    const thread = await ChatThreadModel.create({
      userId,
      title: "New Chat",
    });

    return res.status(HTTPSTATUS.CREATED).json({
      thread,
    });
  }
);

/**
 * Get all chat threads for logged-in user
 */
export const getChatThreads = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id;

    const threads = await ChatThreadModel.find({ userId })
      .sort({ updatedAt: -1 })
      .lean();

    return res.status(HTTPSTATUS.OK).json({
      threads,
    });
  }
);

/**
 * Get messages for a thread
 */
export const getChatMessages = asyncHandler(
  async (req: Request, res: Response) => {
    const { threadId } = req.params;
    const userId = req.user!._id;

    const thread = await ChatThreadModel.findOne({
      _id: threadId,
      userId,
    });

    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    const messages = await ChatMessageModel.find({ threadId })
      .sort({ createdAt: 1 })
      .lean();

    return res.status(HTTPSTATUS.OK).json({
      messages,
    });
  }
);

/**
 * Send message to a thread
 */
export const sendChatMessage = asyncHandler(
  async (req: Request, res: Response) => {
    const { threadId, message } = req.body;
    const userId = req.user!._id;

    if (!message?.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const thread = await ChatThreadModel.findOne({
      _id: threadId,
      userId,
    });

    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    // Save user message
    const userMessage = await ChatMessageModel.create({
      threadId,
      role: "user",
      content: message,
    });

    // Fetch previous messages
    const previousMessages = await ChatMessageModel.find({ threadId })
      .sort({ createdAt: 1 })
      .lean();

    // Prepare messages for Gemini
    const geminiMessages = previousMessages
    .filter((msg) => msg.role === "user" || msg.role === "assistant")
    .map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
    }));


    // Generate AI reply
    const aiReply = await GeminiService.generateReply(geminiMessages);

    // Save AI message
    const assistantMessage = await ChatMessageModel.create({
      threadId,
      role: "assistant",
      content: aiReply,
    });

    // Update thread timestamp
    thread.updatedAt = new Date();
    await thread.save();

    return res.status(HTTPSTATUS.OK).json({
      messages: [userMessage, assistantMessage],
    });
  }
);
