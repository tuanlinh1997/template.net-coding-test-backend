import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetChatDto {
    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    page: number = 1;

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    limit: number = 30;
}
