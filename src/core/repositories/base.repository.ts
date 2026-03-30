import { DeleteResult, QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';
import { paginate, paginateRaw, paginateRawAndEntities, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { IBaseRepository } from './ibase.repository';
import { EntityId } from 'typeorm/repository/EntityId';
import { BadRequestException, HttpStatus } from '@nestjs/common';
import { ErrorResponse } from './../helpers/responses/error.response';
import { responseMsg } from '../constants/responseMsg.const';

export abstract class BaseRepository<T> implements IBaseRepository<T> {
    protected readonly repository: Repository<T>;

    constructor(repository: Repository<T>) {
        this.repository = repository;
    }

    findAll(): Promise<T[]> {
        try {
            return this.repository.find();
        } catch (error) {
            console.log('findAll error: ', error.message);
            throw new BadRequestException(new ErrorResponse(error.message, responseMsg.CONFIG_DB_INVALID.CODE, HttpStatus.BAD_REQUEST, error));
        }
    }

    createQueryBuilder(alias?: string, queryRunner?: QueryRunner): SelectQueryBuilder<T> {
        try {
            return this.repository.createQueryBuilder(alias, queryRunner);
        } catch (error) {
            console.log('createQueryBuilder error: ', error.message);
            throw new BadRequestException(new ErrorResponse(error.message, responseMsg.CONFIG_DB_INVALID.CODE, HttpStatus.BAD_REQUEST, error));
        }
    }

    createQueryRunner(alias?: string, queryRunner?: QueryRunner): SelectQueryBuilder<T> {
        try {
            return this.repository.createQueryBuilder(alias, queryRunner);
        } catch (error) {
            console.log('createQueryBuilder error: ', error.message);
            throw new BadRequestException(new ErrorResponse(error.message, responseMsg.CONFIG_DB_INVALID.CODE, HttpStatus.BAD_REQUEST, error));
        }
    }

    paginate(options: IPaginationOptions): Promise<Pagination<T>> {
        try {
            return paginate<T>(this.repository, options);
        } catch (error) {
            console.log('paginate error: ', error.message);
            throw new BadRequestException(new ErrorResponse(error.message, responseMsg.CONFIG_DB_INVALID.CODE, HttpStatus.BAD_REQUEST, error));
        }
    }

    paginateQueryBuilder(queryBuilder: SelectQueryBuilder<T>, options: IPaginationOptions): Promise<Pagination<T>> {
        try {
            return paginate<T>(queryBuilder, options);
        } catch (error) {
            console.log('paginateQueryBuilder error: ', error.message);
            throw new BadRequestException(new ErrorResponse(error.message, responseMsg.CONFIG_DB_INVALID.CODE, HttpStatus.BAD_REQUEST, error));
        }
    }

    paginateRawQueryBuilder(queryBuilder: SelectQueryBuilder<T>, options: IPaginationOptions): Promise<Pagination<T>> {
        try {
            return paginateRaw<T>(queryBuilder, options);
        } catch (error) {
            console.log('paginateRaw error: ', error.message);
            throw new BadRequestException(new ErrorResponse(error.message, responseMsg.CONFIG_DB_INVALID.CODE, HttpStatus.BAD_REQUEST, error));
        }
    }

    paginateRawAndEntitiesQueryBuilder(queryBuilder: SelectQueryBuilder<T>, options: IPaginationOptions): Promise<[Pagination<T>, Partial<T>[]]> {
        try {
            return paginateRawAndEntities<T>(queryBuilder, options);
        } catch (error) {
            console.log('paginateRawAndEntities error: ', error.message);
            throw new BadRequestException(new ErrorResponse(error.message, responseMsg.CONFIG_DB_INVALID.CODE, HttpStatus.BAD_REQUEST, error));
        }
    }

    findById(id: EntityId): Promise<T> {
        try {
            return this.repository.findOneById(id);
        } catch (error) {
            console.log('findById error: ', error.message);
            throw new BadRequestException(new ErrorResponse(error.message, responseMsg.CONFIG_DB_INVALID.CODE, HttpStatus.BAD_REQUEST, error));
        }
    }

    findByIds(ids: [EntityId]): Promise<T[]> {
        try {
            return this.repository.findByIds(ids);
        } catch (error) {
            console.log('findByIds error: ', error.message);
            throw new BadRequestException(new ErrorResponse(error.message, responseMsg.CONFIG_DB_INVALID.CODE, HttpStatus.BAD_REQUEST, error));
        }
    }

    findByCondition(filterCondition: any): Promise<T> {
        try {
            return this.repository.findOne({ where: filterCondition });
        } catch (error) {
            console.log('findByCondition error: ', error.message);
            throw new BadRequestException(new ErrorResponse(error.message, responseMsg.CONFIG_DB_INVALID.CODE, HttpStatus.BAD_REQUEST, error));
        }
    }
    findAllByCondition(filterCondition: any): Promise<T[]> {
        try {
            return this.repository.find({ where: filterCondition });
        } catch (error) {
            console.log('findByCondition error: ', error.message);
            throw new BadRequestException(new ErrorResponse(error.message, responseMsg.CONFIG_DB_INVALID.CODE, HttpStatus.BAD_REQUEST, error));
        }
    }

    count(filterCondition: any): Promise<number> {
        try {
            return this.repository.count({ where: filterCondition });
        } catch (error) {
            console.log('findByCondition error: ', error.message);
            throw new BadRequestException(new ErrorResponse(error.message, responseMsg.CONFIG_DB_INVALID.CODE, HttpStatus.BAD_REQUEST, error));
        }
    }

    store(data: any): Promise<T> {
        try {
            return this.repository.save(data);
        } catch (error) {
            console.log('store error: ', error.message);
            throw new BadRequestException(new ErrorResponse(error.message, responseMsg.CONFIG_DB_INVALID.CODE, HttpStatus.BAD_REQUEST, error));
        }
    }

    async update(id: EntityId, data: any): Promise<T> {
        try {
            await this.repository.update(id, data);
            return this.findById(id);
        } catch (error) {
            console.log('update error: ', error.message);
            throw new BadRequestException(new ErrorResponse(error.message, responseMsg.CONFIG_DB_INVALID.CODE, HttpStatus.BAD_REQUEST, error));
        }
    }

    async delete(id: EntityId): Promise<DeleteResult> {
        try {
            return await this.repository.delete(id);
        } catch (error) {
            console.log('delete error: ', error.message);
            throw new BadRequestException(new ErrorResponse(error.message, responseMsg.CONFIG_DB_INVALID.CODE, HttpStatus.BAD_REQUEST, error));
        }
    }

    async clear() {
        try {
            await this.repository.clear();
        } catch (error) {
            console.log('findAll error: ', error.message);
            throw new BadRequestException(new ErrorResponse(error.message, responseMsg.CONFIG_DB_INVALID.CODE, HttpStatus.BAD_REQUEST, error));
        }
    }
}
