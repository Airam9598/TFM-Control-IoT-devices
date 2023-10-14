import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistryComponent } from './components/registry/registry.component';
import { ErrorComponent } from './components/error/error.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ZonesPageComponent } from './components/zones-page/zones-page.component';

const routes: Routes = [
  {path:'', component:LoadingComponent},
  {path:'home', component:HomeComponent},
  {path:'login', component:LoginComponent},
  {path:'registry', component:RegistryComponent},
  {path:'zones', component:ZonesPageComponent},
  {path:'config', component:ConfigurationComponent},
  {path:'history', component:ZonesPageComponent},
  {path:'loading', component:LoadingComponent},
  //{path:'admin', component:AdministratorComponent,canActivate:[AuthGuard]},

  {path:'error', component:ErrorComponent},
  {path:'**', component:ErrorComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routing: ModuleWithProviders<Object> =RouterModule.forRoot(routes);
