import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistryComponent } from './components/registry/registry.component';
import { ZonesComponent } from './components/zones/zones.component';
import { ErrorComponent } from './components/error/error.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { HistoryComponent } from './components/history/history.component';

const routes: Routes = [
  {path:'', component:LoginComponent},
  {path:'home', component:HomeComponent},
  {path:'login', component:LoginComponent},
  {path:'registry', component:RegistryComponent},
  {path:'zones', component:ZonesComponent},
  {path:'config', component:ConfigurationComponent},
  {path:'history', component:HistoryComponent},
  //{path:'admin', component:AdministratorComponent,canActivate:[AuthGuard]},

  {path:'error', component:ErrorComponent},
  {path:'**', component:ErrorComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routing: ModuleWithProviders<Object> =RouterModule.forRoot(routes);