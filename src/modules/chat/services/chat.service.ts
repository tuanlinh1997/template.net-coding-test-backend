import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ChatEntity } from '../entities/chat.entity';
import { IChatRepository } from '../repositories/ichat.repository';
import { formatDateTime } from '../../../core/helpers/datetime.helper';
import { MessageEntity } from '../entities/message.entity';
import { IMessageRepository } from '../repositories/imessage.repository';
import { IChatService } from './ichat.service';
import { config } from '../../../config/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface UploadedChatFile {
    image_url: string;
}

@Injectable()
export class ChatService implements IChatService {
    private genAI = new GoogleGenerativeAI(config().openai.apiKey);
    private model = this.genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });
    constructor(
        @Inject('IChatRepository')
        private readonly chatRepository: IChatRepository,
        @Inject('IMessageRepository')
        private readonly messageRepository: IMessageRepository,
    ) {
        // this.openai = new OpenAI({ apiKey: config().openai.apiKey });
    }

    async getOrCreateChat(clientId: string): Promise<ChatEntity> {
        let chat = await this.chatRepository.findOne({
            where: { clientId },
            relations: ['messages'],
        });

        if (!chat) {
            const data = {
                clientId,
                created_at: formatDateTime('YYYY-MM-DD HH:mm:ss'),
            };
            chat = await this.chatRepository.create(data);
            chat = await this.chatRepository.save(chat);
        }

        return chat;
    }

    async getMessages(chatId: number, page: number, limit: number): Promise<{ items: MessageEntity[]; total: number }> {
        try {
            const [messages, total] = await this.messageRepository.findAndCount(chatId, page, limit);
            return { items: messages, total };
        } catch (error) {
            throw error;
        }
    }

    async createMessage(chatId: number, content: string, sender: string = 'user', fileUpload?: UploadedChatFile ): Promise<MessageEntity> {
        const chat = await this.chatRepository.findOne({ where: { id: chatId } });
        if (!chat) {
            throw new NotFoundException('Chat not found');
        }

        const trimmedContent: string = content?.trim() ?? '';
        const hasTextContent: boolean = trimmedContent.length > 0;
        const hasFileUpload: boolean = Boolean(fileUpload?.image_url);

        if (!hasTextContent && !hasFileUpload) {
            throw new BadRequestException('Message content or file is required');
        }

        const createdAt: string = formatDateTime('YYYY-MM-DD HH:mm:ss');
        let latestMessage: MessageEntity | null = null;

        if (hasFileUpload) {
            latestMessage = await this.messageRepository.store({
                chat,
                content: fileUpload.image_url,
                sender: sender,
                type: 'file',
                created_at: createdAt,
            });
        }

        if (hasTextContent) {
            latestMessage = await this.messageRepository.store({
                chat,
                content: trimmedContent,
                sender: sender,
                type: 'text',
                created_at: createdAt,
            });
        }

        if (!latestMessage) {
            throw new BadRequestException('Could not create message');
        }

        return latestMessage;
    }

    async streamAIResponse(chatId: number, content: string): Promise<string> {
        try {
            const chat = await this.chatRepository.findOne({ where: { id: chatId } });
            if (!chat) {
                throw new NotFoundException('Chat not found');
            }
            // const stream = await this.openai.chat.completions.create({
            //     model: 'gpt-4o-mini',
            //     messages: [{ role: 'user', content: content }],
            //     stream: true,
            // });
            // let aiContent = '';
            // for await (const event of stream) {
            //     const chunk = event.choices[0]?.delta?.content;
            //     if (chunk) {
            //         aiContent += chunk;
            //         callback(chunk);
            //     }
            // }

            const result = await this.model.generateContent(content);

            const reply = result.response.text();

            await this.messageRepository.store({
                chatId,
                content: reply,
                sender: 'ai',
                type: 'text',
                created_at: formatDateTime('YYYY-MM-DD HH:mm:ss'),
            });
            return reply;
        } catch (error) {
            throw error;
        }
    }
}
