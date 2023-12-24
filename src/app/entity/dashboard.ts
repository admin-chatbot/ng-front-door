export class Dashboard {
    id!:number;
    applicationCount!: number;
    serviceCount!:number;
    topUsed10Services!:object[];
    leastUsed10Services!:object[];
    mostActiveClient!:object[];
    leastActiveClient!:object[];
}