import { Router } from "express";
import {
  createChatThread,
  getChatThreads,
  getChatMessages,
  sendChatMessage,
} from "../controllers/chatbot.controller";
import { passportAuthenticateJwt } from "../config/passport.config";

const chatbotRouter = Router();

// All chat routes are protected
chatbotRouter.use(passportAuthenticateJwt);

// Threads
chatbotRouter.post("/thread", createChatThread);
chatbotRouter.get("/threads", getChatThreads);

// Messages
chatbotRouter.get("/messages/:threadId", getChatMessages);
chatbotRouter.post("/message", sendChatMessage);

export default chatbotRouter;
