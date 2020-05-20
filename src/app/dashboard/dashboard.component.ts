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
        tag: 'Edgar',
        count: 345
      },
    ],

    LOC: [
      {
        tag: 'Läti',
        count: 34
      }
    ],

    KEYWORD: [
      {
        tag: 'Kriis',
        count: 234
      }
    ]
  };
  tagsKeys = Object.keys(this.tags);

  constructor() {
  }

  ngOnInit(): void {
    for (let f = 0; f <= 20; f++) {
      this.tags.PER.push({tag: Math.random().toString(36).substring(Math.random() * 10), count: Math.random()});
      this.tags.KEYWORD.push({tag: Math.random().toString(36).substring(Math.random() * 10), count: Math.random()});
      this.tags.LOC.push({tag: Math.random().toString(36).substring(Math.random() * 10), count: Math.random()});
    }
  }

}
