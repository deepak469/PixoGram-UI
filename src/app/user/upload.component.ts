import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FileUploader } from "ng2-file-upload";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { ImageObject } from './image.object';
import { Router } from '@angular/router';
import { ImageAttrService } from './imageattr.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['/../app.component.css']
})
export class UploadComponent implements OnInit {

  uploadFileUrl = 'http://localhost:8924/api/uploadFile';
  imageMetadataUrl = 'http://localhost:8924/api/imagemetadata'

  uploadForm: FormGroup;
  imageObject: ImageObject[] = [];

  public uploader: FileUploader = new FileUploader({
    isHTML5: true
  });

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private imageService: ImageAttrService) { }

  uploadSubmit() {
    for (let i = 0; i < this.uploader.queue.length; i++) {
      let fileItem = this.uploader.queue[i]._file;
      if (fileItem.size > 10000000) {
        alert("Each File should be less than 10 MB of size.");
        return;
      }
    }
    for (let j = 0; j < this.uploader.queue.length; j++) {
      let data = new FormData();
      let fileItem = this.uploader.queue[j]._file;
      data.append('file', fileItem);
      data.append('fileSeq', 'seq' + j);
      data.append('dataType', this.uploadForm.controls.type.value);
      this.http.post(this.uploadFileUrl, data).subscribe((data: any) => {
        this.imageObject.push(new ImageObject(data.fileName, data.fileType, data.size));

        this.http.post(this.imageMetadataUrl, {
          userId: localStorage.getItem("userId"), filename: data.fileName,
          filetype: data.fileType, size: data.size, caption: "", description: ""
        }).subscribe(_data => { }
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
    this.uploader.clearQueue();
    this.imageService.imageObj = this.imageObject;
    this.router.navigate(['imageattr']);
  }

  ngOnInit() {
    this.uploadForm = this.fb.group({
      document: [null, null],
      type: [null, Validators.compose([Validators.required])],
    });
  }
}
