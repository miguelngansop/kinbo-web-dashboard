import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app.routing';
import {AppComponent} from './app.component';

import {FlexLayoutModule} from '@angular/flex-layout';
import {FullComponent} from './layouts/full/full.component';
import {AppBlankComponent} from './layouts/blank/blank.component';
import {AppHeaderComponent} from './layouts/full/header/header.component';
import {AppSidebarComponent} from './layouts/full/sidebar/sidebar.component';
import {AppBreadcrumbComponent} from './layouts/full/breadcrumb/breadcrumb.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DemoMaterialModule} from './demo-material-module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { SharedModule } from './shared/shared.module';
import { SpinnerComponent } from './shared/spinner.component';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import {OAuthModule} from 'angular-oauth2-oidc';
import {ToastrModule} from 'ngx-toastr';
import {HashLocationStrategy, LocationStrategy, registerLocaleData} from '@angular/common';
import localeFrAt from '@angular/common/locales/fr';

registerLocaleData(localeFrAt, 'fr');

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 2,
  wheelPropagation: true
};

@NgModule({
  declarations: [
  AppComponent,
  FullComponent,
  AppHeaderComponent,
  AppBlankComponent,
  SpinnerComponent,
  AppSidebarComponent,
	AppBreadcrumbComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    FormsModule,
    FlexLayoutModule,
    PerfectScrollbarModule,
    HttpClientModule,
    SharedModule,
    NgMultiSelectDropDownModule.forRoot(),
    ToastrModule.forRoot({
      closeButton: true
    }),
    OAuthModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {provide: LOCALE_ID, useValue: 'fr'},
    // [{provide: LocationStrategy, useClass: HashLocationStrategy}]
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
