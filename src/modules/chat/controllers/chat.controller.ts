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
    UseInterceptors,
    UploadedFiles,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../../core/controllers/base.controller';
import { MESSAGE } from '../../../constant/common.const';
import { GetChatDto } from '../dto/get-chat.dto';
import { IChatService } from '../services/ichat.service';
import { CreateMessageDto } from '../dto/create-message.dto';
import { log } from 'console';
import { FastifyFilesFieldsInterceptor } from '../../../interceptor/fastify-file-fields-interceptor';
import { diskStorage } from 'multer';
import { config } from '../../../config/config';
import * as fs from 'fs';
import { editFileName, imageFileFilter } from '../../../utils/file-upload-util';
import { UploadFilesStoreDto } from '../dto/files.sto';
import { fileMapper } from '../../../utils/file-mappter';

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
            console.log('chatId', chatId, query);

            const messages = await this.chatService.getMessages(chatId, query.page, query.limit);
            return this.sendOkResponse(messages, MESSAGE.SUCCESS);
        } catch (error) {
            console.log('error controller', error);
            return this.sendFailedResponse(error.message, error.status);
        }
    }

    @Post(':chatId/messages')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(
        FastifyFilesFieldsInterceptor([{ name: 'files' }], {
            storage: diskStorage({
                // destination: config().destination + '/content' + `/${new Date().getFullYear()}` + `/${new Date().getMonth() + 1}`,
                destination(req, file, callback) {
                    const path = config().destination  + `/${new Date().getFullYear()}` + `/${new Date().getMonth() + 1}`;
                    fs.mkdirSync(path, { recursive: true });
                    callback(null, path);
                },
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }),
    )
    @ApiTags('Chat')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false, transform: true }))
    public async createMessage(@Param('chatId') chatId: number, @Body() body: CreateMessageDto, @UploadedFiles() file: UploadFilesStoreDto): Promise<{ reply: string }> {
        try {
            const { message } = body;
            const  files  = file.files ? file.files[0] : null;
            const fileUpload = files && fileMapper({ file: files, req: null })
            console.log('files', fileUpload);
            log('Received message:', message, 'for chatId:', chatId);
            await this.chatService.createMessage(chatId, message, 'user', fileUpload);
            if(fileUpload) {
                const reply = `Chưa hỗ trợ hình ảnh`;
                await this.chatService.createMessage(chatId, reply, 'ai');
                return this.sendOkResponse({ reply: "Chưa hỗ trợ hình ảnh" }, MESSAGE.SUCCESS) as { reply: string };
            }
            // Return plain text so the frontend can consume it chunk-by-chunk or as a single body.
            const reply: string = await this.chatService.streamAIResponse(chatId, message);
            
            return this.sendOkResponse({ reply }, MESSAGE.SUCCESS) as { reply: string };
        } catch (error) {
            console.log('error controller', error);

            const status: number | undefined =
                typeof (error as { getStatus?: () => number }).getStatus === 'function'
                    ? (error as { getStatus: () => number }).getStatus()
                    : typeof (error as { status?: number }).status === 'number'
                      ? (error as { status: number }).status
                      : undefined;

            const reply: string =
                status === 429
                    ? 'Hệ thống đang quá tải, vui lòng thử lại sau.'
                    : status === 503
                      ? 'AI server đang bận, vui lòng thử lại sau.'
                      : status === 400
                        ? 'Hiện tại không thể xử lý yêu cầu của bạn, vui lòng thử lại sau.'
                        : 'AI đang bận, vui lòng thử lại sau.';

            return this.sendOkResponse({ reply }, MESSAGE.SUCCESS) as { reply: string };
        }
    }
}
