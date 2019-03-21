import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ImageObject } from './image.object';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'image-attr',
  templateUrl: './editimageattr.component.html',
  styleUrls: ['./user.component.css']
})

export class EditImageAttrComponent implements OnInit {

  @Input() imageObj: ImageObject;

  imageMetadataGetUrl = 'http://localhost:8924/api/imagemetadata/{id}';
  imageMetadataUpdateUrl = 'http://localhost:8924/api/imagemetadata/update?'

  imageObject: ImageObject[] = [];
  fileId: string = "";
  filename: string = "";
  currCaption: string = "";
  currDescription: string = "";
  updtCaption: string = "";
  updtDescription: string = "";
  dataLoaded: boolean = false;

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem("jwtToken"),
  });

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.fileId = params.id;

      let httpparams = new HttpParams();
      httpparams = httpparams.append('userId', this.fileId);
      //Get image imageMetadataUrl
      this.http.get<any>(this.imageMetadataGetUrl, { headers: this.headers, params }).toPromise().then(data => {
        this.filename = data.filename;
        this.currCaption = data.caption;
        this.currDescription = data.description;
        this.dataLoaded = true;
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
    })
  }

  sendImageMetadata() {
    console.log(this.updtCaption);
    let currImageMetadataUrl = this.imageMetadataUpdateUrl +
      "filename=" + this.filename +
      "&caption=" + this.updtCaption +
      "&description=" + this.updtDescription;

    this.http.post(currImageMetadataUrl, { headers: this.headers }).toPromise().then(_data => {
      this.router.navigate(['media']);
    }

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
