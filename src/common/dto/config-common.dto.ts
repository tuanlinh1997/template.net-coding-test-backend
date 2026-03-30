import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
/*
 * Dùng phân trang với params { page: number, limit: number }
 * </br>
 * Sử dụng "extends PartialType(Pagination)" khi cần required: false
 */
export class Pagination {
    @IsNotEmpty()
    @IsOptional()
    @ApiProperty({
        name: 'page',
        type: 'number',
        description: 'Page',
        example: 1,
        required: true,
    })
    page: number = 1;

    @IsNotEmpty()
    @ApiProperty({ name: 'limit', type: 'number', description: 'Limit ( -1 with get all )', example: 30, required: true })
    limit: number = 30;
}
/*
 * Sử dụng cho phân trang, không cần xử lý gì thêm
 */
export function handleParamsPagination(page?: number, limit?: number): [number | undefined, number | undefined] {
    const limitHandle = limit && limit > 0 ? limit : limit == -1 ? undefined : 30;
    const pageHandle = !limitHandle ? undefined : page && page > 0 ? page : 1;
    return [limitHandle && pageHandle ? (pageHandle - 1) * limitHandle : undefined, limitHandle && pageHandle ? limitHandle : undefined];
}
