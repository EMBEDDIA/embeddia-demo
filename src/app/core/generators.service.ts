import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {LogService} from './log.service';
import {Observable} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {GeneratorsOptions} from '../shared/types/GeneratorsOptions';
import {GeneratorsResponse} from '../shared/types/GeneratorsResponse';

@Injectable({
  providedIn: 'root'
})
export class GeneratorsService {

  apiUrl = environment.apiHost + environment.apiBasePath;

  constructor(private http: HttpClient, private logService: LogService) {
  }

  getGeneratorsOptions(): Observable<GeneratorsOptions | HttpErrorResponse> {
    return this.http.options<GeneratorsOptions>(
      `${this.apiUrl}/generators/`
    ).pipe(
      tap(e => this.logService.logStatus(e, 'getGeneratorsOptions')),
      catchError(this.logService.handleError<GeneratorsOptions>('getGeneratorsOptions')));
  }

  generateText(body: any): Observable<GeneratorsResponse | HttpErrorResponse> {
    return this.http.post<GeneratorsResponse>(
      `${this.apiUrl}/generators/`, body
    ).pipe(
      tap(e => this.logService.logStatus(e, 'generateText')),
      catchError(this.logService.handleError<GeneratorsResponse>('generateText')));
  }
}
