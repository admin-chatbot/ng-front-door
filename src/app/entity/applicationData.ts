import { ServiceData } from "./serviceData";
import { ServiceLog } from "./serviceLog";
import { ServiceLogs } from "./serviceLogs";

export class ApplicationData {
    application!:string;
    data!:ServiceData[];
    success!:number;
    fail!:number;
}