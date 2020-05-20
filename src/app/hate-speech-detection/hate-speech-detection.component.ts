import {Component, OnInit} from '@angular/core';
import {AnalyzersService} from '../core/analyzers.service';
import {LogService} from '../core/log.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-hate-speech-detection',
  templateUrl: './hate-speech-detection.component.html',
  styleUrls: ['./hate-speech-detection.component.less']
})
export class HateSpeechDetectionComponent implements OnInit {
  text: string;
  analyzers: { value: string, display_name: string }[] = [
    {
      value: 'QMUL Comment Analyzer',
      display_name: 'QMUL Hatespeech Detector'
    },
    {
      value: 'TEXTA Comment Analyzer',
      display_name: 'TEXTA Hatespeech Tagger',
    }];
  analyzersDisplay: { value: string, display_name: string }[] = [];
  results: string[] = [];
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
    this.results = [];
    this.analyzersDisplay = [];
    this.analyzersService.analyzeHateSpeech({text: this.text}).subscribe(x => {
      if (x && !(x instanceof HttpErrorResponse)) {
        this.analyzersDisplay = this.analyzers;
        this.results = x.tags.map(y => y.source);
      } else if (x instanceof HttpErrorResponse) {
        this.logService.messageHttpError(x);
      }
    }, () => null, () => this.isLoading = false);
  }

}
