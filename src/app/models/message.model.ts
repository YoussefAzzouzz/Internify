import { User } from './user.model';
import {Conversation} from "./conversation.model";

export interface Message {
  id: number;
  content: string;
  messageType: string;
  timestamp?: Date;
  sender: User;
  receiver: User;
  status: string;
  isTyping: boolean;
  isPinned: boolean;
  readAt: Date | null;
  attachmentUrl: string | null;
  conversation?: Conversation;
}
