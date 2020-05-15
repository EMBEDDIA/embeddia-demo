import {Component, OnInit} from '@angular/core';
import {GeneratorsService} from '../core/generators.service';
import {HttpErrorResponse} from '@angular/common/http';
import {LogService} from '../core/log.service';
import {Choice} from '../shared/types/GeneratorsOptions';
import {GeneratorsResponse} from '../shared/types/GeneratorsResponse';

@Component({
  selector: 'app-article-generation',
  templateUrl: './article-generation.component.html',
  styleUrls: ['./article-generation.component.less']
})
export class ArticleGenerationComponent implements OnInit {

  isLoading = false;
  dataset: Choice[] = [];
  location: Choice[] = [];
  language: Choice[] = [];
  selectedLocation: string;
  selectedDataset: string;
  selectedLanguage: string;
  results: GeneratorsResponse;

  constructor(private generatorsService: GeneratorsService, private logService: LogService) {
  }

  ngOnInit(): void {
    this.generatorsService.getGeneratorsOptions().subscribe(x => {
      if (x && !(x instanceof HttpErrorResponse)) {
        this.dataset = x.actions.POST.dataset.choices;
        this.location = x.actions.POST.location.choices;
        this.language = x.actions.POST.language.choices;
      } else if (x instanceof HttpErrorResponse) {
        this.logService.messageHttpError(x);
      }
    });
  }

  submitForm() {
    this.isLoading = true;
    this.generatorsService.generateText(
      {location: this.selectedLocation, dataset: this.selectedDataset, language: this.selectedLanguage}).subscribe(x => {
      if (x && !(x instanceof HttpErrorResponse)) {
        this.results = x;
      } else if (x instanceof HttpErrorResponse) {
        this.logService.messageHttpError(x);
      }
    }, () => null, () => this.isLoading = false);
  }

}
