import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ImageAttrService } from './imageattr.service';
import { ImageObject } from './image.object';

@Component({
  selector: 'image-attr',
  templateUrl: './imageattr.component.html',
  styleUrls: ['./user.component.css']
})

export class ImageAttrComponent implements OnInit{

  @Input() imageObj: ImageObject

  imageMetadataUrl = 'http://localhost:8924/api/imagemetadata'

  imageObject: ImageObject[] = [];

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem("jwtToken"),
  });

  constructor(private http: HttpClient, private imageService: ImageAttrService) {}

  ngOnInit() {
    this.imageObject = this.imageService.imageObj;
    console.log(this.imageObject);
  }


  // addMetadata(){
  //   this.http.post(this.imageMetadataUrl, {
  //     userId: localStorage.getItem("userId"), filename: filename,
  //     filetype: filetype, size: size, caption: this.uploadForm.get('caption').value, description: this.uploadForm.get('description').value
  //   }).subscribe(_data => { }
  //     ,
  //     (err: HttpErrorResponse) => {
  //       if (err.error instanceof Error) {
  //         console.log('Client-side error occured.');
  //       } else {
  //         console.log(err.message);
  //         console.log('Server-side error occured.');
  //       }
  //     }
  //   )
  // }


}
