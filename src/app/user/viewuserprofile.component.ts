import { Component, OnInit, Inject } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { ImageService } from './image.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
  likes: string;
}

@Component({
  selector: 'app-usermedia',
  templateUrl: './viewuserprofile.component.html',
  styleUrls: ['/../app.component.css']
})

export class ViewUserProfileComponent implements OnInit {
  title = 'UserMedia';

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem("jwtToken"),
  });

  imageMetadataUrl = 'http://localhost:8924/api/imagemetadata/{userId}'
  downloadImageUrl = 'http://localhost:8924/api/downloadFile/'
  addLikeUrl = 'http://localhost:8924/api/imagemetadata/like/'

  profileUserId: string;
  tiles: Tile[] = [];
  imageFilenames: string[];
  caption: string[];
  imagesLoading: boolean;
  images: any[];

  constructor(private http: HttpClient, private imageService: ImageService, private route: ActivatedRoute, public dialog: MatDialog) { }

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
        console.log(data[metadataindex]);
        this.imageFilenames.push(data[metadataindex].filename);
        this.caption.push(data[metadataindex].caption);
        this.tiles.push({ text: this.imageFilenames[metadataindex], likes: data[metadataindex].likes, cols: 1, rows: 1, color: 'green'});
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

  likePic(filename){
    let currImageMetadataUrl = this.addLikeUrl + "?filename=" + filename;

    this.http.post(currImageMetadataUrl, { headers: this.headers }).toPromise().then(_data => {}
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

  openDialog(): void {
    console.log("Clicked")
    const dialogRef = this.dialog.open(ImageDialog, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(_result => {
    });
  }

}

@Component({
  selector: 'image-dialog',
  templateUrl: './image.dialog.html',
})
export class ImageDialog {

  constructor(
    public dialogRef: MatDialogRef<ImageDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
