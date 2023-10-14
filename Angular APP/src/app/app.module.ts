import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { LoginComponent } from './components/login/login.component';
import { RegistryComponent } from './components/registry/registry.component';
import { HomeComponent } from './components/home/home.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { ZoneInfoComponent } from './components/zone-info/zone-info.component';
import { DevicesComponent } from './components/devices/devices.component';
import { ErrorComponent } from './components/error/error.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserIconComponent } from './components/user-icon/user-icon.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AdvisorComponent } from './components/advisor/advisor.component';
import { SharedDataService } from './shared/data-service';
import { DeleteComponent } from './components/modals/delete/delete.component';
import { AdviseList } from './components/modals/advise/list/list.component';
import { TranslateModule } from '@ngx-translate/core';
import { HistoryShowComponent } from './components/modals/history-show/history-show.component';
import { LoadingComponent } from './components/loading/loading.component';
import { FilterComponent } from './components/filter/filter.component';
import { ZonesPageComponent } from './components/zones-page/zones-page.component';
import { GeneralFormComponent } from './components/general-form/general-form.component';
import { GeneralListComponent } from './components/general-list/general-list.component';



@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    LoginComponent,
    RegistryComponent,
    HomeComponent,
    ConfigurationComponent,
    ZoneInfoComponent,
    DevicesComponent,
    ErrorComponent,
    UserIconComponent,
    AdvisorComponent,
    DeleteComponent,
    AdviseList,
    HistoryShowComponent,
    LoadingComponent,
    FilterComponent,
    ZonesPageComponent,
    GeneralFormComponent,
    GeneralListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    NgApexchartsModule,
    TranslateModule.forRoot({
      defaultLanguage: 'es'
  })
  ],
  providers: [SharedDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
