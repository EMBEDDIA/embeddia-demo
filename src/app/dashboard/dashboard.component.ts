import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import {UtilityFunctions} from '../shared/UtilityFunctions';
import {CoreService} from '../core/core.service';
import {environment} from '../../environments/environment';
import {HttpErrorResponse} from '@angular/common/http';
import {LogService} from '../core/log.service';
import {ProjectIndex} from '../shared/types/Project';
import {switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {newArray} from '@angular/compiler/src/util';

interface GraphData {
  name: string;
  value: number;
  extra: { factName: string },
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  readonly COLORS = UtilityFunctions.COLORS;
  strokeCap: 'round' | 'square' = 'square';
  strokeWidth = 9; // %
  blockedByModelProgressWidth = 0;
  commentsOkProgressWidth = 0;
  tags: { [key: string]: GraphData[] } = {};
  tagsKeys: string[];

  // options
  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  xAxisLabel = 'Count';
  showYAxisLabel = true;
  yAxisLabel = 'Entities & Keywords';
  selectedFact;
  graphData: GraphData[] = [];
  isLoading = false;
  selectedDatasets: ProjectIndex[] = [];
  selectedRange;
  dataset: ProjectIndex[];
  customColors: { name: string, value: string }[] = [];
  authToken = '';

  constructor(private changeDetectorRef: ChangeDetectorRef, private coreService: CoreService, private logService: LogService) {
  }

  @HostListener('window:resize')
  onResize() {
    this.calculateProgressBarSize();
  }

  ngOnInit(): void {
    this.coreService.authenticate(environment.toolkitUsername, environment.toolkitPass).pipe(switchMap(resp => {
      if (resp && !(resp instanceof HttpErrorResponse)) {
        this.authToken = resp.key;
        return this.coreService.getProjectIndices(environment.projectId, resp.key);
      } else if (resp) {
        this.logService.messageHttpError(resp);
      }
      return of(null);
    })).subscribe(x => {
      if (x && !(x instanceof HttpErrorResponse)) {
        this.dataset = x;
        this.selectedDatasets = [this.dataset[1]];
        this.setDateMinMax();
      } else if (x) {
        this.logService.messageHttpError(x);
      }
    });
    this.calculateProgressBarSize();
  }

  // true is opened, false is closed
  datasetSelectOpenChange(val: boolean) {
    if (!val) {
      this.setDateMinMax();
    }

  }

  calculateProgressBarSize() {
    const windowHeight = window.innerHeight;
    if (windowHeight <= 790) {
      this.blockedByModelProgressWidth = 88;
      this.commentsOkProgressWidth = 108;
    } else if (windowHeight <= 876) {
      this.blockedByModelProgressWidth = 100;
      this.commentsOkProgressWidth = 115;
    } else if (windowHeight <= 960) {
      this.blockedByModelProgressWidth = 128;
      this.commentsOkProgressWidth = 148;
    } else {
      this.blockedByModelProgressWidth = 148;
      this.commentsOkProgressWidth = 168;
    }
  }

  factSelectionChanged(val) {
    this.graphData = this.getSelectedFacts(val, this.tags);
    this.graphData.forEach(y => {
      this.customColors.push({name: y.name, value: this.COLORS[y.extra.factName] ? this.COLORS[y.extra.factName] : '#8d8d8d'});
    });
    console.log(this.graphData);
    this.changeDetectorRef.markForCheck();
  }

  submitForm() {
    this.isLoading = true;
    this.coreService.search({
      query: {
        aggs: {
          agg_fact: {
            aggs: {
              agg_fact: {
                nested: {path: 'texta_facts'},
                aggs: {
                  agg_fact: {
                    terms: {field: 'texta_facts.fact', size: 30},
                    aggs: {
                      top_reverse_nested: {reverse_nested: {}},
                      agg_fact_val: {
                        terms: {field: 'texta_facts.str_val', size: 30, order: {'fact_val_reverse.doc_count': 'desc'}},
                        aggs: {fact_val_reverse: {reverse_nested: {}}}
                      }
                    }
                  }
                }
              }
            },
            filter: {
              bool: {
                must: [{bool: {must: [{range: {publishDate: {gte: this.selectedRange[0]}}}, {range: {publishDate: {lte: this.selectedRange[1]}}}]}}],
                filter: [],
                must_not: [],
                should: [],
                minimum_should_match: 0
              }
            }
          }
        }, size: 0
      },
      indices: this.selectedDatasets.map(x => x.index)
    }, environment.projectId, this.authToken).subscribe(x => {
      if (x && !(x instanceof HttpErrorResponse)) {
        const rootAggObj = this.navNestedAggByKey(x.aggs, 'agg_fact');
        if (rootAggObj.hasOwnProperty('buckets') && rootAggObj.buckets.length > 0) {
          rootAggObj.buckets.forEach(bucket => {
            this.tags[bucket.key] = bucket.agg_fact_val.buckets.map(y => [{
              name: y.key,
              value: y.fact_val_reverse.doc_count,
              extra: {factName: bucket.key}
            }]).flat();
          });
          this.tagsKeys = Object.keys(this.tags);
          this.selectedFact = this.tagsKeys;
          this.graphData = this.getSelectedFacts(this.tagsKeys, this.tags);
          this.graphData.forEach(y => {
            this.customColors.push({name: y.name, value: this.COLORS[y.extra.factName] ? this.COLORS[y.extra.factName] : '#8d8d8d'});
          });
          console.log(this.graphData);
        }
      }
      this.changeDetectorRef.markForCheck();
    });
    this.isLoading = false;
  }

  getSelectedFacts(tagsKeys: string[], data: { [key: string]: GraphData[] }): GraphData[] {
    // placeholder title hack so the barchart bars dont autoscale when there are less items
    const temp: GraphData[] = Array(30).fill('').map((_, i) => [{value: 0, name: `@#! ${i}`, extra: {factName: ''}}]).flat();
    this.customColors = [];
    for (const key in data) {
      if (tagsKeys.includes(key) && data[key].length > 0) {
        temp.push(...data[key]);
      }
    }
    temp.sort((a, b) => (a.value < b.value) ? 1 : -1);
    return temp.slice(0, 30);
  }

  formatYAxisTicks(val) {
    const split = val.split(' ');
    let stringValue = '';
    if (split.length > 0 && split[0] === '@#!') { // make placeholder titles empty so they dont show up in barchart
      return '';
    }
    for (const item of split) {
      if (stringValue.length + item.length < 16) {
        stringValue += item + (split.length !== 1 ? ' ' : '');
      } else if (stringValue === '') {
        return split[0].substr(0, 16) + (split.length > 1 ? '...' : '');
      }
    }
    return val.length === stringValue.trim().length ? stringValue : stringValue + '...';
  }

  navNestedAggByKey(aggregation: any, aggregationKey: string): any {
    if (aggregation.hasOwnProperty(aggregationKey)) {
      const aggInner = aggregation[aggregationKey];
      return this.navNestedAggByKey(aggInner, aggregationKey); // EX: agg_term: {agg_term: {buckets}}
    }
    return aggregation;
  }

  private setDateMinMax() {
    this.coreService.search({
      query: {
        aggs: {
          min_date: {min: {field: 'publishDate', format: 'yyyy-MM-dd'}},
          max_date: {max: {field: 'publishDate', format: 'yyyy-MM-dd'}}
        }, size: 0
      },
      indices: this.selectedDatasets.map(x => x.index)
    }, environment.projectId, this.authToken).subscribe(x => {
      if (!(x instanceof HttpErrorResponse) && x?.aggs) {
        const aggs = x.aggs;
        if (aggs?.min_date.hasOwnProperty('value_as_string') && aggs?.max_date.hasOwnProperty('value_as_string')) {
          this.selectedRange = [new Date(aggs.min_date.value_as_string), new Date(aggs.max_date.value_as_string)];
        }
        this.changeDetectorRef.markForCheck();
      }
    });
  }

}
