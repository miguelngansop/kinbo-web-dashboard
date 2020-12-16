import {Component, Input, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {ManageFileService} from '../../services/manage-file.service';

@Component({
  selector: 'app-load-image',
  templateUrl: './load-image.component.html',
  styleUrls: ['./load-image.component.scss']
})
export class LoadImageComponent implements OnInit {

  @Input('fileName') fileName: string;
  @Input('height') height: number = 300;
  @Input('width') width: number = 100;
  @Input('isRounded') isRounded: boolean = true;
  @Input() class: string = '';

  imageToShow: any;
  isImageLoading: boolean;

  constructor(private uploadService: ManageFileService, public sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    if (this.fileName) {
      this.getImageFromService();
    }
  }

  private getImageFromService() {
    this.isImageLoading = true;
    this.uploadService.getFile(this.fileName).subscribe((data) => {
      this.createImageFromBlob(data);
    }, err => {
      this.isImageLoading = false;
    });
  }

  private createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener('load', () => {
        this.imageToShow = reader.result;
        this.isImageLoading = false;
      },
      false);
    if (image) {
      reader.readAsDataURL(image);
    }
  }

}
