import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import {UtilityFunctions} from '../shared/UtilityFunctions';

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
  tags = {
    PER: [],
    LOC: [],
    KEYWORD: []
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
  graphData = [];


  isLoading = false;
  selectedDataset: string;
  selectedRange;
  dataset = [{value: 'test', display_name: 'test2'}, {value: 'test5', display_name: 'test3'}];
  customColors = [];

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }

  @HostListener('window:resize')
  onResize() {
    this.calculateProgressBarSize();
  }

  ngOnInit(): void {
    for (let f = 0; f <= 10; f++) {
      const perName = Math.random().toString(36).substring(Math.random() * 10);
      this.tags.PER.push({
        name: perName, value: Math.floor(Math.random() * 100)
      });
      this.customColors.push({name: perName, value: this.COLORS.PER});
      const keyName = Math.random().toString(36).substring(Math.random() * 10);
      this.tags.KEYWORD.push({
        name: keyName, value: Math.floor(Math.random() * 100)
      });
      this.customColors.push({name: keyName, value: this.COLORS.KEYWORD});
      const locName = Math.random().toString(36).substring(Math.random() * 10);
      this.tags.LOC.push({
        name: locName,
        value: Math.floor(Math.random() * 100)
      });
      this.customColors.push({name: locName, value: this.COLORS.LOC});
    }
    this.selectedFact = ['PER', 'LOC', 'KEYWORD'];
    this.factSelected(this.selectedFact);
    this.calculateProgressBarSize();

  }

  calculateProgressBarSize() {
    const windowHeight = window.innerHeight;
    if (windowHeight <= 790) {
      this.blockedByModelProgressWidth = 88;
      this.commentsOkProgressWidth = 108;
    }else if (windowHeight <= 876) {
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

  factSelected(val) {
    const temp = [];
    for (const key of val) {
      temp.push(...this.tags[key]);
    }
    temp.sort((a, b) => (a.value < b.value) ? 1 : -1);
    this.graphData = temp;
    console.log(this.graphData);
  }

  submitForm() {
    console.log(this.selectedRange);
    console.log(this.selectedDataset);
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
}
