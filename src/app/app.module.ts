import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ImageService } from './user/image.service';
import { HomeComponent } from './home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './home/login.component';
import { SignupComponent } from './home/signup.component';
import { HttpClientModule } from '@angular/common/http';
import { AdminHomeComponent } from './admin/adminhome.component';
import { UserHomeComponent } from './user/userhome.component';
import { LogoutComponent } from './home/logout.component';
import { UploadComponent } from './user/upload.component';


export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'adminhome', component: AdminHomeComponent },
  { path: 'userhome', component: UserHomeComponent },
  { path: 'upload', component: UploadComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    LogoutComponent,
    SignupComponent,
    AdminHomeComponent,
    UserHomeComponent,
    UploadComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' }),
  ],
  providers: [ImageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
