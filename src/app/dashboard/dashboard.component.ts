import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import {UtilityFunctions} from '../shared/UtilityFunctions';
import {CoreService} from '../core/core.service';
import {environment} from '../../environments/environment';
import {HttpErrorResponse} from '@angular/common/http';
import {LogService} from '../core/log.service';
import {Field, ProjectIndex} from '../shared/types/Project';
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
  commentsOkPerecent: number | null = 0;
  monolingualOffensivePercent: number | null = 0;
  monolingualVeryOffensivePercent: number | null = 0;
  qmulOffensivePercent: number | null = 0;
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
  totalDocuments = 0;

  constructor(private changeDetectorRef: ChangeDetectorRef, private coreService: CoreService, private logService: LogService) {
  }

  @HostListener('window:resize')
  onResize() {
    this.calculateProgressBarSize();
  }

  ngOnInit(): void {
    this.coreService.getProjectIndices(+environment.projectId, environment.toolkitToken).subscribe(x => {
      if (x && !(x instanceof HttpErrorResponse)) {
        this.dataset = x;
        this.selectedDatasets = [this.dataset[0]];
        this.setDateMinMax(this.selectedDatasets);
      } else if (x) {
        this.logService.messageHttpError(x);
      }
    });
    this.calculateProgressBarSize();
  }

  // true is opened, false is closed
  datasetSelectOpenChange(val: boolean) {
    if (!val) {
      this.setDateMinMax(this.selectedDatasets);
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
    this.changeDetectorRef.markForCheck();
  }

  submitForm() {
    this.isLoading = true;
    const query = this.makeAggregationQuery(this.selectedDatasets);
    this.tags = {};
    this.monolingualVeryOffensivePercent = null;
    this.qmulOffensivePercent = null;
    this.commentsOkPerecent = null;
    this.monolingualOffensivePercent = null;
    this.coreService.search({
      query,
      indices: this.selectedDatasets.map(x => x.index)
    }, +environment.projectId, environment.toolkitToken).subscribe(x => {
      if (x && !(x instanceof HttpErrorResponse)) {
        const rootAggObj = this.navNestedAggByKey(x.aggs, 'agg_fact');
        if (rootAggObj.hasOwnProperty('buckets') && rootAggObj.buckets.length > 0) {
          rootAggObj.buckets.forEach(bucket => {
            this.tags[bucket.key] = bucket.agg_fact_val.buckets.map(y => [{
              name: `[${bucket.key}]|${y.key}`,
              value: y.fact_val_reverse.doc_count,
              extra: {factName: bucket.key, name: y.key}
            }]).flat();
          });
          this.tagsKeys = Object.keys(this.tags);
          let totalOffensive = 0;
          if (this.tagsKeys.includes('crosslingual')) {
            this.qmulOffensivePercent = Math.round(this.tags['crosslingual'][0].value / x.count * 100);
            totalOffensive += this.tags['crosslingual'][0].value;
          }
          if (this.tagsKeys.includes('monolingual')) {
            this.monolingualOffensivePercent = Math.round(this.tags['monolingual'][0].value / x.count * 100);
            totalOffensive += this.tags['monolingual'][0].value;
            this.monolingualVeryOffensivePercent = Math.round(this.tags['monolingual'][1].value / x.count * 100);
            totalOffensive += this.tags['monolingual'][1].value;
          }
          if (totalOffensive > 0) {
            this.commentsOkPerecent = 100 - Math.round(totalOffensive / x.count * 100);
          }
          this.selectedFact = this.tagsKeys;
          this.graphData = this.getSelectedFacts(this.tagsKeys, this.tags);
          this.graphData.forEach(y => {
            this.customColors.push({name: y.name, value: this.COLORS[y.extra.factName] ? this.COLORS[y.extra.factName] : '#8d8d8d'});
          });
        }
        this.totalDocuments = x.count;
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
    let split = val.split('|');
    if (split.length > 0 && split[0] === '@#!') { // make placeholder titles empty so they dont show up in barchart
      return '';
    }
    split.shift();
    split = split.join('|');

    return split;

  }

  navNestedAggByKey(aggregation: any, aggregationKey: string): any {
    if (aggregation.hasOwnProperty(aggregationKey)) {
      const aggInner = aggregation[aggregationKey];
      return this.navNestedAggByKey(aggInner, aggregationKey); // EX: agg_term: {agg_term: {buckets}}
    }
    return aggregation;
  }

  makeAggregationQuery(index: ProjectIndex[]) {
    const dateFields: Field[] = [];
    index.forEach(x => {
      const dateField = x.fields.find(y => y.type === 'date');
      if (dateField) {
        dateFields.push(dateField);
      }
    });
    const body = {
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
                must: [],
                filter: [],
                must_not: [],
                should: [],
                minimum_should_match: 1
              }
            }
          }
        }, size: 0
      }
    };
    dateFields.forEach(field => {
      // @ts-ignore
      body.query.aggs.agg_fact.filter.bool.should.push({range: {[field.path]: {gte: this.selectedRange[0]}}}, {range: {[field.path]: {lte: this.selectedRange[1]}}});
    });
    return body.query;
  }

  private setDateMinMax(index: ProjectIndex[]) {
    const dateFields: Field[] = [];
    index.forEach(x => {
      const dateField = x.fields.find(y => y.type === 'date');
      if (dateField) {
        dateFields.push(dateField);
      }
    });
    const query = {query: {aggs: {}, size: 0}};
    dateFields.forEach(field => {
      query.query.aggs[field.path] = {
        aggs: {
          min_date: {min: {field: field.path, format: 'yyyy-MM-dd'}},
          max_date: {max: {field: field.path, format: 'yyyy-MM-dd'}}
        },
        filter: {bool: {should: []}}, // if i dont put this here elastic wont like empty nested aggs, hack
      };
    });
    this.coreService.search({
      query: query.query,
      indices: this.selectedDatasets.map(x => x.index)
    }, +environment.projectId, environment.toolkitToken).subscribe(x => {
      if (!(x instanceof HttpErrorResponse) && x?.aggs) {
        const minDates: Date[] = [];
        const maxDates: Date[] = [];
        for (const key in x.aggs) {
          if (x.aggs.hasOwnProperty(key)) {
            const aggs = x.aggs[key];
            if (aggs?.min_date.hasOwnProperty('value_as_string') && aggs?.max_date.hasOwnProperty('value_as_string')) {
              minDates.push(new Date(aggs.min_date.value_as_string));
              maxDates.push(new Date(aggs.max_date.value_as_string));
            }
          }
        }
        this.selectedRange = [minDates.sort((a, b) => a.getTime() - b.getTime())[0], maxDates.sort((a, b) => b.getTime() - a.getTime())[0]];
        this.changeDetectorRef.markForCheck();
      }
    });
  }

}
