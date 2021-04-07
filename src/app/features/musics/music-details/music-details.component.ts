import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MusicService} from '../../../services/music.service';
import {BreakpointObserver} from '@angular/cdk/layout';
import {MatDialog} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {Music} from '../../../models/music';
import {PlyrComponent} from 'ngx-plyr';
import * as Plyr from 'plyr';
import {Clipboard} from '@angular/cdk/clipboard';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-music-details',
  templateUrl: './music-details.component.html',
  styleUrls: ['./music-details.component.css']
})
export class MusicDetailsComponent implements OnInit {

  // get the component instance to have access to plyr instance
  @ViewChild(PlyrComponent, {static: true})
  plyr: PlyrComponent;

  // or get it from plyrInit event
  player: Plyr;

  videoSources: Plyr.Source[] = [];

  audioSources = [];

  music: Music;

  constructor(private router: Router, private route: ActivatedRoute, private musicService: MusicService, breakpointObserver: BreakpointObserver,
              private dialog: MatDialog, private toastr: ToastrService, private clipboard: Clipboard, private snackBar: MatSnackBar) {
    this.route.data.subscribe((data: { music: Music }) => {
      this.music = data.music;
      this.videoSources = [
        {
          src: this.music.videoURL,
          type: 'video/mp4',
          size: 10,
        }
      ];

      this.audioSources = [
        {
          src: this.music.audioURL,
          type: 'audio/mp3',
        }
      ];
    });
  }

  ngOnInit(): void {
  }

  copyURL(url) {
    this.clipboard.copy(url);
    this.snackBar.open('Le lien a été copié', null, {
      duration: 2000,
    });
  }

  options: Plyr.Options = {
    captions: {active: true, update: true, language: 'en'},
  };


  played(event: Plyr.PlyrEvent) {
    console.log('played', event);
  }

  play(): void {
    this.player.play(); // or this.plyr.player.play()
  }

  pause(): void {
    this.player.pause(); // or this.plyr.player.play()
  }

  stop(): void {
    this.player.stop(); // or this.plyr.player.stop()
  }
}
