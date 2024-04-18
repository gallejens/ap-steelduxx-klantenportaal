/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Product, OrderTransportType } from './api';

export namespace NewOrder {
  export type OrderValue = {
    referenceCode: string;
    transportType: OrderTransportType;
    portOfDestinationCode: string;
    products: Product[];
  };
}
