import { ImageService } from './image.service';
import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-userhome',
  templateUrl: './userhome.component.html',
  styleUrls: ['/../app.component.css']
})
export class UserHomeComponent implements OnInit {
  title = 'UserHome';

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem("jwtToken"),
  });

  getUserDetailsUrl = "http://localhost:8924/api/user/?id=" + localStorage.getItem("userId")
  getProfilePictureUrl = "http://localhost:8924/api/downloadFile/"

  fullName: string;
  profilePictureUri: string;
  dateJoined: string;

  isPicturesLoading: boolean;
  profilePicture: any;
  imageToShow: any;

  constructor(private http: HttpClient, private imageService: ImageService, private router: Router) { }

  ngOnInit() {
    //Get user details
    this.http.get<any>(this.getUserDetailsUrl, { headers: this.headers }).subscribe(data => {
      this.fullName = data.name;
      localStorage.setItem('name', data.name);
      this.dateJoined = data.createdAt;
      this.profilePictureUri = 'http://localhost:8924/api/downloadFile/' + data.profilePicUri;

      //Load Profile Pciture
      this.isPicturesLoading = true;
      this.imageService.getImage(this.profilePictureUri).subscribe(data => {

        let reader = new FileReader();
        reader.addEventListener("load", () => {
          this.profilePicture = reader.result;
        }, false);

        if (data) {
          reader.readAsDataURL(data);
        }

        // this.createImageFromBlob(data);
        this.isPicturesLoading = false;
      }, error => {
        this.isPicturesLoading = false;
        console.log(error);
      });

    },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log('Client-side error occured.');
        } else {
          console.log('Server-side error occured.');
        }
      }
    )
  }

  changeProfilePic(){
    this.router.navigate(['changeprofilepic'])
  }
}
