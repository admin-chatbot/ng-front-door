import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../component/rest/dashboard/dashboard.component';
import { ApplicationComponent } from '../component/rest/application/application.component';
import { ViewApplicationComponent } from '../component/rest/view-application/view-application.component';
import { BillingComponent } from '../component/rest/billing/billing.component';
import { ServiceComponent } from '../component/rest/service/service.component'; 

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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RestRoutingModule { }
