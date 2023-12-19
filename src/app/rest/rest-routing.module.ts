import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../component/rest/dashboard/dashboard.component';
import { ApplicationComponent } from '../component/rest/application/application.component';

const routes: Routes = [
  {
    path:'',
    children : [
      {
        path:'dashboard',
        component:DashboardComponent
      },
      {
        path:'application',
        component:ApplicationComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RestRoutingModule { }
