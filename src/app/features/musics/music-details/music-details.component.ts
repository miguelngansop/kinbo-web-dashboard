import {Component, OnInit} from '@angular/core';
import {FileUploader} from 'ng2-file-upload';

@Component({
  selector: 'app-music-details',
  templateUrl: './music-details.component.html',
  styleUrls: ['./music-details.component.css']
})
export class MusicDetailsComponent implements OnInit {

  uploader: FileUploader = new FileUploader({
    url: '',
    isHTML5: true
  });

  constructor() {
  }

  ngOnInit(): void {
  }

}
