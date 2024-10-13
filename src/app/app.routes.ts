import { Routes } from '@angular/router';

import {LoginComponent} from "./login/login.component";


export const routes: Routes = [
  {path:"", component:LoginComponent},
  {path:"login", component:LoginComponent},
  {path:"init-data", loadChildren:()=> import('./init-data/init-data.module').then(m => m.InitDataModule)},
  {path:"admin", loadChildren:()=> import('./admin/admin.module').then(m => m.AdminModule)},

];
