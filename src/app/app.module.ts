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
import { UserMediaComponent } from './user/usermedia.component';
import { FileUploadModule, FileSelectDirective } from 'ng2-file-upload';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'adminhome', component: AdminHomeComponent },
  { path: 'userhome', component: UserHomeComponent },
  { path: 'upload', component: UploadComponent },
  { path: 'media', component: UserMediaComponent },
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
    UserMediaComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' }),
    FileUploadModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    BrowserAnimationsModule,
  ],
  providers: [ImageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
