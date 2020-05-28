import {Component, OnInit} from '@angular/core';
import {CoreService} from '../core/core.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-health',
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.less']
})
export class HealthComponent implements OnInit {

  disk = 0;
  cpu = 0;
  memory = 0;
  constructor(private coreService: CoreService) {
  }

  // router reuse strat? endpoint is slow
  ngOnInit(): void {
    this.coreService.getHealth().subscribe(x => {
      if (x && !(x instanceof HttpErrorResponse)) {
        this.cpu = x.cpu.percent;
        this.disk =  Math.ceil(x.disk.used / x.disk.total * 100);
        this.memory = Math.ceil(x.memory.used / x.memory.total * 100);
      }
    });
  }

}
