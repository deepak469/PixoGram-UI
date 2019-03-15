import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./home.component.css']
})

export class SignupComponent {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  signupUrl = "http://localhost:8924/api/auth/signup";

  constructor(private router: Router, private http: HttpClient) { }

  signup(inputUsername, inputPassword, inputEmail, inputName, inputContactNum) {
    this.http.post<any>(this.signupUrl, {
      name: inputName, username: inputUsername, email: inputEmail,
      role: ['user'], password: inputPassword, contactNum: inputContactNum
    }, this.httpOptions).subscribe(_data => { }
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
    this.router.navigate(['login']);
  }
}
