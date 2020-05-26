import {Component, OnInit} from '@angular/core';
import {AnalyzersService} from '../core/analyzers.service';
import {LogService} from '../core/log.service';
import {HttpErrorResponse} from '@angular/common/http';
import {UtilityFunctions} from '../shared/UtilityFunctions';

@Component({
  selector: 'app-entity-extraction',
  templateUrl: './entity-extraction.component.html',
  styleUrls: ['./entity-extraction.component.less']
})
export class EntityExtractionComponent implements OnInit {
  readonly COLORS = UtilityFunctions.COLORS;
  readonly COLORKEYS = Object.keys(this.COLORS);
  text: string;
  results: { [x: string]: any[] } = {};
  resultSource: string[];
  isLoading = false;

  constructor(private analyzersService: AnalyzersService,
              private logService: LogService) {

  }

  ngOnInit(): void {
  }

  submitForm() {
    this.isLoading = true;
    this.resultSource = [];
    this.results = {};
    this.analyzersService.analyzeKeywords({text: this.text}).subscribe(x => {
      if (x && !(x instanceof HttpErrorResponse)) {
        this.resultSource = x.analyzers;
        for (const item of this.resultSource) {
          this.results[item] = [];
        }
        if (x.entities) {
          this.populateResultData(UtilityFunctions.getDistinctByProperty(x.entities, (y) => y.entity));
        }
        if (x.tags) {
          this.populateResultData(UtilityFunctions.getDistinctByProperty(x.tags, (y) => y.tag));
        }
        console.log(this.results);
      } else if (x instanceof HttpErrorResponse) {
        this.logService.messageHttpError(x);
      }
    }, () => null, () => this.isLoading = false);
  }

  populateResultData<T extends { source: string }>(arr: T[]) {
    for (const item of arr) {
      this.results[item.source].push(item);
    }
  }
}
