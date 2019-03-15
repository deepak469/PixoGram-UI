import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

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

  constructor(private router: Router, private http: HttpClient) { }

  login(inputUsername, inputPassword) {
    this.http.post<any>(this.loginUrl, {username: inputUsername, password: inputPassword}, this.httpOptions).subscribe(data => {
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
        if (err.error instanceof Error) {
          console.log('Client-side error occured.');
        } else {
          console.log(err.message);
          console.log('Server-side error occured.');
        }
      }
    )
    // this.router.navigate(['login']);
  }
}
