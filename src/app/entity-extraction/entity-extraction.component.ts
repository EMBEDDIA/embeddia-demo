import {Component, OnInit} from '@angular/core';
import {AnalyzersService} from '../core/analyzers.service';
import {LogService} from '../core/log.service';
import {HttpErrorResponse} from '@angular/common/http';
import {HYBRID, JSI, MLP} from '../shared/types/KeywordExtractionResponse';
import {UtilityFunctions} from '../shared/UtilityFunctions';

@Component({
  selector: 'app-entity-extraction',
  templateUrl: './entity-extraction.component.html',
  styleUrls: ['./entity-extraction.component.less']
})
export class EntityExtractionComponent implements OnInit {
  readonly COLORS = {
    ORG: '#b71c1c',
    PER: '#880e4f',
    GPE: '#4a148c',
    LOC: '#311b92',
    ADDR: '#0d47a1',
    COMPANY: '#006064',
    PHO: '#1b5e20',
    EMAIL: '#3e2723',
    KEYWORD: '#263238'
  };
  readonly COLORKEYS = Object.keys(this.COLORS);
  selectedAnalyzers: string[] = [];
  text: string;
  readonly JSI = 'JSI Keyword Extractor';
  readonly HYBRID = 'TEXTA Hybrid Tagger';
  readonly MLP = 'TEXTA MLP';
  analyzers: { value: string, display_name: string }[] = [
    {
      value: this.JSI,
      display_name: this.JSI
    },
    {
      value: this.HYBRID,
      display_name: this.HYBRID,
    },
    {
      value: this.MLP,
      display_name: this.MLP,
    }];
  results: { [x: string]: JSI[] | HYBRID[] | any[] } = {};
  resultKeys;
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
    this.analyzersService.analyzeKeywords({analyzers: this.selectedAnalyzers, text: this.text}).subscribe(x => {
      if (x && !(x instanceof HttpErrorResponse)) {
        for (const key in x) {
          if (x.hasOwnProperty(key)) {
            const accessor = x[key];
            if (this.isMLP(accessor)) {
              this.results[this.MLP] = UtilityFunctions.getDistinctByProperty(accessor.texta_facts, ((y) => y.str_val));
            } else if (this.isHYBRID(accessor)) {
              this.results[this.HYBRID] = accessor;
            } else if (this.isJSI(accessor)) {
              this.results[this.JSI] = accessor;
            }
          }
        }
        this.resultKeys = Object.keys(this.results);
      } else if (x instanceof HttpErrorResponse) {
        this.logService.messageHttpError(x);
      }
    }, () => null, () => this.isLoading = false);
  }

  isMLP(val: JSI[] | MLP | HYBRID[]): val is MLP {
    return (val as MLP).texta_facts !== undefined;
  }

  isJSI(val: JSI[] | MLP | HYBRID[]): val is JSI[] {
    return (val as JSI[]).length > 0 && val[0].tag !== undefined;
  }

  isHYBRID(val: JSI[] | MLP | HYBRID[]): val is HYBRID[] {
    return (val as HYBRID[]).length > 0 && val[0].probability !== undefined;
  }
}
