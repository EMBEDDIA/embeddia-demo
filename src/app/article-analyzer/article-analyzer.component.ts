import {Component, OnDestroy, OnInit} from '@angular/core';
import {AnalyzersService} from '../core/analyzers.service';
import {LogService} from '../core/log.service';
import {HttpErrorResponse} from '@angular/common/http';
import {UtilityFunctions} from '../shared/UtilityFunctions';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {HighlightSpan} from '../shared/components/highlight/highlight.component';
import {KeywordExtractionResponse} from '../shared/types/KeywordExtractionResponse';
import {Choice} from '../shared/types/AnalyzersOptions';

interface HighlightDataFormat {
  text: string;
  texta_facts: HighlightSpan[];
  highlight: { text: string[] };
}

@Component({
  selector: 'app-entity-extraction',
  templateUrl: './article-analyzer.component.html',
  styleUrls: ['./article-analyzer.component.less']
})
export class ArticleAnalyzerComponent implements OnInit, OnDestroy {
  readonly COLORS = UtilityFunctions.COLORS;
  readonly COLORKEYS = Object.keys(this.COLORS);
  text: string;
  results: { [x: string]: any[] } = {};
  resultSource: string[];
  isLoading = false;
  language: string;
  destroyed$: Subject<boolean> = new Subject<boolean>();
  radioValue: 'Text' | 'Tags' = 'Tags';
  resultTextData: HighlightDataFormat;
  analyzerOptions: Choice[];
  selectedAnalyzers: string[];

  constructor(private analyzersService: AnalyzersService,
              private logService: LogService) {

  }

  ngOnInit(): void {
    this.analyzersService.getAnalyzersOptions().subscribe(x => {
      if (x && !(x instanceof HttpErrorResponse)) {
        this.analyzerOptions = x.actions.POST.analyzers.choices;
      } else if (x) {
        this.logService.messageHttpError(x);
      }
    });
  }

  submitForm() {
    this.isLoading = true;
    this.resultSource = [];
    this.results = {};
    this.analyzersService.analyzeKeywords({
      text: this.text,
      analyzers: this.selectedAnalyzers
    }).pipe(takeUntil(this.destroyed$)).subscribe(x => {
      if (x && !(x instanceof HttpErrorResponse)) {
        this.resultSource = x.analyzers;
        for (const item of this.resultSource) {
          this.results[item] = [];
        }
        if (x.entities) {
          this.populateResultData(x.entities);
        }
        if (x.tags) {
          this.populateResultData(x.tags);
        }
        this.language = x.language;
        this.resultTextData = this.toHighlightData(x);
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

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  private toHighlightData(val: KeywordExtractionResponse): HighlightDataFormat {
    const temp: HighlightDataFormat = {text: val.text, texta_facts: [], highlight: {text: ['']}};
    for (const entity of val.entities) {
      const regexp = new RegExp(entity.entity, 'ig');
      const matches = val.text.matchAll(regexp);
      for (const match of matches) {
        if (match.index && entity.entity) {
          temp.texta_facts.push({
            doc_path: 'text',
            spans: JSON.stringify([[match.index, match.index + entity.entity.length]]),
            fact: entity.type,
            str_val: entity.entity
          });
        }
      }
    }
    const tags = UtilityFunctions.getDistinctByProperty(val.tags, (x => x.tag.toLowerCase()));
    for (const tag of tags) {
      const regexp = new RegExp(tag.tag, 'ig');
      const matches = val.text.matchAll(regexp);
      for (const match of matches) {
        if (match.index && tag.tag) {
          temp.texta_facts.push({
            doc_path: 'text',
            spans: JSON.stringify([[match.index, match.index + tag.tag.length]]),
            fact: 'KEYWORD',
            str_val: tag.tag
          });
        }
      }
    }
    return temp;
  }

  selectedAnalyzersChange($event: any[]) {
    this.selectedAnalyzers = $event;
  }
}
