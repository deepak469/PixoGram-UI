import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ImageAttrService } from './imageattr.service';
import { ImageObject } from './image.object';
import { Router } from '@angular/router';

@Component({
  selector: 'image-attr',
  templateUrl: './imageattr.component.html',
  styleUrls: ['/../app.component.css']
})

export class ImageAttrComponent implements OnInit {

  @Input() imageObj: ImageObject;

  imageMetadataUpdateUrl = 'http://localhost:8924/api/imagemetadata/update?'

  imageObject: ImageObject[] = [];

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem("jwtToken"),
  });

  constructor(private http: HttpClient, private imageService: ImageAttrService, private router: Router) { }

  async ngOnInit() {
    await this.delay(1000);
    this.imageObject = this.imageService.imageObj;
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  sendImageMetadata() {
    for (let i = 0; i < this.imageObject.length; i++) {
      let currImageMetadataUrl = this.imageMetadataUpdateUrl +
      "filename=" + this.imageObject[i].filename.toString() +
      "&caption=" + this.imageObject[i].caption.toString();

      this.http.post(currImageMetadataUrl, {headers: this.headers}).subscribe(_data => { }
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
      this.router.navigate(['media']);
    }
  }
}
