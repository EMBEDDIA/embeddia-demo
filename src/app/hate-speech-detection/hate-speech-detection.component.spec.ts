import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HateSpeechDetectionComponent } from './hate-speech-detection.component';

describe('HateSpeechDetectionComponent', () => {
  let component: HateSpeechDetectionComponent;
  let fixture: ComponentFixture<HateSpeechDetectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HateSpeechDetectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HateSpeechDetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
