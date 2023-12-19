import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from '../component/auth/sign-in/sign-in.component';
import { SignUpComponent } from '../component/auth/sign-up/sign-up.component';

const routes: Routes = [
  {
    path:'',
    children : [
      {
        path:'signin',
        component:SignInComponent
      },
      {
        path:'signup',
        component:SignUpComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
