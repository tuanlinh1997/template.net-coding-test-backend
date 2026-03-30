import { SetMetadata } from '@nestjs/common';

export const ROUTE_INFO_METADATA = 'routeInfo';

export const RouteInfo = (info: any) => SetMetadata(ROUTE_INFO_METADATA, info);
