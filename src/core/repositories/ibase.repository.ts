import { EntityId } from 'typeorm/repository/EntityId';
import { DeleteResult, QueryRunner, SelectQueryBuilder } from 'typeorm';
import { Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

export interface IBaseRepository<T> {
    findAll(): Promise<T[]>;

    createQueryBuilder(alias?: string, queryRunner?: QueryRunner): SelectQueryBuilder<T>;

    paginate(options: IPaginationOptions): Promise<Pagination<T>>;

    paginateQueryBuilder(queryBuilder: SelectQueryBuilder<T>, options: IPaginationOptions): Promise<Pagination<T>>;

    paginateRawQueryBuilder(queryBuilder: SelectQueryBuilder<T>, options: IPaginationOptions): Promise<Pagination<T>>;

    paginateRawAndEntitiesQueryBuilder(queryBuilder: SelectQueryBuilder<T>, options: IPaginationOptions): Promise<[Pagination<T>, Partial<T>[]]>;

    findById(id: EntityId): Promise<T>;

    findByIds(id: [EntityId]): Promise<T[]>;

    findByCondition(filterCondition: any): Promise<T>;

    findAllByCondition(filterCondition: any): Promise<T[]>;

    store(data: any): Promise<T>;

    update(id: EntityId, data: any): Promise<T>;

    delete(id: EntityId): Promise<DeleteResult>;

    clear();

    count(filterCondition: any): Promise<number>;
}
