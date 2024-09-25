import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InitDataRoutingModule } from './init-data-routing.module';
import {BankService} from "../services/data/bank.service";
import {HttpClientModule} from "@angular/common/http";
import {BankComponent} from "./bank/bank.component";


@NgModule({
  imports: [
    CommonModule,
    InitDataRoutingModule,
    HttpClientModule
  ],
  providers:[BankService]
})
export class InitDataModule { }
