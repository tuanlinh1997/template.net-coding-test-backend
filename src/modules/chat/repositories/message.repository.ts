import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DB_TYPE } from '../../../constant/common.const';
import { BaseRepository } from '../../../core/repositories/base.repository';
import { MessageEntity } from '../entities/message.entity';

@Injectable()
export class MessageRepository extends BaseRepository<MessageEntity> {
    constructor(
        @InjectRepository(MessageEntity, DB_TYPE.DB_TEMPLATE_NET)
        private readonly messageRepository: Repository<MessageEntity>,
    ) {
        super(messageRepository);
    }

    async findAndCount(chatId: number, page: number, limit: number): Promise<[MessageEntity[], number]> {
        return this.messageRepository.findAndCount({
            where: { chatId },
            order: { created_at: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
    }
}
