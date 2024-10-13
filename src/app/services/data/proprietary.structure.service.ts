import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {ProprietaryStructureDto} from "../../dtos/init_data/response/proprietary.structure.dto";

@Injectable({providedIn: 'root'})

export class ProprietaryStructureService {
  private readonly baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {}

  getAllProprietaryStructure(): Observable<ProprietaryStructureDto[]> {
    return this.http.get<ProprietaryStructureDto[]>(`${this.baseUrl}/api/proprietary-structures`).pipe(
      tap(prs => prs.map(pr => pr as ProprietaryStructureDto))
    );
  }
}
