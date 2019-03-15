import { ImageService } from './image.service';
import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpErrorResponse, HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-userhome',
  templateUrl: './userhome.component.html',
  styleUrls: ['./user.component.css']
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

  isProfilePicLoading: boolean;
  profilePicture: any;
  imageToShow: any;

  constructor(private http: HttpClient, private imageService: ImageService) { }

  ngOnInit() {
    //Get user details
    this.http.get<any>(this.getUserDetailsUrl, { headers: this.headers }).subscribe(data => {
      this.fullName = data.name;
      this.profilePictureUri = 'http://localhost:8924/api/downloadFile/' + data.profilePicUri;

      //Load Profile Pciture
      this.isProfilePicLoading = true;
      this.imageService.getImage(this.profilePictureUri).subscribe(data => {

        let reader = new FileReader();
        reader.addEventListener("load", () => {
          this.profilePicture = reader.result;
        }, false);

        if (data) {
          reader.readAsDataURL(data);
        }

        // this.createImageFromBlob(data);
        this.isProfilePicLoading = false;
      }, error => {
        this.isProfilePicLoading = false;
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
}
