import { ChatEntity } from '../entities/chat.entity';
import { MessageEntity } from '../entities/message.entity';

interface UploadedChatFile {
    image_url: string;
}

export interface IChatService {
    getOrCreateChat(clientId: string): Promise<ChatEntity>;
    getMessages(chatId: number, page: number, limit: number): Promise<{ items: MessageEntity[]; total: number }>;

    createMessage(chatId: number, content: string, sender?: string,  fileUpload?: UploadedChatFile, ): Promise<MessageEntity>;
    streamAIResponse(chatId: number, content: string): Promise<string>;
}
