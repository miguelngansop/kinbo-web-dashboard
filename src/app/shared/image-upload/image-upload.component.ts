import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

export interface FileUpload {
  url:any,
  file:File
}
@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {

  @Output() file =  new EventEmitter<FileUpload>();
  @Input() fileName:string ;
  @Input() title: string = 'Photo';

  message: string;
  fileUpload = <FileUpload>{};


  isEditMode: boolean = false;
  haveSetNewImage: boolean = false;//Si on modifie l'image en mode modification
  hashcode: string;



  ngOnInit(): void {
  }


  preview(files) {
    this.message = undefined;
    if (files.length === 0) {
      this.fileUpload.url = undefined;
      // this.haveSetNewImage = false;
      return;
    }
    let mineType = files[0].type;
    if (mineType.match(/image\/*/) == null) {
      this.message = 'Seulement les images sont prises en compte';
      this.fileUpload.url = undefined;
      // this.correctImage = false;
      // this.haveSetNewImage = false;
      return;
    }
    let reader = new FileReader();
    reader.addEventListener('load', () => this.fileUpload.url = reader.result);
    reader.readAsDataURL(files[0]);
    // this.correctImage = true;
    this.fileUpload.file= files[0];
    this.haveSetNewImage = true;

    this.file.emit(this.fileUpload)
  }
}
