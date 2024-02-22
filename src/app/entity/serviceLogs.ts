import { Daily } from "./daily";
import { Monthly } from "./monthly";
import { Weekly } from "./weekly";

export class ServiceLogs{
    Daily!:Daily[];
    Weekly!:Weekly[]
    Monthly!:Monthly[];
    success!:number;
    fail!:number;

}