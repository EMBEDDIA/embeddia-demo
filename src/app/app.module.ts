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
import {CommentAnalyzerComponent} from './comment-analyzer/comment-analyzer.component';
import {ArticleAnalyzerComponent} from './article-analyzer/article-analyzer.component';
import {ArticleGenerationComponent} from './article-generation/article-generation.component';
/*import {DashboardComponent} from './dashboard/dashboard.component';*/
import {NzSpaceModule} from 'ng-zorro-antd/space';
import {NzCheckboxModule, NzMenuModule, NzProgressModule} from 'ng-zorro-antd';
import {BarChartModule} from '@swimlane/ngx-charts';
import {NzRadioModule} from 'ng-zorro-antd/radio';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';
import {HealthComponent} from './health/health.component';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzSkeletonModule} from 'ng-zorro-antd/skeleton';
import {HighlightComponent} from './shared/components/highlight/highlight.component';
import {ArrowRightOutline} from '@ant-design/icons-angular/icons';
import {IconDefinition} from '@ant-design/icons-angular';
import {NzIconModule} from 'ng-zorro-antd/icon';

registerLocaleData(en);

const icons: IconDefinition[] = [ArrowRightOutline];

@NgModule({
  declarations: [
    AppComponent,
    CommentAnalyzerComponent,
    ArticleAnalyzerComponent,
    ArticleGenerationComponent,
    /*    DashboardComponent,*/
    HealthComponent,
    HighlightComponent,
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
    NzRadioModule,
    BarChartModule,
    NzCardModule,
    NzSkeletonModule,
    NzCheckboxModule,
    BrowserAnimationsModule,
    NzIconModule.forRoot(icons),
  ],
  providers: [{provide: NZ_I18N, useValue: en_GB}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
