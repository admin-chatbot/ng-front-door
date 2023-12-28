export class ServiceParameter {
    createdTimestamp!: string;
    modifiedTimestamp!: string;
    id!: number;
    serviceId!: number;
    name!: string;
    description!: string;
    required!: boolean;
    type!: string;
    paramType!: string;
    in!: string;
    value!: string;
    jsonFormat!: string;
    questionToGetInput!: string;
    questionAsked!:boolean;
}