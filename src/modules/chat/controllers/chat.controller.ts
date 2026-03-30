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

@ApiBearerAuth('JWT-auth')
@Controller('chat')
export class ChatController extends BaseController {
    constructor(
        @Inject('IChatService')
        private readonly chatService: IChatService,
    ) {
        super();
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

    @Get(':chatId/messages')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false, transform: true }))
    public async getMessagesByChatId(@Param('chatId') chatId: number, @Query() query: GetChatDto) {
        try {
            const messages = await this.chatService.getMessages(chatId, query.page, query.limit);
            return this.sendOkResponse(messages, MESSAGE.SUCCESS);
        } catch (error) {
            console.log('error controller', error);
            return this.sendFailedResponse(error.message, error.status);
        }
    }

    @Post(':chatId/messages')
    @ApiTags('Chat')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false, transform: true }))
    public async createMessage(@Param('chatId') chatId: number, @Body() body: CreateMessageDto, @Res() reply: any) {
        const { userMessage } = body;
        const res = reply.raw;
        try {
            await this.chatService.createMessage(chatId, userMessage);
            res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive',
            });

            // Gửi data từng chunk
            await this.chatService.streamAIResponse(chatId, userMessage, (chunk) => {
                res.write(`data: ${chunk}\n\n`);
            });

            // Kết thúc stream
            res.write('event: end\n');
            res.write('data: [DONE]\n\n');
            res.end();
        } catch (error) {
            console.log('error controller', error);
            throw error;
        }
    }
}
