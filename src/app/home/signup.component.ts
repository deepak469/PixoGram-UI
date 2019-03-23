import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['/../app.component.css']
})

export class SignupComponent {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  signupUrl = "http://localhost:8924/api/auth/signup";
  checkUsernameUrl = "http://localhost:8924/api/user/checkusername/?username="
  usernameInUse = null;

  username: string;
  name: string;
  email: string;
  password: string;
  contactNum: string;

  constructor(private router: Router, private http: HttpClient) { }

  signup() {
    this.http.post<any>(this.signupUrl, {
      name: this.name, username: this.username, email: this.email,
      role: ['user'], password: this.password, contactNum: this.contactNum
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

  checkusername(){
    this.http.get<any>(this.checkUsernameUrl + this.username, this.httpOptions).subscribe(data =>
    {
      this.usernameInUse = data;
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
  }

  getUsernameInUse(){
    return this.usernameInUse;
  }
}
