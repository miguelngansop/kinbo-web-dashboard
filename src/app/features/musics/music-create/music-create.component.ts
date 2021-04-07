import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Music} from '../../../models/music';
import {FileUpload} from '../../../shared/image-upload/image-upload.component';
import {ArtistService} from '../../../services/artist.service';
import {GenreService} from '../../../services/genre.service';
import {Artist} from '../../../models/artist';
import {Genre} from '../../../models/genre';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ReplaySubject, Subject} from 'rxjs';
import {debounceTime, delay, tap, filter, map, takeUntil, concatMap, take} from 'rxjs/operators';
import {Md5} from 'ts-md5';
import {MusicService} from '../../../services/music.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {Album} from '../../../models/album';
import {MatSelect} from '@angular/material/select';

@Component({
  selector: 'app-create',
  templateUrl: './music-create.component.html',
  styleUrls: ['./music-create.component.css']
})
export class MusicCreateComponent implements OnInit, OnDestroy {

  music = <Music>{};
  loading: boolean = false;
  image = <FileUpload>{};
  audio = <FileUpload>{};
  video = <FileUpload>{};
  maxDate = new Date();

  artists: Artist[] = [];
  genres: Genre[] = [];
  albums: Album[] = [];

  audioMessage;
  videoMessage;
  form: FormGroup;
  title = 'Nouvelle musique';

  setAudio: boolean = false;
  setVideo: boolean = false;
  editMode: boolean = false;

  @ViewChild('artistSelect') artistSelect: MatSelect;
  @ViewChild('genreSelect') genreSelect: MatSelect;


  constructor(private artistService: ArtistService, private genreService: GenreService, private musicService: MusicService,
              private toastr: ToastrService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute,) {
    // this.artistService.getAll().subscribe((data: Artist[]) => this.artists = data);
    this.route.data.subscribe((data: { music: Music, title: string, editMode: boolean }) => {
      this.music = data.music;
      this.title = data.title;
      this.editMode = data.editMode;

      // Init data
      if (this.music) {
        if (this.music.artiste) {
          this.artists.push(this.music.artiste);
        }
        if (this.music.genre) {
          this.genres.push(this.music.genre);
        }
        if (this.music.album) {
          this.albums.push(this.music.album);
        }

        this.setAudio = this.music.audioURL != null;
        this.setVideo = this.music.videoURL != null;

      }

    });
  }

  /** control for the selected artist for server side filtering */
  public artistServerSideCtrl: FormControl = new FormControl();

  /** control for filter for server side. */
  public artistServerSideFilteringCtrl: FormControl = new FormControl();

  /** indicate search operation is in progress */
  public searchingArtist = false;

  /** list of artists filtered after simulating server side search */
  public filteredServerSideArtists: ReplaySubject<Artist[]> = new ReplaySubject<Artist[]>(1);

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroyArtist = new Subject<void>();

  /** control for the selected genre for server side filtering */
  public genreServerSideCtrl: FormControl = new FormControl();

  /** control for filter for server side. */
  public genreServerSideFilteringCtrl: FormControl = new FormControl();

  /** indicate search operation is in progress */
  public searchingGenre = false;

  /** list of genres filtered after simulating server side search */
  public filteredServerSideGenres: ReplaySubject<Genre[]> = new ReplaySubject<Genre[]>(1);

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroyGenre = new Subject<void>();


