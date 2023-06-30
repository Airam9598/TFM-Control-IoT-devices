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
import { HttpClientModule } from '@angular/common/http';

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
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
