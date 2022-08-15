import { Component } from '@angular/core';
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { StateService } from '@uirouter/angular';
import "src/app/commons/constants/dayjs.constant";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'fe';
  constructor(
    public modalDefaultConfig: NgbModalConfig
    ) {
      modalDefaultConfig.centered = true;
      modalDefaultConfig.size = "free";
  }
}
