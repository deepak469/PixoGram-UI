import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FileUploader } from "ng2-file-upload";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: 'app-file-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  uploadFileUrl = 'http://localhost:8924/api/uploadFile';
  imageMetadataUrl = 'http://localhost:8924/api/imagemetadata'

  uploadForm: FormGroup;
  filename: String;
  filetype: String;
  size: String;

  public uploader: FileUploader = new FileUploader({
    isHTML5: true
  });

  constructor(private fb: FormBuilder, private http: HttpClient) { }

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
      this.uploadFile(data);
    }
    this.uploader.clearQueue();
  }

  uploadFile(data: FormData) {
    this.http.post(this.uploadFileUrl, data).subscribe((data: any) => {
      let filename = data.fileName;
      let filetype = data.fileType;
      let size = data.size;

      this.http.post(this.imageMetadataUrl, {
        userId: localStorage.getItem("userId"), filename: filename,
        filetype: filetype, size: size, caption: this.uploadForm.get('caption').value, description: this.uploadForm.get('description').value
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

  ngOnInit() {
    this.uploadForm = this.fb.group({
      document: [null, null],
      type: [null, Validators.compose([Validators.required])],
      caption: [null, null],
      description: [null, null]
    });
  }
}
