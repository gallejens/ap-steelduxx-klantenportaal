export type OrderState =
  | 'SAILING'
  | 'PLANNED'
  | 'CREATED'
  | 'ARRIVED'
  | 'CLOSED'
  | 'LOADED';

export type OrderTransportType = 'IMPORT' | 'EXPORT';

export type Order = {
  referenceNumber: string; // ex: "2646607000",
  customerReferenceNumber: string; // ex: "SRL/BHJ/EXP/PI-154",
  state: OrderState;
  transportType: OrderTransportType;
  portOfOriginCode: string; // ex: "INMUN",
  portOfOriginName: string; // ex: "Mundra, India",
  portOfDestinationCode: string; // ex: "BEANR",
  portOfDestinationName: string; // ex: "Antwerp, Belgium",
  shipName: string; // ex: "EDISON",
  ets: string | null; // ex: "07-03-2024 11:58",
  ats: string | null; // ex: "07-03-2024 23:58",
  eta: string | null; // ex: "27-03-2024 11:58",
  ata: string | null; // ex: null
  totalWeight: number; // ex: 57960000,
  totalContainers: number; // ex: 4,
};

export type OrderDetails = {
  referenceNumber: string; // ex: "2646607000",
  customerReferenceNumber: string; // ex: "SRL/BHJ/EXP/PI-154",
  state: OrderState;
  transportType: OrderTransportType;
  portOfOriginCode: string; // ex: "INMUN",
  portOfOriginName: string; // ex: "Mundra, India",
  portOfDestinationCode: string; // ex: "BEANR",
  portOfDestinationName: string; // ex: "Antwerp, Belgium",
  shipName: string; // ex: "EDISON",
  shipIMO: string; // ex: "9463011",
  shipMMSI: string; // ex: "235082896",
  shipType: string; // ex: "Container Ship",
  ets: string | null; // ex: "07-03-2024 11:58",
  ats: string | null; // ex: "07-03-2024 23:58",
  eta: string | null; // ex: "27-03-2024 11:58",
  ata: string | null; // ex: null
  preCarriage: string; // ex: "RAIL",
  estimatedTimeCargoOnQuay: string; // ex: "13-03-2024 17:12",
  actualTimeCargoLoaded: string; // ex: "17-03-2024 17:12",
  billOfLadingDownloadLink: string | null; // ex: "/document/download/2646607000/bl"
  packingListDownloadLink: string | null; // ex: "/document/download/2646607000/packing",
  customsDownloadLink: string | null; // ex: "/document/download/2646607000/customs",
  products: Product[];
};

export type Product = {
  hsCode: string; // ex "73063090",
  name: string; // ex: "Galvanized steel pipes",
  quantity: number; // ex: 15,
  weight: number; // ex: 14328000,
  containerNumber: string | null; // ex: "OOCU7396492",
};

export type UserRequestStatus = 'PENDING' | 'APPROVED' | 'DENIED';

export type UserRequest = {
  followId: number;
  companyName: string;
  createdOn: number;
  vatNr: string;
  firstName: string;
  lastName: string;
  denyMessage: string;
  status: UserRequestStatus;
};
