import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {CourtResponseDto} from "../../dtos/init_data/response/court.response.dto";

@Injectable({
  providedIn: 'root'
})
export class CourtService {
  private readonly baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {
  }

  getAllCourt(): Observable<CourtResponseDto[]> {
    return this.http.get<CourtResponseDto[]>(this.baseUrl + '/api/courts').pipe(
      tap(courts => {
        courts.map(court => {
          new CourtResponseDto(court)
        })
      })
    );
  }
}
