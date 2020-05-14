import { Component, OnInit } from '@angular/core';
import {AnalyzersService} from '../core/analyzers.service';
import {LogService} from '../core/log.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-entity-extraction',
  templateUrl: './entity-extraction.component.html',
  styleUrls: ['./entity-extraction.component.less']
})
export class EntityExtractionComponent implements OnInit {
  selectedAnalyzers: string[] = [];
  text: string;
  analyzers: { value: string, display_name: string }[] = [
    {
      value: 'JSI Keyword Extractor',
      display_name: 'JSI Keyword Extractor'
    },
    {
      value: 'TEXTA Hybrid Tagger',
      display_name: 'TEXTA Hybrid Tagger',
    },
    {
      value: 'TEXTA MLP',
      display_name: 'TEXTA MLP',
    }];
  results: { key: string, offensive: boolean }[] = [];
  isLoading = false;
  constructor(private analyzersService: AnalyzersService,
              private logService: LogService) {

  }

  ngOnInit(): void {
    /*    this.analyzersService.getAnalyzersOptions().subscribe(x => {
          if (x && !(x instanceof HttpErrorResponse)) {
            this.analyzers = x.actions.POST.analyzers.choices;
          } else if (x instanceof HttpErrorResponse) {
            this.logService.messageHttpError(x);
          }
        });*/
  }

  submitForm() {
    this.isLoading = true;
    this.analyzersService.analyze({analyzers: this.selectedAnalyzers, text: this.text}).subscribe(x => {
      if (x && !(x instanceof HttpErrorResponse)) {
        for (const key in x) {
          this.results.push({key, offensive: x[key].length > 0});
        }
        console.log(this.results);
      } else if (x instanceof HttpErrorResponse) {
        this.logService.messageHttpError(x);
      }
    }, () => null, () => this.isLoading = false);
  }

}
