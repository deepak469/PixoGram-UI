import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpErrorResponse, HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'change-profile-pic',
  templateUrl: './changeprofilepic.component.html',
  styleUrls: ['/../app.component.css']
})

export class ChangeProfilePicComponent implements OnInit {

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem("jwtToken"),
  });

  getUserDetailsUrl = "http://localhost:8924/api/user/?id=" + localStorage.getItem("userId");
  imageMetadataUrl = 'http://localhost:8924/api/imagemetadata/{userId}';
  updateProfilePicUrl = 'http://localhost:8924/api/user/updateprofilepic/';

  currentProfilePic: string;
  availableImages: string[] = [];
  retrievalFinished: boolean = false;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.http.get<any>(this.getUserDetailsUrl, { headers: this.headers }).subscribe(data => {
      this.currentProfilePic = data.profilePicUri;
    },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log('Client-side error occured.');
        } else {
          console.log('Server-side error occured.');
        }
      }
    )

    let params = new HttpParams();
    params = params.append('userId', localStorage.getItem('userId'));

    this.http.get<any>(this.imageMetadataUrl, { headers: this.headers, params }).subscribe(data => {
      var metadataindex = 0;
      while (data[metadataindex] != null) {
        this.availableImages.push(data[metadataindex].filename)
        metadataindex++
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
    this.retrievalFinished = true;
  }

  selectNewPic(inputFilename) {
    let updateProfilePic = this.updateProfilePicUrl +
      "?profilePicUri=" + inputFilename +
      "&id=" + localStorage.getItem('userId')
    this.http.put<any>(updateProfilePic, { headers: this.headers }).subscribe(_data => {
      this.router.navigate(['userhome'])
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

  getRetrievalFinished() {
    return this.retrievalFinished;
  }
}
