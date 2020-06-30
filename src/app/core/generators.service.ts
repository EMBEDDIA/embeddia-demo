import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {LogService} from './log.service';
import {Observable} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {GeneratorResponse} from '../shared/types/GeneratorResponse';
import {Datasets, Languages, Locations} from '../shared/types/GeneratorOptions';

@Injectable({
  providedIn: 'root'
})
export class GeneratorsService {

  apiUrl = environment.apiNLG;

  constructor(private http: HttpClient, private logService: LogService) {
  }

  getLanguages(): Observable<Languages | HttpErrorResponse> {
    return this.http.get<Languages>(
      `${this.apiUrl}/languages/`
    ).pipe(
      tap(e => this.logService.logStatus(e, 'getLanguages')),
      catchError(this.logService.handleError<Languages>('getLanguages')));
  }

  getDatasets(language: 'fi' | 'en' | 'hr'): Observable<Datasets | HttpErrorResponse> {
    return this.http.post<Datasets>(
      `${this.apiUrl}/datasets/`, {language}
    ).pipe(
      tap(e => this.logService.logStatus(e, 'getDatasets')),
      catchError(this.logService.handleError<Datasets>('getDatasets')));
  }

  getLocations(dataset: string): Observable<Locations | HttpErrorResponse> {
    return this.http.post<Locations>(
      `${this.apiUrl}/locations/`, {dataset}
    ).pipe(
      tap(e => this.logService.logStatus(e, 'getLocations')),
      catchError(this.logService.handleError<Locations>('getLocations')));
  }

  generateText(body: any): Observable<GeneratorResponse | HttpErrorResponse> {
    return this.http.post<GeneratorResponse>(
      `${this.apiUrl}/eunlg/`, body
    ).pipe(
      tap(e => this.logService.logStatus(e, 'generateText')),
      catchError(this.logService.handleError<GeneratorResponse>('generateText')));
  }
}
