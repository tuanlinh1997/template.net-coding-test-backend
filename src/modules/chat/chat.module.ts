import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_TYPE } from '../../constant/common.const';
import { ChatController } from './controllers/chat.controller';
import { ChatService } from './services/chat.service';
import { ChatRepository } from './repositories/chat.repository';
import { ChatEntity } from './entities/chat.entity';
import { MessageEntity } from './entities/message.entity';
import { MessageRepository } from './repositories/message.repository';

@Module({
    imports: [TypeOrmModule.forFeature([ChatEntity, MessageEntity], DB_TYPE.DB_TEMPLATE_NET)],

    providers: [
        {
            provide: 'IChatService',
            useClass: ChatService,
        },
        {
            provide: 'IChatRepository',
            useClass: ChatRepository,
        },
        {
            provide: 'IMessageRepository',
            useClass: MessageRepository,
        },
    ],
    exports: [],
    controllers: [ChatController],
})
export class ChatModule {}