  ngOnInit() {

    this.form = this.fb.group({
      'nom': [this.music?.nom, Validators.required],
      'artiste': [this.music?.artiste, Validators.required],
      'genre': [this.music?.genre, Validators.required],
      'album': [this.music?.album],
      'dateCreation': [this.music?.dateCreation, Validators.required],
      'prix': [this.music?.prix || 0, Validators.required],
      'lyric': [this.music?.lyric]
    });

    if (this.music) {
      // set initial selection and load the initial list
      if (this.music?.artiste) {
        this.artistServerSideCtrl.setValue(this.music?.artiste);
        this.filteredServerSideArtists.next(this.artists.slice());
      }

      if (this.music?.genre) {
        this.genreServerSideCtrl.setValue(this.music?.genre);
        this.filteredServerSideGenres.next(this.genres.slice());
      }

    }

    // listen for search field value changes
    this.artistServerSideFilteringCtrl.valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searchingArtist = true),
        takeUntil(this._onDestroyArtist),
        debounceTime(200),
        concatMap((search) => this.artistService.searchByName(search)),
        // map(search => {
        //   if (!this.artists) {
        //     return [];
        //   }
        //   // simulate server fetching and filtering data
        //   // return this.artists.filter(artist => artist.nom.toLowerCase().indexOf(search) > -1);
        // }),
        delay(500),
        takeUntil(this._onDestroyArtist)
      )
      .subscribe((filteredArtists: Artist[]) => {
          this.searchingArtist = false;
          this.filteredServerSideArtists.next(filteredArtists);
        },
        error => {
          // no errors in our simulated example
          this.searchingArtist = false;
          // handle error...
        });

    // listen for search field value changes
    this.genreServerSideFilteringCtrl.valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searchingGenre = true),
        takeUntil(this._onDestroyGenre),
        debounceTime(200),
        concatMap((search) => this.genreService.searchByName(search)),
        delay(500),
        takeUntil(this._onDestroyGenre)
      )
      .subscribe((filteredGenres: Genre[]) => {
          this.searchingGenre = false;
          this.filteredServerSideGenres.next(filteredGenres);
        },
        error => {
          // no errors in our simulated example
          this.searchingGenre = false;
          // handle error...
        });

  }

  ngOnDestroy() {
    this._onDestroyArtist.next();
    this._onDestroyArtist.complete();

    this._onDestroyGenre.next();
    this._onDestroyGenre.complete();
  }

  onSave() {

    let music = {...this.form.value};
    this.loading = true;
    let imageHashCode;
    if (this.image.url && this.image.file) {
      imageHashCode = Md5.hashAsciiStr(this.image.file.name + new Date()).toString();
    }

    let audioHashCode;
    if (this.audio.url && this.audio.file) {
      audioHashCode = Md5.hashAsciiStr(this.audio.file.name + new Date()).toString();
    }

    let videoHashCode;
    if (this.video.url && this.video.file) {
      videoHashCode = Md5.hashAsciiStr(this.video.file.name + new Date()).toString();
    }

    if (this.editMode) {
      music.id = this.music.id;
      music.audioURL = this.music.audioURL;
      music.videoURL = this.music.videoURL;
      music.image = this.music.image;

      this.musicService.updateWithDetails(music, this.image.file, imageHashCode, this.audio.file, audioHashCode, this.video.file, videoHashCode).subscribe((rep: Music) => {
        if (rep) {
          if (this.music.audioURL != rep.audioURL) {
            this.musicService.createLive(rep).subscribe(_ => {
            }, error => {
              this.loading = false;
              console.log('create live error', error);
              this.toastr.error(error.error, 'Erreur');
            });
          }

          this.toastr.success('Musique mise à jour', 'Operation réussie');
          this.router.navigateByUrl('/musics/' + this.music.id);
          this.loading = false;
        }
      }, (err => {
        console.log('Error', err);
        this.toastr.error('Verifier vos champs', 'Erreur');
        this.loading = false;
      }));

    } else {

      this.musicService.addWithDetails(music, this.image.file, imageHashCode, this.audio.file, audioHashCode, this.video.file, videoHashCode).subscribe((rep: Music) => {
        if (rep) {
          this.musicService.createLive(rep).subscribe(_ => {
          }, error => {
            this.loading = false;
            console.log('create live error', error);
            this.toastr.error(error.error, 'Erreur');
          });

          this.toastr.success('Nouvelle musique ajoutée', 'Operation réussie');
          this.router.navigateByUrl('/musics');
          this.loading = false;
        }
      }, (err => {
        console.log('Error', err);
        this.toastr.error('Verifier vos champs', 'Erreur');
        this.loading = false;
      }));

    }

  }


  onAudioChange(files) {
    this.audioMessage = undefined;
    if (files.length === 0) {
      this.audio.url = undefined;
      return;
    }
    let mineType = files[0].type;
    if (mineType.match(/audio\/*/) == null) {
      this.audioMessage = 'Seulement les audios sont pris en compte';
      this.audio.url = undefined;
      return;
    }
    let reader = new FileReader();
    reader.addEventListener('load', () => this.audio.url = reader.result);
    reader.readAsDataURL(files[0]);
    this.setAudio = true;
    this.audio.file = files[0];
  }


  onVideoChange(files) {
    this.videoMessage = undefined;
    if (files.length === 0) {
      this.video.url = undefined;
      return;
    }
    let mineType = files[0].type;
    if (mineType.match(/video\/*/) == null) {
      this.videoMessage = 'Seulement les videos sont prises en compte';
      this.video.url = undefined;
      return;
    }
    let reader = new FileReader();
    reader.addEventListener('load', () => this.video.url = reader.result);
    reader.readAsDataURL(files[0]);
    this.setVideo = true;
    this.video.file = files[0];
  }

  onArtistChange($event: Artist) {
    this.artistService.getAlbums($event.id).subscribe((data: Album[]) => this.albums = data);
  }
}
