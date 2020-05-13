import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hate-speech-detection',
  templateUrl: './hate-speech-detection.component.html',
  styleUrls: ['./hate-speech-detection.component.less']
})
export class HateSpeechDetectionComponent implements OnInit {
  values: any[] = [];
  test: any[] = ['f', 'g']
  constructor() { }

  ngOnInit(): void {
  }

}
