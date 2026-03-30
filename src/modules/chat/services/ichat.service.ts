import { ChatEntity } from '../entities/chat.entity';
import { MessageEntity } from '../entities/message.entity';

export interface IChatService {
    getOrCreateChat(clientId: string): Promise<ChatEntity>;
    getMessages(chatId: number, page: number, limit: number): Promise<{ item: MessageEntity[]; total: number }>;

    createMessage(chatId: number, content: string): Promise<MessageEntity>;
    streamAIResponse(chatId: number, content: string, callback: (chunk: string) => void);
}
