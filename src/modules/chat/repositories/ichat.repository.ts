import { ChatEntity } from '../entities/chat.entity';

export interface IChatRepository {
    findOne(filter: any): Promise<ChatEntity>;
    create(data: any): Promise<any>;
    save(data: any): Promise<any>;
}
