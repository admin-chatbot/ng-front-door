import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FullLayoutComponent } from './layout/full-layout/full-layout.component';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { SignInComponent } from './component/auth/sign-in/sign-in.component';
import { SignUpComponent } from './component/auth/sign-up/sign-up.component';
import { DashboardComponent } from './component/rest/dashboard/dashboard.component';
import { ApplicationComponent } from './component/rest/application/application.component';
import { PageNotFoundComponent } from './component/rest/page-not-found/page-not-found.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { ViewApplicationComponent } from './component/rest/view-application/view-application.component';
import { BillingComponent } from './component/rest/billing/billing.component'; 
import { SignupSuccessComponent } from './component/auth/signup-success/signup-success.component';
import { ServiceComponent } from './component/rest/service/service.component';
import { ViewServiceComponent } from './component/rest/view-service/view-service.component'; 
import { AutoDiscoverComponent } from './component/rest/auto-discover/auto-discover.component';
import { ServiceParameterComponent } from './component/rest/service-parameter/service-parameter.component';
import { UserComponent } from './component/rest/user/user.component';
import { ClientComponent } from './component/rest/client-details/client-details.component';
import { ForgotPasswordComponent } from './component/auth/forgot-password/forgot-password.component';
import { ServiceLogComponent } from './component/rest/service-log/service-log.component'; 


@NgModule({
  declarations: [
    AppComponent,
    FullLayoutComponent,
    ContentLayoutComponent,
    SignInComponent,
    SignUpComponent,
    DashboardComponent,
    ApplicationComponent,
    PageNotFoundComponent,
    ViewApplicationComponent,
    BillingComponent, 
    SignupSuccessComponent,
    ServiceComponent,
    ViewServiceComponent,
    AutoDiscoverComponent,
    ServiceParameterComponent,
    UserComponent,
    ClientComponent,
    ForgotPasswordComponent,
    ServiceLogComponent 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
