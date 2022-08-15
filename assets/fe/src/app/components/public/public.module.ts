import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { UIRouterModule } from '@uirouter/angular';
import { PUBLIC_ROUTES } from './public.route';
import { GlobalModule } from '../global/global.module';
import { RegisterComponent } from './register/register.component';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    GlobalModule,
    UIRouterModule.forChild({ states: PUBLIC_ROUTES })
  ]
})
export class PublicModule { }
