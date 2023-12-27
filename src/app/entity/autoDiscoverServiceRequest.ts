import { SelectedService } from "./selectedService";

export class AutoDiscoverServiceRequest {
    url!:string
    serviceId!:number;
    applicationId!:number;
    autoDiscoverServiceRequestBodies!:SelectedService[];                                                    
}