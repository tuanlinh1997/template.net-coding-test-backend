import { Injectable } from '@nestjs/common';
import { isEmpty } from 'lodash';

@Injectable()
export class GlobalCacheService {
    public global: any;
    constructor() {
        this.global = {};
    }

    checkHaveVar(key: string): boolean {
        return !isEmpty(this.global[key]);
    }

    getVar(key: string): any {
        return this.global[key];
    }

    setVar(key: string, value: any): void {
        this.global[key] = value;
    }
}
