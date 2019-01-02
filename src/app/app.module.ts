import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicModule, NavController } from 'ionic-angular';
import { TranslateLoader, TranslateModule, TranslateStaticLoader } from 'ng2-translate/ng2-translate';
import { MomentModule } from 'angular2-moment';
import { DashoApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { MainPage } from '../pages/main/main';
import { UserProvider } from '../providers/user';
import { LanguageProvider } from '../providers/language';
import { DashboardService } from '../pages/main/main.service';
import { LoginService } from '../pages/login/login.service';
import { Clock } from './tiles/clock/clock';
import { Currency } from './tiles/currency/currency';
import { Github } from './tiles/github/github';
import { News } from './tiles/news/news';
import { Google } from './tiles/google/google';
import { Twitter } from './tiles/twitter/twitter';
import { Weather } from './tiles/weather/weather';
import { ArraySort } from '../shared/shared.sort';
import { BrowserModule } from '@angular/platform-browser';
import { IonicStorageModule } from '@ionic/storage';
import { Http } from '@angular/http';
import { HighchartsChartModule } from 'highcharts-angular';
import { SettingPage } from '../pages/setting/setting';
import { SettingService } from '../pages/setting/setting.service';

/**
 * Set the paths for the tranlsations
 */
export function createTranslateLoader(http: Http): TranslateStaticLoader {
  return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

@NgModule({
  declarations: [
    DashoApp,
    LoginPage,
    MainPage,
    SettingPage,
    Clock,
    Currency,
    Github,
    News,
    Google,
    Twitter,
    Weather,
    ArraySort
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    }),
    MomentModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(DashoApp),
    HighchartsChartModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    DashoApp,
    LoginPage,
    MainPage,
    SettingPage
  ],
  providers: [
    UserProvider,
    LanguageProvider,
    DashboardService,
    SettingService,
    LoginService
  ]
})

/**
 * Represents the App Module
 */
export class AppModule { }
