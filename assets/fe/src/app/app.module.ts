import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { UIRouterModule, UIView } from '@uirouter/angular';
import { APP_ROUTES } from './app.route';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslocoRootModule } from './transloco-root.module';
import { GlobalModule } from './components/global/global.module';
import { TokenService } from './commons/services/interceptors/token.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    UIRouterModule.forRoot(APP_ROUTES),
    HttpClientModule,
    TranslocoRootModule,
    GlobalModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenService, multi: true},
  ],
  bootstrap: [UIView]
})
export class AppModule { }
