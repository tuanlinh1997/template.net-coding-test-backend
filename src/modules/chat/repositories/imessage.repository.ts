import { MessageEntity } from '../entities/message.entity';
import { IBaseRepository } from '../../../core/repositories/ibase.repository';

export interface IMessageRepository extends IBaseRepository<MessageEntity> {
    findAndCount(chatId: number, page: number, limit: number): Promise<[MessageEntity[], number]>;
}
