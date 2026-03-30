import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { IBaseEntity } from '../../../core/databases/base.entity';
import { ChatEntity } from './chat.entity';

export type MessageSender = 'user' | 'ai';
export type MessageType = 'text' | 'file';

@Entity({ name: 'messages' })
export class MessageEntity extends IBaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    chatId: number;

    @ManyToOne(() => ChatEntity, (chat) => chat.messages, { onDelete: 'CASCADE' })
    chat: ChatEntity;

    @Column({ type: 'enum', enum: ['user', 'ai'], default: 'user' })
    sender: MessageSender;

    @Column({ type: 'text' })
    content: string;

    @Column({ type: 'enum', enum: ['text', 'file'], default: 'text' })
    type: MessageType;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    created_at: string;
}
