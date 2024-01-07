import { ClientCount } from './clientcount';
import { ServiceCount } from './servicecount';

export class Dashboard {
    applicationCount!:number;
    serviceCount!:number;    
    countOfSucccessCalls!: number;
    countOfFailedCalls!: number;
    topUsed10Services!: ServiceCount[];
    leastUsed10Services!: ServiceCount[];
    mostActiveClient!: ClientCount[];
    leastActiveClient!: ClientCount[];
}
