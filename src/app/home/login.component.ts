import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { LoginErrorDialogComponent } from './login-error-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./home.component.css']
})

export class LoginComponent {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  loginUrl = 'http://localhost:8924/api/auth/signin'

  constructor(private router: Router, private http: HttpClient, private dialog: MatDialog) { }

  login(inputUsername, inputPassword) {
    this.http.post<any>(this.loginUrl, { username: inputUsername, password: inputPassword }, this.httpOptions).subscribe(data => {
      console.log(data)
      localStorage.setItem("jwtToken", data.accessToken);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userId", data.userId);

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
        this.openAlertDialog(err.message);
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
    const dialogRef = this.dialog.open(LoginErrorDialogComponent, {
      data: {
        message: inputMessage,
        buttonText: {
          cancel: 'Close'
        }
      },
    });
  }
}
