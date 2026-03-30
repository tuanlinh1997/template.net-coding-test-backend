import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { IBaseEntity } from '../../../core/databases/base.entity';
import { MessageEntity } from './message.entity';

@Entity({ name: 'chat' })
@Unique(['clientId'])
export class ChatEntity extends IBaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ type: 'varchar', length: 255 })
    clientId: string; // định danh tạm thời user

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    created_at: string; // tiêu đề chat

    @OneToMany(() => MessageEntity, (message) => message.chat)
    messages: MessageEntity[];
}
