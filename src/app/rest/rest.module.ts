import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RestRoutingModule } from './rest-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RestRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class RestModule { }
