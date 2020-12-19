import {Component, OnDestroy, OnInit} from '@angular/core';
import {Music} from '../../../models/music';
import {FileUpload} from '../../../shared/image-upload/image-upload.component';
import {ArtistService} from '../../../services/artist.service';
import {GenreService} from '../../../services/genre.service';
import {Artist} from '../../../models/artist';
import {Genre} from '../../../models/genre';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ReplaySubject, Subject} from 'rxjs';
import {debounceTime, delay, tap, filter, map, takeUntil} from 'rxjs/operators';
import {Md5} from 'ts-md5';
import {MusicService} from '../../../services/music.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

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

  artists: Artist[] = [];
  genres: Genre[] = [];

  audioMessage;
  videoMessage;
  form: FormGroup;


  constructor(private artistService: ArtistService, private genreService: GenreService, private musicService: MusicService,
              private toastr: ToastrService, private  fb: FormBuilder, private router: Router) {
    this.artistService.getAll().subscribe((data: Artist[]) => this.artists = data);

    this.genreService.getAll().subscribe((data: Genre[]) => this.genres = data);

    this.form = this.fb.group({
      'nom': [null, Validators.required],
      'artist': [null, Validators.required],
      'genre': [null, Validators.required],
      'lyrics': ['']
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

    // listen for search field value changes
    this.artistServerSideFilteringCtrl.valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searchingArtist = true),
        takeUntil(this._onDestroyArtist),
        debounceTime(200),
        map(search => {
          if (!this.artists) {
            return [];
          }
          // simulate server fetching and filtering data
          return this.artists.filter(artist => artist.nom.toLowerCase().indexOf(search) > -1);
        }),
        delay(500),
        takeUntil(this._onDestroyArtist)
      )
      .subscribe(filteredArtists => {
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
        map(search => {
          if (!this.genres) {
            return [];
          }
          // simulate server fetching and filtering data
          return this.genres.filter(genre => genre.nom.toLowerCase().indexOf(search) > -1);
        }),
        delay(500),
        takeUntil(this._onDestroyGenre)
      )
      .subscribe(filteredGenres => {
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

    this.music = {...this.form.value};
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


    this.musicService.addWithDetails(this.music, this.image.file, imageHashCode, this.audio.file, audioHashCode, this.video.file, videoHashCode).subscribe((rep: Music) => {
      if (rep) {
        this.toastr.success('Nouvelle muisque ajoutée', 'Operation réussie');
        this.router.navigateByUrl('/musics');
      }
      this.loading = false;
    }, (err => {
      console.log('Error', err);
      this.toastr.error('Verifier vos champs', 'Erreur');
      this.loading = false;
    }));
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
    this.video.file = files[0];
  }
}
