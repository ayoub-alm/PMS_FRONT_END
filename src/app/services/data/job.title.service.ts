import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {CompanySizeResponseDto} from "../../dtos/init_data/response/company.size.response.dt";
import {JobTitleResponseDto} from "../../dtos/init_data/response/job.title.response.dto";
import {TitleResponseDto} from "../../dtos/init_data/response/title.response.dto";

@Injectable({providedIn: 'root'})

export class JobTitleService {
  private readonly baseUrl: string = environment.baseUrl;
  constructor(private readonly http: HttpClient) {}

  getAllJobTitles(): Observable<JobTitleResponseDto[]>{
    return this.http.get<JobTitleResponseDto[]>(`${this.baseUrl}/api/job-titles`).pipe(
      tap((jobTitles: JobTitleResponseDto[]) => {
        jobTitles.map(title => { new JobTitleResponseDto(title); })
      })
    );
  }
}
