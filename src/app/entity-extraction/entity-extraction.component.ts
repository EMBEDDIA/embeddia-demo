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
  readonly JSI = 'JSI Keyword Analyzer';
  readonly HYBRID = 'TEXTA Hybrid Tagger';
  readonly MLP = 'MLP';
  analyzers: { value: string, display_name: string }[] = [
    {
      value: this.JSI,
      display_name: this.JSI
    },
    {
      value: this.MLP,
      display_name: 'TEXTA ' + this.MLP,
    },
    {
      value: this.HYBRID,
      display_name: this.HYBRID,
    }];
  results: { [x: string]: any[] } = {};
  resultKeys: { value: string, display_name: string }[];
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
    this.results = {};
    this.resultKeys = this.analyzers;
    this.analyzersService.analyzeKeywords({text: this.text}).subscribe(x => {
      if (x && !(x instanceof HttpErrorResponse)) {
        if (x.entities) {
          this.results[this.MLP] = UtilityFunctions.getDistinctByProperty(x.entities, (y) => y.entity);
        }
        if (x.tags) {
          this.results[this.JSI] = UtilityFunctions.getDistinctByProperty(x.tags.filter(y => y.source === this.JSI), (y) => y.tag);
          this.results[this.HYBRID] = UtilityFunctions.getDistinctByProperty(x.tags.filter(y => y.source === this.HYBRID), (y) => y.tag);
        }
        console.log(this.results);
      } else if (x instanceof HttpErrorResponse) {
        this.logService.messageHttpError(x);
      }
    }, () => null, () => this.isLoading = false);
  }
}
