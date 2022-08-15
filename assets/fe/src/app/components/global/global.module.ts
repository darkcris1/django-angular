import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/commons/pipes/pipes.module';
import { DirectivesModule } from 'src/app/commons/directives/directives.module';
import { TranslocoModule } from '@ngneat/transloco';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastComponent } from './toast/toast.component';

@NgModule({
  declarations: [
    ToastComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PipesModule,
    DirectivesModule,
    TranslocoModule,
    NgbModule
  ],
  exports: [
    ReactiveFormsModule,
    PipesModule,
    DirectivesModule,
    TranslocoModule,
    NgbModule,
    ToastComponent
  ]
})
export class GlobalModule { }
