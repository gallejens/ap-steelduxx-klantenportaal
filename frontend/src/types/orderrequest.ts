/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Product, OrderTransportType } from './api';

export namespace OrderRequest {
  export type OrderRequestValue = {
    transportType: OrderTransportType;
    portOfDestinationCode: string;
    portOfOriginCode: string;
    products: Product[];
  };
}
