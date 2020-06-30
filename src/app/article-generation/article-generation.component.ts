import {Component, OnDestroy, OnInit} from '@angular/core';
import {GeneratorsService} from '../core/generators.service';
import {HttpErrorResponse} from '@angular/common/http';
import {LogService} from '../core/log.service';
import {Datasets, Languages, Locations} from '../shared/types/GeneratorOptions';
import {GeneratorResponse} from '../shared/types/GeneratorResponse';
import {Subject} from 'rxjs';
import {switchMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-article-generation',
  templateUrl: './article-generation.component.html',
  styleUrls: ['./article-generation.component.less']
})
export class ArticleGenerationComponent implements OnInit, OnDestroy {

  isLoading = false;
  datasets: Datasets | null;
  locations: Locations | null;
  languages: Languages | null;
  selectedLocation: string;
  selectedDataset: string;
  selectedLanguage: string;
  results: GeneratorResponse | null;
  destroyed$: Subject<boolean> = new Subject<boolean>();
  languageSelected: Subject<'fi' | 'hr' | 'en'> = new Subject<'fi' | 'hr' | 'en'>();
  datasetSelected: Subject<string> = new Subject<string>();

  constructor(private generatorsService: GeneratorsService, private logService: LogService) {
  }

  ngOnInit(): void {
    this.generatorsService.getLanguages().pipe(takeUntil(this.destroyed$)).subscribe(x => {
      if (x && !(x instanceof HttpErrorResponse)) {
        this.languages = x;
      } else {
        this.logService.messageHttpError(x);
      }
    });
    this.languageSelected.pipe(takeUntil(this.destroyed$), switchMap(x => {
      this.datasets = null;
      return this.generatorsService.getDatasets(x);
    })).subscribe(x => {
      if (x && !(x instanceof HttpErrorResponse)) {
        this.datasets = x;
      } else {
        this.logService.messageHttpError(x);
      }
    });
    this.datasetSelected.pipe(takeUntil(this.destroyed$), switchMap(x => {
      this.locations = null;
      return this.generatorsService.getLocations(x);
    })).subscribe(x => {
      if (x && !(x instanceof HttpErrorResponse)) {
        this.locations = x;
      } else {
        this.logService.messageHttpError(x);
      }
    });
  }

  submitForm() {
    this.isLoading = true;
    this.results = null;
    this.generatorsService.generateText(
      {location: this.selectedLocation, dataset: this.selectedDataset, language: this.selectedLanguage}).subscribe(x => {
      if (x && !(x instanceof HttpErrorResponse)) {
        this.results = x;
      } else if (x instanceof HttpErrorResponse) {
        this.logService.messageHttpError(x);
      }
    }, () => null, () => this.isLoading = false);
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
