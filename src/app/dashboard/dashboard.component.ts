import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import {UtilityFunctions} from '../shared/UtilityFunctions';

interface GraphData {
  name: string;
  value: number;
  extra: { date: Date };
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
  tags: { GPE: GraphData[], LOC: GraphData[], ORG: GraphData[], KEYWORD: GraphData[] } = {
    GPE: [],
    LOC: [],
    ORG: [],
    KEYWORD: [],
  };
  tagsKeys = Object.keys(this.tags);

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
  selectedDataset: string;
  selectedRange;
  dataset = [{value: 'test', display_name: 'test2'}];
  customColors: { name: string, value: string }[] = [];
  KEYWORDVALS = [
    {
      key: 'Нарва',
      doc_count: 15
    },
    {
      key: 'Нарва-Йыэсуу',
      doc_count: 15
    },
    {
      key: 'Пярну',
      doc_count: 15
    },
    {
      key: 'Тарту',
      doc_count: 15
    },
    {
      key: 'Таллинн',
      doc_count: 14
    },
    {
      key: 'USA',
      doc_count: 10
    },
    {
      key: 'Baltic',
      doc_count: 8
    },
    {
      key: 'Donald Trump',
      doc_count: 8
    },
    {
      key: 'ФК "Пярну"',
      doc_count: 6
    },
    {
      key: 'NATO',
      doc_count: 3
    }
  ];
  GPEVALS =  [
    {
      key: 'Estonia',
      doc_count: 40
    },
    {
      key: 'Sweden',
      doc_count: 13
    },
    {
      key: 'Russia',
      doc_count: 11
    },
    {
      key: 'Ukraine',
      doc_count: 11
    },
    {
      key: 'Syria',
      doc_count: 10
    },
    {
      key: 'Turkey',
      doc_count: 7
    },
    {
      key: 'Italy',
      doc_count: 6
    },
    {
      key: 'Tallinn',
      doc_count: 6
    },
    {
      key: 'US',
      doc_count: 6
    },
    {
      key: 'Greece',
      doc_count: 5
    }
  ];
  LOCVALS = [
    {
      key: 'Europe',
      doc_count: 32
    },
    {
      key: 'Mount Kimbie',
      doc_count: 5
    },
    {
      key: 'Baltic',
      doc_count: 4
    },
    {
      key: 'Atlantic',
      doc_count: 2
    },
    {
      key: 'Earth',
      doc_count: 2
    },
    {
      key: 'the Baltic Sea',
      doc_count: 2
    },
    {
      key: 'Baltics',
      doc_count: 1
    },
    {
      key: 'Cypress Hill',
      doc_count: 1
    },
    {
      key: 'East',
      doc_count: 1
    },
    {
      key: 'Götland',
      doc_count: 1
    }
  ];
  ORGVALS = [
    {
      key: 'EU',
      doc_count: 63
    },
    {
      key: 'Baltic Live Cam',
      doc_count: 22
    },
    {
      key: 'Commission',
      doc_count: 19
    },
    {
      key: 'Holy Motors',
      doc_count: 9
    },
    {
      key: 'NATO',
      doc_count: 9
    },
    {
      key: '@realDonaldTrump',
      doc_count: 8
    },
    {
      key: '@ABC',
      doc_count: 7
    },
    {
      key: 'ABC News',
      doc_count: 7
    },
    {
      key: 'Grete Šadeiko (@gretesadeiko',
      doc_count: 5
    },
    {
      key: 'Islam',
      doc_count: 5
    }
  ];
  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }

  @HostListener('window:resize')
  onResize() {
    this.calculateProgressBarSize();
  }

  ngOnInit(): void {
    for (let f = 0; f < 10; f++) {
      this.tags.GPE.push({
        name: this.GPEVALS[f].key, value: this.GPEVALS[f].doc_count, extra: {date: this.randomDate(new Date(2012, 0, 1), new Date())}
      });
      this.customColors.push({name: this.GPEVALS[f].key, value: this.COLORS.PER});
      const keyName = this.ORGVALS[f].key;
      this.tags.ORG.push({
        name: keyName, value: this.ORGVALS[f].doc_count, extra: {date: this.randomDate(new Date(2012, 0, 1), new Date())}
      });
      this.customColors.push({name: keyName, value: this.COLORS.ORG});
      const locName = this.LOCVALS[f].key;
      this.tags.LOC.push({
        name: locName,
        value: this.LOCVALS[f].doc_count, extra: {date: this.randomDate(new Date(2012, 0, 1), new Date())}
      });
      this.customColors.push({name: locName, value: this.COLORS.LOC});

      const keyWordName = this.KEYWORDVALS[f].key;
      this.tags.KEYWORD.push({
        name: keyWordName,
        value: this.KEYWORDVALS[f].doc_count, extra: {date: this.randomDate(new Date(2012, 0, 1), new Date())}
      });
      this.customColors.push({name: keyWordName, value: this.COLORS.KEYWORD});
    }
    this.selectedDataset = this.dataset[0].value;
    this.selectedRange = [new Date(2012, 0, 1), new Date()];
    this.calculateProgressBarSize();

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

  getSelectedFacts(facts, dateRange: [Date, Date], data): GraphData[] {
    const temp: GraphData[] = [];
    for (const key of facts) {
      if (data[key]) {
        temp.push(...data[key].filter(y => y.extra.date.getTime() >= dateRange[0].getTime() && y.extra.date.getTime() <= dateRange[1].getTime()));
      }
    }
    temp.sort((a, b) => (a.value < b.value) ? 1 : -1);
    return temp;
  }

  factSelectionChanged(val) {
    this.graphData = this.getSelectedFacts(val, this.selectedRange, this.tags);
  }

  submitForm() {
    this.isLoading = true;
    this.selectedFact = ['GPE', 'LOC', 'ORG', 'KEYWORD'];
    this.graphData = this.getSelectedFacts(this.selectedFact, this.selectedRange, this.tags);
    this.isLoading = false;
  }

  formatYAxisTicks(val) {
    const split = val.split(' ');
    let stringValue = '';
    for (const item of split) {
      if (stringValue.length + item.length < 16) {
        stringValue += item + (split.length !== 1 ? ' ' : '');
      } else if (stringValue === '') {
        return split[0].substr(0, 16) + (split.length > 1 ? '...' : '');
      }
    }
    return val.length === stringValue.trim().length ? stringValue : stringValue + '...';
  }

  randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

}
