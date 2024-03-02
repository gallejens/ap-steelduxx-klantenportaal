import { doApiAction } from "@/lib/api";
import { FC, useEffect, useState } from "react";

type UserRequestListValues = {
    followId: number;
    companyName: string;
    createdOn: number;
    vatNr: string;
    contactPerson: string;
    status: string;
};

const fetchRequests = async (values: UserRequestListValues) => {
    const result = await doApiAction<{ message: string }>({
        endpoint: '/user_requests',
        method: 'GET',
        body: {
          companyName: values.companyName,
          createdOn: values.createdOn,
          vatNr: values.vatNr,
          contactPerson: values.contactPerson,
          status: values.status
        },
      });

      console.log(result)
}

export const UserRequestTable: FC = () => {
    
    return <></>
}