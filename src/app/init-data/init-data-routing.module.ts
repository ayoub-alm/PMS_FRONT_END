import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BankComponent} from "./bank/bank.component";
import {IndexComponent} from "../admin/index/index.component";

const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'banks', component: BankComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InitDataRoutingModule { }
