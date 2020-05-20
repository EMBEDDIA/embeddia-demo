import {Component, OnInit} from '@angular/core';
import {UtilityFunctions} from '../shared/UtilityFunctions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {
  readonly COLORS = UtilityFunctions.COLORS;
  strokeCap: 'round' | 'square' = 'square';
  strokeWidth = 9; // %
  blockedByModelProgressWidth = 155;
  tags = {
    PER: [
      {
        name: 'Edgar',
        value: 345
      },
    ],

    LOC: [
      {
        name: 'Läti',
        value: 34
      }
    ],

    KEYWORD: [
      {
        name: 'Kriis',
        value: 234
      }
    ]
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
  switchValue;

  constructor() {
  }

  ngOnInit(): void {
    for (let f = 0; f <= 10; f++) {
      this.tags.PER.push({name: Math.random().toString(36).substring(Math.random() * 10), value: Math.random() * 100});
      this.tags.KEYWORD.push({name: Math.random().toString(36).substring(Math.random() * 10), value: Math.random() * 100});
      this.tags.LOC.push({name: Math.random().toString(36).substring(Math.random() * 10), value: Math.random() * 100});
    }
    this.tags.PER = this.tags.PER.sort((a, b) => (a.value < b.value) ? 1 : -1);
    this.tags.KEYWORD = this.tags.KEYWORD.sort((a, b) => (a.value < b.value) ? 1 : -1);
    this.tags.LOC = this.tags.LOC.sort((a, b) => (a.value < b.value) ? 1 : -1);
    console.log(this.tags);

  }

  factSelected(val) {
    this.graphData = this.tags[val];
  }

  switchView(val) {
    console.log(val);
  }

}
