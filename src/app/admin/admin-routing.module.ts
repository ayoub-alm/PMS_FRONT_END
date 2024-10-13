import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {IndexComponent} from "./index/index.component";
import {BankComponent} from "../init-data/bank/bank.component";
import {CompaniesComponent} from "./companies/companies.component";
import {CompanyShowComponent} from "./companies/company-show/company-show.component";

const routes: Routes = [
  { path: '', component: IndexComponent ,
    children:[
      { path: 'banks', component: BankComponent },
      { path: 'companies', component: CompaniesComponent },
      { path: 'companies/:id', component: CompanyShowComponent },
    ]},
  // { path: 'banks', component: BankComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
