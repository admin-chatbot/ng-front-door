import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../component/rest/dashboard/dashboard.component';
import { ApplicationComponent } from '../component/rest/application/application.component';
import { ViewApplicationComponent } from '../component/rest/view-application/view-application.component';
import { BillingComponent } from '../component/rest/billing/billing.component'; 
import { ServiceComponent } from '../component/rest/service/service.component'; 
import { ViewServiceComponent } from '../component/rest/view-service/view-service.component';
import { AutoDiscoverComponent } from '../component/rest/auto-discover/auto-discover.component';
import { ServiceParameterComponent } from '../component/rest/service-parameter/service-parameter.component';
import { ClientComponent } from '../component/rest/client-details/client-details.component';
import { UserComponent } from '../component/rest/user/user.component';
import { ServiceLogComponent } from '../component/rest/service-log/service-log.component'; 

const routes: Routes = [
  {
    path:'',
    children : [
      {
        path:'dashboard',
        component:DashboardComponent
      },
      {
        path:'application/add',
        component:ApplicationComponent
      },
      {
        path:'application/view',
        component:ViewApplicationComponent
      },
      {
        path:'billing',
        component:BillingComponent
      }, 
      {
        path:'service',
        component:ServiceComponent
      },
      {
        path:'parameter',
        component:ServiceParameterComponent
      }, 
      {
        path:'auto/discover',
        component:AutoDiscoverComponent
      },
      {
        path:'client',
        component:ClientComponent
      },
      {
        path:'user',
        component:UserComponent
      },
      {
        path:'service/log',
        component:ServiceLogComponent
      }     
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RestRoutingModule { }
