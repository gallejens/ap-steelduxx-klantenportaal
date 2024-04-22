import { type Product, type OrderTransportType } from './api';

export namespace OrderRequest {
  export type OrderRequestValue = {
    transportType: OrderTransportType;
    portOfDestinationCode: string;
    portOfOriginCode: string;
    products: Product[];
  };
}
