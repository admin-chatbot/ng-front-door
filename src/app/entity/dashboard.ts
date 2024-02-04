import { ClientCount } from './clientcount';
import { ServiceCount } from './servicecount';
import { ServiceLog } from './serviceLog';

export class Dashboard {

    serviceLogList!: ServiceLog[];
    serviceCallsByStatus !:Map<String, number>;
    serviceCallsByApplication !:Map<String, number>;
    serviceCallsByServiceOrUser !: Map<String, number>;
    
}
