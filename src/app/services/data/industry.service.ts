import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {CompanySizeResponseDto} from "../../dtos/init_data/response/company.size.response.dt";
import {IndustryResponseDto} from "../../dtos/init_data/response/industry.response.dt";

@Injectable({
  providedIn: 'root'
})

export class IndustryService {
  private readonly baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {}

  getAllIndustries(): Observable<IndustryResponseDto[]> {
    return this.http.get<IndustryResponseDto[]>(`${this.baseUrl}/api/industries`);
  }
}
