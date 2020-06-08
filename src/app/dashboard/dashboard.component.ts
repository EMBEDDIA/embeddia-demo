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
  tags: { PER: GraphData[], LOC: GraphData[], ORG: GraphData[] } = {
    PER: [],
    LOC: [],
    ORG: []
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
  PERVALS =  [
    {
      key: 'Bengals',
      doc_count: 278
    },
    {
      key: 'Kalju',
      doc_count: 121
    },
    {
      key: 'Kalev',
      doc_count: 118
    },
    {
      key: 'Levadia',
      doc_count: 111
    },
    {
      key: 'Savisaar',
      doc_count: 92
    },
    {
      key: 'Koit',
      doc_count: 83
    },
    {
      key: 'Vettel',
      doc_count: 82
    },
    {
      key: 'Rüütel',
      doc_count: 78
    },
    {
      key: 'Edgar Savisaar',
      doc_count: 75
    },
    {
      key: 'Anu',
      doc_count: 73
    }
  ];
  LOCVALS = [
    {
      key: 'Eesti',
      doc_count: 2524
    },
    {
      key: 'Tallinn',
      doc_count: 541
    },
    {
      key: 'Euroopa',
      doc_count: 389
    },
    {
      key: 'Venemaa',
      doc_count: 372
    },
    {
      key: 'Soome',
      doc_count: 323
    },
    {
      key: 'USA',
      doc_count: 317
    },
    {
      key: 'Itaalia',
      doc_count: 285
    },
    {
      key: 'Saksamaa',
      doc_count: 281
    },
    {
      key: 'Türgi',
      doc_count: 223
    },
    {
      key: 'Hispaania',
      doc_count: 216
    }];
  ORGVALS = [
    {
      key: 'Keskerakond',
      doc_count: 196
    },
    {
      key: 'IRL',
      doc_count: 166
    },
    {
      key: 'Reformierakond',
      doc_count: 145
    },
    {
      key: 'ERR',
      doc_count: 137
    },
    {
      key: 'õhtuleht',
      doc_count: 135
    },
    {
      key: 'NBA',
      doc_count: 128
    },
    {
      key: 'ETV',
      doc_count: 119
    },
    {
      key: 'Ferrari',
      doc_count: 101
    },
    {
      key: 'TV3',
      doc_count: 99
    },
    {
      key: 'MM',
      doc_count: 83
    }];
  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }

  @HostListener('window:resize')
  onResize() {
    this.calculateProgressBarSize();
  }

  ngOnInit(): void {
    for (let f = 0; f < 10; f++) {
      this.tags.PER.push({
        name: this.PERVALS[f].key, value: this.PERVALS[f].doc_count, extra: {date: this.randomDate(new Date(2012, 0, 1), new Date())}
      });
      this.customColors.push({name: this.PERVALS[f].key, value: this.COLORS.PER});
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
    this.selectedFact = ['PER', 'LOC', 'ORG'];
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
