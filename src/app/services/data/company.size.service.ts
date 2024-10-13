import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CompanySizeResponseDto} from "../../dtos/init_data/response/company.size.response.dt";

@Injectable({providedIn: 'root'})

export class CompanySizeService {
  private readonly baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getAllCompaniesSizes(): Observable<CompanySizeResponseDto[]>{
      return this.http.get<CompanySizeResponseDto[]>(`${this.baseUrl}/api/company-size`);
  }
}
