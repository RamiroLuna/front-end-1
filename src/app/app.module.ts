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
import { MenuComponent } from './menu/menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CatalogsModule } from './catalogs/catalogs.module';
import { UsersModule } from './users/users.module'; 
import { CuaModule } from './cua/cua.module'; 
import { NgPipesModule } from 'ngx-pipes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'home', component: HomeComponent, canActivate: [AuthGuard], children: [
      { path: 'catalogos', loadChildren: './catalogs/catalogs.module#CatalogsModule' },
      { path: 'usuarios', loadChildren: './users/users.module#UsersModule' },
      { path: 'cua', loadChildren: './cua/cua.module#CuaModule' }
    ]
  }
];


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    MaterializeModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    NgPipesModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    AuthService,
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
