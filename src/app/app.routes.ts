import { Routes } from '@angular/router';
import {BankComponent} from "./init-data/bank/bank.component";
import {AppComponent} from "./app.component";


export const routes: Routes = [
  {path:"", component:AppComponent},
  {path:"init-data", loadChildren:()=> import('./init-data/init-data.module').then(m => m.InitDataModule)},

];
