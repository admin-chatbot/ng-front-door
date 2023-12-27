
import { ResponseForInvalidRequest } from "./responseForInvalidRequest";
import { ServiceParameter } from "./serviceParameters";

 

export class Service {
    createdTimestamp!: string;
    modifiedTimestamp!: string;
    id!: string;
    endpoint!: string;
    keyword!: string;
    method!: string;
    name!: string;
    summary!: string;
    authorization!: string;
    responseType!: string [];
    requestType!: string [];
    responseForInvalidRequest!: ResponseForInvalidRequest[];
    clientId!: number;
    applicationId!: number;
    botResponseTemplate!: string;
    status!: string;
    responseSchema!: string;
    serviceParameters!:ServiceParameter [] 
}