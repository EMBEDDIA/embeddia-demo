import { Component } from '@angular/core';
// @ts-ignore
import packageJson from '../../package.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  GUI_VERSION = packageJson.version;

  title = 'embeddia-front';
}
