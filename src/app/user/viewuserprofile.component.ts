import { Component, OnInit, Inject } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { ImageService } from './image.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  likes: string;
  filename: string;
  caption: string;
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

  profileUserId: string;
  tiles: Tile[] = [];
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
      var metadataindex = 0;
      while (data[metadataindex] != null) {
        this.getImage(data[metadataindex]);
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

  getImage(imagedata) {
    this.imagesLoading = true;
    this.imageService.getImage(this.downloadImageUrl + imagedata.filename).toPromise().then(data => {
      let reader = new FileReader();
      reader.addEventListener("load", () => {
        this.images.push(reader.result);
        this.tiles.push({
          filename: imagedata.filename,
          likes: imagedata.likes,
          caption: imagedata.caption,
          cols: 1,
          rows: 1,
          color: 'white'
        });
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

  openDialog(image, caption, filename, likes): void {
    const dialogRef = this.dialog.open(ImageDialog, {
      width: '500px',
      data: { filename: filename, image: image, caption: caption, likes: likes }
    });

    dialogRef.afterClosed().subscribe(_result => {
    });
  }

}

export interface CommentsList {
  filename: String;
  comment: String;
  username: String;
}

@Component({
  selector: 'image-dialog',
  templateUrl: './image.dialog.html',
})
export class ImageDialog implements OnInit {

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem("jwtToken"),
  });

  addLikeUrl = 'http://localhost:8924/api/imagemetadata/like/?filename='
  sendCommentUrl = 'http://localhost:8924/api/imagecomments/'
  getCommentsUrl = 'http://localhost:8924/api/imagecomments/getComments/?filename='

  commentsList: CommentsList;
  commentsListLoaded: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ImageDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient) { }

  ngOnInit() {
    console.log(this.getCommentsUrl + this.data.filename);
    this.http.get<any>(this.getCommentsUrl + this.data.filename, { headers: this.headers }).toPromise().then(data => {
      this.commentsList = data;
      console.log(this.commentsList);
      this.commentsListLoaded = true;
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

  getCommentsListLoaded() {
    return this.commentsListLoaded;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  likePic() {
    this.http.post(this.addLikeUrl + this.data.filename, { headers: this.headers }).toPromise().then(_data => { }
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

  sendComment(comment, filename) {
    this.http.post(this.sendCommentUrl, {
      comment: comment,
      filename: filename,
      username: localStorage.getItem('name'),
      userId: localStorage.getItem('userId')
    }
      , { headers: this.headers })
      .toPromise().then(_data => { }
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
}
