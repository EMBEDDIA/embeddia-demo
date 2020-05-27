import {Component, OnInit} from '@angular/core';
import {AnalyzersService} from '../core/analyzers.service';
import {LogService} from '../core/log.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-hate-speech-detection',
  templateUrl: './comment-analyzer.component.html',
  styleUrls: ['./comment-analyzer.component.less']
})
export class CommentAnalyzerComponent implements OnInit {
  text: string;
  analyzers: string[] = [];
  results: any = {};
  isLoading = false;

  constructor(private analyzersService: AnalyzersService,
              private logService: LogService) {

  }

  ngOnInit(): void {
  }

  submitForm() {
    this.isLoading = true;
    this.results = {};
    this.analyzers = [];
    this.analyzersService.analyzeHateSpeech({text: this.text}).subscribe(x => {
      if (x && !(x instanceof HttpErrorResponse)) {
        this.analyzers = x.analyzers;
        for (const item of this.analyzers) {
          this.results[item] = [];
        }
        for (const item of x.tags) {
          this.results[item.source].push(item.tag);
        }
      } else if (x instanceof HttpErrorResponse) {
        this.logService.messageHttpError(x);
      }
    }, () => null, () => this.isLoading = false);
  }

}
