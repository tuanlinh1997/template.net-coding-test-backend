import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DB_TYPE } from '../../../constant/common.const';
import { BaseRepository } from '../../../core/repositories/base.repository';
import { ChatEntity } from '../entities/chat.entity';

@Injectable()
export class ChatRepository extends BaseRepository<ChatEntity> {
    constructor(
        @InjectRepository(ChatEntity, DB_TYPE.DB_TEMPLATE_NET)
        private readonly chatRepository: Repository<ChatEntity>,
    ) {
        super(chatRepository);
    }

    async findOne(filter: any): Promise<ChatEntity> {
        return this.chatRepository.findOne(filter);
    }

    async create(data: any): Promise<any> {
        return this.chatRepository.create(data);
    }

    async save(data: any): Promise<any> {
        return this.chatRepository.save(data);
    }
}
