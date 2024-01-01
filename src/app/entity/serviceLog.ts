import { ServiceParameter } from "./serviceParameters";

export class ServiceLog {
    createdTimestamp!: string;
    modifiedTimestamp!: string;
    id!: number;
    serviceEndpoint!: string;
    serviceName!: string;
    method!: string;
    status!: string;
    client!: number;
    application!: number;
    logDate!: string;
    response!: string;
    parameters!:ServiceParameter[];
}