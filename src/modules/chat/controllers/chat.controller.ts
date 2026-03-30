import {
    Controller,
    Post,
    // Req,
    Inject,
    // UploadedFile,
    // UseInterceptors,
    // UploadedFiles,
    Param,
    Get,
    Query,
    UsePipes,
    ValidationPipe,
    Body,
    Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../../core/controllers/base.controller';
import { MESSAGE } from '../../../constant/common.const';
import { GetChatDto } from '../dto/get-chat.dto';
import { IChatService } from '../services/ichat.service';
import { CreateMessageDto } from '../dto/create-message.dto';
import { log } from 'console';

@ApiBearerAuth('JWT-auth')
@Controller('chat')
export class ChatController extends BaseController {
    constructor(
        @Inject('IChatService')
        private readonly chatService: IChatService,
    ) {
        super();
    }

    @Get(':chatId/messages')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false, transform: true }))
    public async getMessagesByChatId(@Param('chatId') chatId: number, @Query() query: GetChatDto) {
        try {
            console.log('chatId', chatId, query);

            const messages = await this.chatService.getMessages(chatId, query.page, query.limit);
            return this.sendOkResponse(messages, MESSAGE.SUCCESS);
        } catch (error) {
            console.log('error controller', error);
            return this.sendFailedResponse(error.message, error.status);
        }
    }

    @Get(':clientId')
    public async getMessages(@Param('clientId') clientId: string) {
        try {
            const chat = await this.chatService.getOrCreateChat(clientId);
            return this.sendOkResponse(chat, MESSAGE.SUCCESS);
        } catch (error) {
            console.log('error controller', error);
            return this.sendFailedResponse(error.message, error.status);
        }
    }

    @Post(':chatId/messages')
    @ApiTags('Chat')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false, transform: true }))
    public async createMessage(@Param('chatId') chatId: number, @Body() body: CreateMessageDto, @Res() reply: any) {
        const { message } = body;
        const res = reply.raw;
        log('Received message:', message, 'for chatId:', chatId);
        try {
            await this.chatService.createMessage(chatId, message);
            res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive',
            });
            res.flushHeaders?.()
            // Gửi data từng chunk
            this.chatService
                .streamAIResponse(chatId, message, (chunk) => {
                    res.write(`data: ${chunk}\n\n`);
                })
                .then(() => {
                    res.write('event: end\n');
                    res.write('data: [DONE]\n\n');
                    res.end();
                })
                .catch((err) => {
                    res.write(`data: ERROR: ${err.message}\n\n`);
                    res.end();
                });
        } catch (error) {
            console.log('error controller', error);
            throw error;
        }
    }
}
