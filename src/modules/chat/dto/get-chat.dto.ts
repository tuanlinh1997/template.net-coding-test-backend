import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetChatDto {
    @IsNumber()
    @IsNotEmpty()
    page: number = 1;

    @IsNumber()
    @IsNotEmpty()
    limit: number = 30;
}
