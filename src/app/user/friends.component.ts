import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

export interface FriendDetails {
  name: string;
  memberSince: string;
  id: string;
}

@Component({
  selector: 'friends',
  templateUrl: './friends.component.html',
  styleUrls: ['/../app.component.css']
})

export class FriendsComponent implements OnInit {

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem("jwtToken"),
  });

  getFriendsUrl = 'http://localhost:8924/api/friends/user/?userid='
  getFriendDetailsUrl = 'http://localhost:8924/api/user/?id='

  friendIds: string[] = [];
  friendDetails: FriendDetails[] = [];

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.http.get<any>(this.getFriendsUrl + localStorage.getItem('userId'), { headers: this.headers }).subscribe(data => {
      var friendIdIndex = 0;
      while (data[friendIdIndex] != null) {
        this.friendIds.push(data[friendIdIndex].friendId);
        friendIdIndex++;
      }
      for (let i = 0; i < this.friendIds.length; i++) {
        this.http.get<any>(this.getFriendDetailsUrl + this.friendIds[i], { headers: this.headers }).subscribe(data => {
          this.friendDetails.push({name: data.name, memberSince: data.createdAt, id: data.id});
        }
          ,
          (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
              console.log('Client-side error occured.');
            } else {
              console.log('Server-side error occured.');
            }
          }
        )
      }
    }
      ,
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log('Client-side error occured.');
        } else {
          console.log('Server-side error occured.');
        }
      }
    )
  }

  viewProfile(userId) {
    this.router.navigate(['viewuserprofile'], {
      queryParams:
        { userId: userId }
    });
  }
}
