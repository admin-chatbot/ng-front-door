import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from '../component/auth/sign-in/sign-in.component';
import { SignUpComponent } from '../component/auth/sign-up/sign-up.component';
import { SignupSuccessComponent } from '../component/auth/signup-success/signup-success.component';
import { ForgotPasswordComponent } from '../component/auth/forgot-password/forgot-password.component';

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
      },
      {
        path:'signup-success',
        component:SignupSuccessComponent
      },
      {
        path:'forgot',
        component:ForgotPasswordComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
