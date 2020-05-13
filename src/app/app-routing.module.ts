import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HateSpeechDetectionComponent} from './hate-speech-detection/hate-speech-detection.component';
import {EntityExtractionComponent} from './entity-extraction/entity-extraction.component';
import {ArticleGenerationComponent} from './article-generation/article-generation.component';
import {DashboardComponent} from './dashboard/dashboard.component';


const routes: Routes = [
  {
    path: 'hate-speech-detection',
    pathMatch: 'full',
    component: HateSpeechDetectionComponent
  },
  {
    path: 'entity-extraction',
    pathMatch: 'full',
    component: EntityExtractionComponent
  },
  {
    path: 'article-generation',
    pathMatch: 'full',
    component: ArticleGenerationComponent
  },
  {
    path: 'dashboard',
    pathMatch: 'full',
    component: DashboardComponent
  },
  {
    path: '**',
    redirectTo: ''
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
