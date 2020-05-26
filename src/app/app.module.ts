import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {en_GB, NZ_I18N} from 'ng-zorro-antd/i18n';
import {registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzMessageModule} from 'ng-zorro-antd/message';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {NzTagModule} from 'ng-zorro-antd/tag';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';
import {NzTypographyModule} from 'ng-zorro-antd/typography';
import {HateSpeechDetectionComponent} from './hate-speech-detection/hate-speech-detection.component';
import {EntityExtractionComponent} from './entity-extraction/entity-extraction.component';
import {ArticleGenerationComponent} from './article-generation/article-generation.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {NzSpaceModule} from 'ng-zorro-antd/space';
import {NzMenuModule, NzProgressModule} from 'ng-zorro-antd';
import {BarChartModule} from '@swimlane/ngx-charts';
import {NzSwitchModule} from 'ng-zorro-antd/switch';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    HateSpeechDetectionComponent,
    EntityExtractionComponent,
    ArticleGenerationComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzLayoutModule,
    NzDatePickerModule,
    NzMessageModule,
    NzSelectModule,
    NzSpinModule,
    NzTagModule,
    NzMenuModule,
    NzToolTipModule,
    NzTypographyModule,
    NzSpinModule,
    NzSpaceModule,
    NzProgressModule,
    NzSwitchModule,
    BarChartModule,
    BrowserAnimationsModule
  ],
  providers: [{provide: NZ_I18N, useValue: en_GB}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
