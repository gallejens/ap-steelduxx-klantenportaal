export namespace UserRequest {
  export type UserRequestValue = {
    companyName: string;
    country: string;
    email: string;
    phoneNr: string;
    vatNr: string;
    postalCode: string;
    district: string;
    street: string;
    streetNr: string;
    boxNr: string;
    extraInfo: string;
    firstName: string;
    lastName: string;
    status: string;
  };

  export type UserRequestFormValues = {
    companyName: string;
    country: string;
    phoneNr: string;
    vatNr: string;
    postalCode: string;
    district: string;
    street: string;
    streetNr: string;
    boxNr: string;
    extraInfo: string;
    firstName: string;
    lastName: string;
    email: string;
    createdOn: number;
  };

  export type UserRequestApproveValues = {
    referenceCode: string;
  };

  export type UserRequestDenyValues = {
    denyMessage: string;
  };
}
