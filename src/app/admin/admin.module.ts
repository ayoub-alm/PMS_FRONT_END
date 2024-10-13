import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import {TokenInterceptor} from "../services/xhrInterprter";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {MatLabel} from "@angular/material/form-field";
import {TitleService} from "../services/data/Title.service";
import {ProjectService} from "../services/project.service";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatLabel,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    TitleService,
    ProjectService
  ],
})
export class AdminModule { }
