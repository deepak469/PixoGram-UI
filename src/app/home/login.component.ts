import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { ErrorDialogComponent } from './login-error-dialog.component';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['/../app.component.css']
})

export class LoginComponent {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  username: string;
  password: string;

  loginUrl = 'http://localhost:8924/api/auth/signin'

  constructor(private router: Router, private http: HttpClient, private dialog: MatDialog, private list: MatListModule) { }

  login() {
    this.http.post<any>(this.loginUrl, { username: this.username, password: this.password }, this.httpOptions).subscribe(data => {
      localStorage.setItem("jwtToken", data.accessToken);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("username", this.username);

      switch (data.role) {
        case "1":
          this.router.navigate(['userhome']);
          break;

        case "2":
          this.router.navigate(['adminhome']);
          break;

        default:
          break;
      }
    }
      ,
      (err: HttpErrorResponse) => {
        this.openAlertDialog("Login Failed, check your username and credentials");
        if (err.error instanceof Error) {
          console.log('Client-side error occured.');
        } else {
          console.log(err.message);
          console.log('Server-side error occured.');
        }
      }
    )
  }

  openAlertDialog(inputMessage: string) {
    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      data: {
        message: inputMessage,
        buttonText: {
          cancel: 'Close'
        }
      },
    });
  }
}
