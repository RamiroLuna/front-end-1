import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './auth/token.interceptor';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MaterializeModule } from 'angular2-materialize';
import { RouterModule, Routes } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { NotAuthGuard } from './auth/not.auth.guard';
import { MenuComponent } from './menu/menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersModule } from './users/users.module'; 
import { OeeModule } from './oee/oee.module'; 
import { NgPipesModule } from 'ngx-pipes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuPrincipalComponent } from './menu-principal/menu-principal.component';
import { CatalogosGeneralesComponent } from './catalogos-generales/catalogos-generales.component';
import { ListByCatalogComponent } from './catalogos-generales/list-by-catalog/list-by-catalog.component';



const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent, canActivate: [NotAuthGuard] },
  {
    path: 'home', component: HomeComponent, canActivate: [AuthGuard],children: [
      { path: '', component:  MenuPrincipalComponent},
      { path: 'usuarios', loadChildren: './users/users.module#UsersModule' },
      { path: 'oee', loadChildren: './oee/oee.module#OeeModule' },
      { path: 'etad', loadChildren: './etad/etad.module#EtadModule' },
      { path: 'catalogos-generales' , component: CatalogosGeneralesComponent },
      { path: 'catalogos-generales/:name', component: ListByCatalogComponent }
    ]
  }
];


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    MenuComponent,
    MenuPrincipalComponent,
    CatalogosGeneralesComponent,
    ListByCatalogComponent,
  ],
  imports: [
    BrowserModule,
    MaterializeModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    NgPipesModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes, { useHash: true })
  ],
  providers: [
    AuthService,
    NotAuthGuard,
    AuthGuard,
    {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }
],
bootstrap: [AppComponent]


})
export class AppModule { }
