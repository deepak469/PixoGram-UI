import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { ImageService } from './image.service';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-usermedia',
  templateUrl: './usermedia.component.html',
  styleUrls: ['./user.component.css']
})


export class UserMediaComponent implements OnInit {
  title = 'UserMedia';

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem("jwtToken"),
  });

  imageMetadataUrl = 'http://localhost:8924/api/imagemetadata/{userId}'
  downloadImageUrl = 'http://localhost:8924/api/downloadFile/'

  tiles: Tile[] = [];
  imageFilenames: string[];
  imagesLoading: boolean;
  images: any[];


  constructor(private http: HttpClient, private imageService: ImageService) { }

  ngOnInit() {
    let params = new HttpParams();
    params = params.append('userId', localStorage.getItem('userId'));

    this.images = [];

    //Get image imageMetadataUrl
    this.http.get<any>(this.imageMetadataUrl, { headers: this.headers, params }).toPromise().then(data => {
      this.imageFilenames = [];
      var metadataindex = 0;
      while (data[metadataindex] != null) {
        this.imageFilenames.push(data[metadataindex].filename);
        this.tiles.push({ text: this.imageFilenames[metadataindex], cols: 1, rows: 1, color: 'green' });
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
