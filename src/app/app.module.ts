import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars, faHome, faUsers, faCog, faChartBar } from '@fortawesome/free-solid-svg-icons';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import {ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {NgxPaginationModule} from "ngx-pagination";
import {PaginationModule} from "ngx-bootstrap/pagination";
import {authInterceptorProviders} from "./front-office/_helpers/auth.interceptor";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



@NgModule({
  declarations: [
    AppComponent

  ],
  imports: [
    RouterModule.forRoot([]),
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    PaginationModule.forRoot(),
    ReactiveFormsModule
  ],
  providers: [
    authInterceptorProviders // ✅ register here
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    library.add(faBars, faHome, faUsers, faCog, faChartBar);
  }
}
