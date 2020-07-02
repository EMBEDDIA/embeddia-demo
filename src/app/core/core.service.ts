import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {LogService} from './log.service';
import {Observable} from 'rxjs';
import {GeneratorResponse} from '../shared/types/GeneratorResponse';
import {catchError, tap} from 'rxjs/operators';
import {Health, NLGHealth} from '../shared/types/Health';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  apiUrl = environment.apiHost + environment.apiBasePath;
  nlgUrl = environment.apiNLG;

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
}
