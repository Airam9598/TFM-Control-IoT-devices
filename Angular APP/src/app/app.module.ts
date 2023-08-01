import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { LoginComponent } from './components/login/login.component';
import { RegistryComponent } from './components/registry/registry.component';
import { HomeComponent } from './components/home/home.component';
import { ZonesComponent } from './components/zones/zones.component';
import { HistoryComponent } from './components/history/history.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { ZoneInfoComponent } from './components/zone-info/zone-info.component';
import { DevicesComponent } from './components/devices/devices.component';
import { ErrorComponent } from './components/error/error.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateComponent } from './components/modals/panel/create/create.component';
import { UserIconComponent } from './components/user-icon/user-icon.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AdvisorComponent } from './components/advisor/advisor.component';
import { SharedDataService } from './shared/data-service';
import { DeleteComponent } from './components/modals/delete/delete.component';
import { EditComponent } from './components/modals/user/edit/edit.component';
import { EditZoneComponent } from './components/modals/zone/edit/edit.component';
import { ListCameraComponent } from './components/modals/camera/list/list.component';
import { AdviseList } from './components/modals/advise/list/list.component';
import { DevListComponent } from './components/modals/device/list/list.component';
import { CreateDevComponent } from './components/modals/device/create/create.component';
import { TranslateModule } from '@ngx-translate/core';
import { HistoryShowComponent } from './components/modals/history-show/history-show.component';
import { EditPermsComponent } from './components/modals/user/edit-perms/edit-perms.component';
import { AddPanelComponent } from './components/modals/user/add-panel/add-panel.component';



@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    LoginComponent,
    RegistryComponent,
    HomeComponent,
    ZonesComponent,
    HistoryComponent,
    ConfigurationComponent,
    ZoneInfoComponent,
    DevicesComponent,
    ErrorComponent,
    CreateComponent,
    UserIconComponent,
    AdvisorComponent,
    DeleteComponent,
    EditComponent,
    EditZoneComponent,
    ListCameraComponent,
    AdviseList,
    DevListComponent,
    CreateDevComponent,
    HistoryShowComponent,
    EditPermsComponent,
    AddPanelComponent
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
