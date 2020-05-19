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
  selectedAnalyzers: string[] = [];
  text: string;
  analyzers: { value: string, display_name: string }[] = [
    {
      value: 'QMUL Hatespeech Detector',
      display_name: 'QMUL Hatespeech Detector'
    },
    {
      value: 'TEXTA Hatespeech Tagger',
      display_name: 'TEXTA Hatespeech Tagger',
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
    this.results = [];
    this.analyzersService.analyzeHateSpeech({analyzers: this.selectedAnalyzers, text: this.text}).subscribe(x => {
      if (x && !(x instanceof HttpErrorResponse)) {
        for (const key in x) {
          if (x.hasOwnProperty(key)) {
            this.results.push({key, offensive: x[key].length > 0});
          }
        }
      } else if (x instanceof HttpErrorResponse) {
        this.logService.messageHttpError(x);
      }
    }, () => null, () => this.isLoading = false);
  }

}
