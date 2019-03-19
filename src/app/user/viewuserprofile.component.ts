import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { ImageService } from './image.service';
import { ActivatedRoute } from '@angular/router';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-usermedia',
  templateUrl: './viewuserprofile.component.html',
  styleUrls: ['./user.component.css']
})

export class ViewUserProfileComponent implements OnInit {
  title = 'UserMedia';

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem("jwtToken"),
  });

  imageMetadataUrl = 'http://localhost:8924/api/imagemetadata/{userId}'
  downloadImageUrl = 'http://localhost:8924/api/downloadFile/'

  profileUserId: string;
  tiles: Tile[] = [];
  imageFilenames: string[];
  caption: string[];
  imagesLoading: boolean;
  images: any[];

  constructor(private http: HttpClient, private imageService: ImageService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.profileUserId = params.userId;
    })

    let params = new HttpParams();
    params = params.append('userId', this.profileUserId);

    this.images = [];

    //Get image imageMetadataUrl
    this.http.get<any>(this.imageMetadataUrl, { headers: this.headers, params }).toPromise().then(data => {
      this.imageFilenames = [];
      this.caption = [];
      var metadataindex = 0;
      while (data[metadataindex] != null) {
        this.imageFilenames.push(data[metadataindex].filename);
        this.caption.push(data[metadataindex].caption);
        this.tiles.push({ text: this.imageFilenames[metadataindex], cols: 1, rows: 1, color: 'green'});
        this.getImage(data[metadataindex].filename);
        metadataindex++;
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
    console.log(this.images);
  }

  getImage(imageFilename) {
    this.imagesLoading = true;
    this.imageService.getImage(this.downloadImageUrl + imageFilename).toPromise().then(data => {
      let reader = new FileReader();
      reader.addEventListener("load", () => {
        this.images.push(reader.result);
      }, false);

      if (data) {
        reader.readAsDataURL(data);
      }
      this.imagesLoading = false;
    }, error => {
      this.imagesLoading = false;
      console.log(error);
    }
    )
  }
}
