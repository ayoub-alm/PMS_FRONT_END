import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {DepartmentService} from "./services/data/department.service";
import {BankService} from "./services/data/bank.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers:[DepartmentService,BankService],
})
export class AppComponent {
  title = 'achtas_front';
}
