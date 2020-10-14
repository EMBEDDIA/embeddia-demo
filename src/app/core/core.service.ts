import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {LogService} from './log.service';
import {Observable} from 'rxjs';
import {GeneratorResponse} from '../shared/types/GeneratorResponse';
import {catchError, tap} from 'rxjs/operators';
import {Health, NLGHealth} from '../shared/types/Health';
import {SearchByQueryResponse} from '../shared/types/SearchByQueryResponse';
import {ProjectIndex} from '../shared/types/Project';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  apiUrl = environment.apiHost + environment.apiBasePath;
  nlgUrl = environment.apiNLG;
  toolkitUrl = environment.apiHostTK + environment.apiBasePathTK;


  constructor(private http: HttpClient, private logService: LogService) {
  }

  getHealth(): Observable<Health | HttpErrorResponse> {
    return this.http.get<Health>(
      `${this.apiUrl}/health/`
    ).pipe(
      tap(e => this.logService.logStatus(e, 'getHealth')),
      catchError(this.logService.handleError<Health>('getHealth')));
  }

  getNLGHealth(): Observable<NLGHealth | HttpErrorResponse> {
    return this.http.get<NLGHealth>(
      `${this.nlgUrl}/health/`
    ).pipe(
      tap(e => this.logService.logStatus(e, 'getHealth')),
      catchError(this.logService.handleError<NLGHealth>('getHealth')));
  }

  search(body: unknown, projectId: number, authToken: string): Observable<SearchByQueryResponse | HttpErrorResponse> {
    return this.http.post<SearchByQueryResponse>(`${this.toolkitUrl}/projects/${projectId}/search_by_query/`, body, {
      headers: {Authorization: 'Token ' + authToken}
    }).pipe(
      tap(e => this.logService.logStatus(e, 'search')),
      catchError(this.logService.handleError<SearchByQueryResponse>('search')));
  }

  getProjectIndices(id: number, authToken: string): Observable<ProjectIndex[] | HttpErrorResponse> {
    return this.http.get<ProjectIndex[]>(
      `${this.toolkitUrl}/projects/${id}/get_fields/`, {
        headers: {Authorization: 'Token ' + authToken}
      }
    ).pipe(
      tap(e => this.logService.logStatus(e, 'getProjectIndices')),
      catchError(this.logService.handleError<ProjectIndex[]>('getProjectIndices')));
  }

  authenticate(name: string, pass: string): Observable<{ key: string } | HttpErrorResponse> {
    const body = {username: name, password: pass};
    return this.http.post<{ key: string }>(
      `${this.toolkitUrl}/rest-auth/login/`,
      body).pipe(tap(e => this.logService.logStatus(e, 'authenticate')),
      catchError(this.logService.handleError<{ key: string }>('authenticate')));
  }
}
