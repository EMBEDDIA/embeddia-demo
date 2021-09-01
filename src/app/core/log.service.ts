import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable, of} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {NzMessageService} from 'ng-zorro-antd';


@Injectable({
  providedIn: 'root'
})
export class LogService {
  isProduction = environment.production;

  constructor(private message: NzMessageService) {
  }

  public handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.warn(error); // log to console instead

      return of(error);
    };
  }


  public logStatus(val, msg) {
    if (!this.isProduction) {
      console.warn(msg, val);
    }
  }

  public messageHttpError(error: HttpErrorResponse, time?: number) {
    if (error.error.hasOwnProperty('detail')) {
      this.message.create('error', `${error.error.detail}`,
        {
          nzDuration: time || 3000
        });
    } else if (error.error.hasOwnProperty('non_field_errors')) {
      this.message.create('error', `${error.error.non_field_errors[0]}`,
        {
          nzDuration: time || 3000
        });
    } else if (error.error.hasOwnProperty('error')) {
      this.message.create('error', `${error.error.error}`,
        {
          nzDuration: time || 3000
        });
    } else if (error.error && typeof error.error === 'object' && !('type' in error.error)) {
      for (const element in error.error) {
        if (error.error.hasOwnProperty(element)) {
          if (typeof error.error[element] === 'string') {
            this.message.create('error', `${element}: ${error.error[element]}`,
              {
                nzDuration: time || 3000
              });
          } else if (typeof error.error[element].length === 'object') {
            this.message.create('error', `${element}: ${error.error[element][0]}`,
              {
                nzDuration: time || 3000
              });
          }
          break;
        }
      }
    } else {
      this.message.create('error', `${error.name}: ${error.status} ${error.statusText}`,
        {
          nzDuration: time || 3000
        });
    }

  }

  public createMessage(type: 'success' | 'info' | 'warning' | 'error' | 'loading', msg: string, time?: number) {
    this.message.create(type, msg, {
      nzDuration: time || 3000
    });
  }
}
