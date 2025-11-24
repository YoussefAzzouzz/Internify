import { User } from './user.model';

export interface Conversation {
  id: number;
  users: User[];
  createdAt?: Date;
  lastMessageTimestamp?: Date;
  userFavorites: User[];
  unreadMessagesCount: number;
  mutedBy: User[];
}
