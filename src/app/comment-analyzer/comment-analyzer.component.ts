import {Component, OnDestroy, OnInit} from '@angular/core';
import {AnalyzersService} from '../core/analyzers.service';
import {LogService} from '../core/log.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Choice} from '../shared/types/AnalyzersOptions';

@Component({
  selector: 'app-hate-speech-detection',
  templateUrl: './comment-analyzer.component.html',
  styleUrls: ['./comment-analyzer.component.less']
})
export class CommentAnalyzerComponent implements OnInit, OnDestroy {
  text: string;
  analyzers: string[] = [];
  results: any = undefined;
  isLoading = false;
  destroyed$: Subject<boolean> = new Subject<boolean>();
  analyzerOptions: Choice[];
  selectedAnalyzers: string[];

  constructor(private analyzersService: AnalyzersService,
              private logService: LogService) {

  }

  ngOnInit(): void {
    this.analyzersService.getCommentAnalyzersOptions().subscribe(x => {
      if (x && !(x instanceof HttpErrorResponse)) {
        this.analyzerOptions = x.actions.POST.analyzers.choices;
      } else if (x) {
        this.logService.messageHttpError(x);
      }
    });
  }

  submitForm() {
    this.isLoading = true;
    this.results = undefined;
    this.analyzers = [];
    this.analyzersService.analyzeHateSpeech({
      text: this.text,
      analyzers: this.selectedAnalyzers
    }).pipe(takeUntil(this.destroyed$)).subscribe(x => {
      if (x && !(x instanceof HttpErrorResponse)) {
        this.results = {};
        this.analyzers = x.analyzers;
        for (const item of this.analyzers) {
          this.results[item] = [];
        }
        for (const item of x.tags) {
          this.results[item.source].push(item.tag);
        }
      } else if (x) {
        this.logService.messageHttpError(x);
      }
    }, () => null, () => this.isLoading = false);
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  selectedAnalyzersChange($event: any[]) {
    this.selectedAnalyzers = $event;
  }
}
